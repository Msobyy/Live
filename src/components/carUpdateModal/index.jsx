import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { Updatedocdata, AddDoc, generateRandomId } from 'utils/firebaseutils';
import StandardImageList from 'components/imagelist';
import { toast } from 'react-toastify';
import Loader from 'components/Loader';

const emptyObj = {
  brand: '',
  model: '',
  year: '',
  category: '',
  seats: '',
  price: '',
  fuel: '',
  bluetooth: false,
  charger: false,
  vehicleNo: '',
  isAvailable: false,
  engineSize: '',
  water: false,
  wifi: false,
  imagesList: []
};
const emptyNewObj = {
  brand: '',
  model: '',
  year: '',
  category: '',
  seats: '',
  price: '',
  fuel: '',
  bluetooth: false,
  charger: false,
  vehicleNo: '',
  isAvailable: false,
  engineSize: '',
  carId: '',
  water: false,
  wifi: false,
  imagesList: [],
  carOwner: {
    email: '',
    id: '',
    phoneNo: '',
    name: ''
  }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CarUpdateModal({ message, open, handleClose, car, handleUpdateAgree, isNew }) {
  const [initialValues, setInitialValues] = useState(() => (isNew ? emptyNewObj : emptyObj));
  const [updateImage, setupdateImage] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (car) {
      setPreviousData();
    }
  }, [car]);

  const setPreviousData = () => {
    if (!isNew) {
      setInitialValues({
        brand: car?.brand,
        model: car?.model,
        year: car?.year,
        category: car?.category,
        seats: car?.seats,
        price: car?.price,
        fuel: car?.fuel,
        bluetooth: car?.bluetooth,
        charger: car?.charger,
        vehicleNo: car?.vehicleNo,
        isAvailable: car?.isAvailable,
        engineSize: car?.engineSize,
        water: car?.water,
        wifi: car?.wifi,
        imagesList: car?.imagesList
      });
      setupdateImage(car?.imagesList);
    } else {
      setInitialValues((prevValues) => ({
        ...prevValues,
        carOwner: {
          email: car?.email,
          id: car?.userId,
          name: car?.name,
          phoneNo: car?.phoneNo
        }
      }));
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setInitialValues((prevValues) => ({
      ...prevValues,
      [name]: newValue
    }));
  };
  const validateFields = (updatedCar) => {
    delete updatedCar.id;

    if (initialValues.brand) {
      updatedCar.brand = initialValues.brand;
    }
    if (initialValues.model) {
      updatedCar.model = initialValues.model;
    }
    if (initialValues.year) {
      updatedCar.year = initialValues.year;
    }
    if (initialValues.category) {
      updatedCar.category = initialValues.category;
    }
    if (initialValues.seats) {
      updatedCar.seats = initialValues.seats;
    }
    if (initialValues.price) {
      updatedCar.price = initialValues.price;
    }
    if (initialValues.fuel) {
      updatedCar.fuel = initialValues.fuel;
    }
    if (initialValues.bluetooth !== null) {
      updatedCar.bluetooth = initialValues.bluetooth;
    }
    if (initialValues.charger !== null) {
      updatedCar.charger = initialValues.charger;
    }
    if (initialValues.wifi !== null) {
      updatedCar.wifi = initialValues.wifi;
    }
    if (initialValues.vehicleNo) {
      updatedCar.vehicleNo = initialValues.vehicleNo;
    }
    if (initialValues.isAvailable !== null) {
      updatedCar.isAvailable = initialValues.isAvailable;
    }
    if (initialValues.water !== null) {
      updatedCar.water = initialValues.water;
    }
    if (initialValues.engineSize) {
      updatedCar.engineSize = initialValues.engineSize;
    }
    initialValues.imagesList = updateImage;
    updatedCar.imagesList = updateImage;
    return updatedCar;
  };

  const validateNewData = () => {
    const isValidPrice = (price) => {
      // Check if price is a valid numeric string
      return typeof price === 'string' && /^[0-9]+(\.[0-9]+)?$/.test(price);
    };

    if (
      !initialValues.brand ||
      !initialValues.model ||
      !initialValues.year ||
      !initialValues.category ||
      !initialValues.seats ||
      !initialValues.price ||
      !initialValues.fuel ||
      initialValues.isAvailable == null ||
      initialValues.bluetooth == null ||
      initialValues.charger == null ||
      initialValues.water == null ||
      initialValues.wifi == null ||
      !initialValues.engineSize ||
      !initialValues.vehicleNo
    ) {
      toast.error('Fields cannot be empty');
      return false;
    } else if (!isValidPrice(initialValues.price) || !isValidPrice(initialValues.engineSize) || !isValidPrice(initialValues.seats)) {
      toast.error('Invalid Number format');
      return false;
    } else if (!initialValues.imagesList.length > 0) {
      toast.error('Error: No Image');
      return false;
    } else {
      return true; // Return true if all validations pass
    }
  };

  const handleUpdateData = async () => {
    setLoading(true);

    // Update images if they exist
    if (updateImage.length > 0) {
      initialValues.imagesList = updateImage;
    }

    const isValid = validateNewData();
    if (!isValid) {
      return;
    }

    try {
      if (isNew) {
        // Handle new car addition
        initialValues.carId = generateRandomId();
        await addNewCar();
      } else {
        // Handle car update
        await updateCar();
      }
    } catch (error) {
      toast.error(isNew ? 'Something went wrong adding the car!' : 'Error updating car!');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding a new car
  const addNewCar = async () => {
    const res = await AddDoc('carRental', initialValues.carId, initialValues);
    if (res) {
      handleUpdateAgree();
    } else {
      toast.error('Data insertion failed');
    }
  };

  // Function to handle updating an existing car
  const updateCar = async () => {
    const { id, ...rest } = car;
    const updatedCar = { carId: id, ...rest };
    const validatedCar = validateFields(updatedCar);

    const res = await Updatedocdata('carRental', validatedCar.carId, validatedCar);
    if (res) {
      handleUpdateAgree();
    } else {
      toast.error('Error Updating Car');
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Update Car Information
            </Typography>
            <StandardImageList car={car} updateImage={updateImage} setupdateImage={setupdateImage} collection={'carPics'} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="Brand" name="brand" value={initialValues.brand} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Model" name="model" value={initialValues.model} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="Year" name="year" value={initialValues.year} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Category" name="category" value={initialValues.category} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="Seats" name="seats" value={initialValues.seats} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Price" name="price" value={initialValues.price} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            <TextField
              fullWidth
              label="Engine Size"
              name="engineSize"
              value={initialValues.engineSize}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Vehicle No."
              name="vehicleNo"
              value={initialValues.vehicleNo}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField fullWidth label="Fuel" name="fuel" value={initialValues.fuel} onChange={handleChange} sx={{ mb: 2 }} />

            <FormControlLabel
              control={<Checkbox name="isAvailable" checked={initialValues.isAvailable} onChange={handleChange} />}
              label="Is Available"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox name="bluetooth" checked={initialValues.bluetooth} onChange={handleChange} />}
              label="Bluetooth"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox name="charger" checked={initialValues.charger} onChange={handleChange} />}
              label="Charger"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox name="water" checked={initialValues.water} onChange={handleChange} />}
              label="Water"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox name="wifi" checked={initialValues.wifi} onChange={handleChange} />}
              label="Wifi"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" color="indigo" onClick={handleUpdateData}>
                {isNew ? 'Add Car' : 'Update Car'}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CarUpdateModal;
