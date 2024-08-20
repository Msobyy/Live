import React, { useEffect, useState, useRef, useId } from 'react';
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
import { Updatedocdata, generateRandomId, AddDoc } from 'utils/firebaseutils';
import StandardImageList from 'components/imagelist';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { toast } from 'react-toastify';
import Loader from 'components/Loader';

const emptyObj = {
  name: '',
  category: '',
  description: '',
  fPrice: '',
  imagesList: [],
  vPrice: '',
  location: {
    address: '',
    lat: 0,
    lng: 0
  },
  services: '',
  isAvailable: false // Ensure isAvailable is always a boolean
};
const emptyNewObj = {
  name: '',
  category: '',
  description: '',
  fPrice: '',
  vPrice: '',
  tourId: '',
  location: {
    address: '',
    lat: 51.5072,
    lng: 0.1276
  },
  tourOwner: {
    emai: '',
    id: '',
    name: '',
    phoneNo: ''
  },
  imagesList: [],
  services: '',
  isAvailable: false // Ensure isAvailable is always a boolean
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TourUpdateModal({ message, open, handleClose, tour, handleUpdateAgree, isNew }) {
  const [initialValues, setInitialValues] = useState(() => (isNew ? emptyNewObj : emptyObj));
  const [updateImage, setupdateImage] = useState([]);
  const [showMap, setShowMap] = useState(false); // State to manage map visibility
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tour) {
      setPreviousData();
    }
  }, [tour]);

  const setPreviousData = () => {
    if (!isNew) {
      setInitialValues({
        name: tour?.name || '',
        category: tour?.category || '',
        description: tour?.description || '',
        fPrice: tour?.fPrice || '',
        vPrice: tour?.vPrice || '',
        location: tour?.location || emptyObj.location,
        services: tour?.services || '',
        isAvailable: tour?.isAvailable ?? false,
        imagesList: tour?.imagesList // Ensure isAvailable is always a boolean
      });
      setupdateImage(tour?.imagesList || []);
    } else {
      setInitialValues((prevValues) => ({
        ...prevValues,
        tourOwner: {
          email: tour?.email,
          id: tour?.userId,
          name: tour?.name,
          phoneNo: tour?.phoneNo
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

  const handleLocationChange = (key, value) => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      location: {
        ...prevValues.location,
        [key]: value
      }
    }));
  };

  const handleMapClick = async ({ latLng }) => {
    setLoading(true);
    try {
      const lat = latLng.lat();
      const lng = latLng.lng();
      const address = await reverseGeocode(lat, lng);
      setInitialValues((prevValues) => ({
        ...prevValues,
        location: {
          address: address,
          lat: lat,
          lng: lng
        }
      }));
    } catch (e) {
      toast.error('Error Fetching Address');
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_APP_GOOGLE_API}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        return formattedAddress;
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      return 'Unknown Address';
    } finally {
      setLoading(false);
    }
  };

  const validateFields = (updatedTour) => {
    if (initialValues.name) {
      updatedTour.name = initialValues.name;
    }
    if (initialValues.category) {
      updatedTour.category = initialValues.category;
    }
    if (initialValues.description) {
      updatedTour.description = initialValues.description;
    }
    if (initialValues.fPrice) {
      updatedTour.fPrice = initialValues.fPrice;
    }
    if (initialValues.vPrice) {
      updatedTour.vPrice = initialValues.vPrice;
    }
    if (initialValues.location) {
      updatedTour.location = initialValues.location;
    }
    if (initialValues.services) {
      updatedTour.services = initialValues.services;
    }
    if (initialValues.isAvailable !== null) {
      updatedTour.isAvailable = initialValues.isAvailable;
    }
    initialValues.imagesList = updateImage;
    updatedTour.imagesList = updateImage;
    return updatedTour;
  };

  const validateNewData = () => {
    const isValidPrice = (price) => {
      // Check if price is a valid numeric string
      return typeof price === 'string' && /^[0-9]+(\.[0-9]+)?$/.test(price);
    };

    if (
      !initialValues.name ||
      !initialValues.description ||
      !initialValues.category ||
      !initialValues.services ||
      !initialValues.fPrice ||
      !initialValues.vPrice ||
      initialValues.isAvailable == null ||
      !initialValues.location.address ||
      !initialValues.location.lat ||
      !initialValues.location.lng
    ) {
      toast.error('Fields cannot be Empty');
      return false;
    } else if (!isValidPrice(initialValues.fPrice) || !isValidPrice(initialValues.vPrice)) {
      toast.error('Invalid price format');
      return false;
    } else if (!initialValues.imagesList.length > 0) {
      toast.error('Error: No Image');
      return false;
    } else {
      return true;
    }
  };
  const handleUpdateData = async () => {
    setLoading(true);
    if (updateImage.length > 0) {
      initialValues.imagesList = updateImage;
    }

    const isValid = validateNewData();
    if (!isValid) {
      return;
    }

    try {
      if (isNew) {
        await addNewTour();
      } else {
        await updateTour();
      }
    } catch (error) {
      toast.error('Something Went Wrong');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding a new tour
  const addNewTour = async () => {
    initialValues.tourId = generateRandomId();

    const res = await AddDoc('tours', initialValues.tourId, initialValues);
    if (res) {
      handleUpdateAgree();
    } else {
      toast.error('Data insertion failed');
    }
  };

  // Function to handle updating an existing tour
  const updateTour = async () => {
    const { id, ...rest } = tour;
    const updatedTour = { tourId: id, ...rest };
    const validatedTour = validateFields(updatedTour);

    const res = await Updatedocdata('tours', validatedTour.tourId, validatedTour);
    if (res) {
      handleUpdateAgree();
    } else {
      toast.error('Error Updating Tour');
    }
  };

  const handlePlaceChanged = (place) => {
    geocodeByAddress(place.value.description)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        setInitialValues((prevValues) => ({
          ...prevValues,
          location: {
            address: place.value.description,
            lat: lat,
            lng: lng
          }
        }))
      );
  };
  const libraries = ['places'];
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
              Update Tour Information
            </Typography>
            <StandardImageList updateImage={updateImage} setupdateImage={setupdateImage} collection={'tourPics'} />

            <TextField fullWidth label="Name" name="name" value={initialValues.name} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Category" name="category" value={initialValues.category} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={initialValues.description}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Family Price(£)"
                name="fPrice"
                value={initialValues.fPrice}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField fullWidth label="VIP Price(£)" name="vPrice" value={initialValues.vPrice} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>
            <TextField
              fullWidth
              label="Services"
              name="services"
              value={initialValues.services}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Location
            </Typography>
            <LoadScript googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_API} libraries={libraries}>
              <GooglePlacesAutocomplete
                selectProps={{
                  value,
                  onChange: (place, detail) => {
                    handlePlaceChanged(place, detail);
                  }
                }}
              />
              {showMap && (
                <GoogleMap
                  mapContainerStyle={{ height: '400px', width: '100%' }}
                  zoom={12}
                  center={{ lat: initialValues.location.lat, lng: initialValues.location.lng }}
                  onClick={handleMapClick}
                >
                  <Marker position={{ lat: initialValues.location.lat, lng: initialValues.location.lng }} />
                </GoogleMap>
              )}
            </LoadScript>

            <Button variant="contained" color="indigo" onClick={() => setShowMap(!showMap)} sx={{ mt: 2, mb: 2 }}>
              {!showMap ? 'Use Map' : 'Close Map'}
            </Button>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={initialValues.location.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              sx={{ mb: 2 }}
              disabled // Make address field disabled
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Latitude"
                name="lat"
                value={initialValues.location.lat}
                onChange={(e) => handleLocationChange('lat', e.target.value)}
                sx={{ mb: 2 }}
                disabled
              />
              <TextField
                fullWidth
                label="Longitude"
                name="lng"
                value={initialValues.location.lng}
                onChange={(e) => handleLocationChange('lng', e.target.value)}
                sx={{ mb: 2 }}
                disabled
              />
            </Box>
            <FormControlLabel
              control={<Checkbox name="isAvailable" color="indigo" checked={initialValues.isAvailable} onChange={handleChange} />}
              label="Is Available"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="secondary" onClick={handleClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" color="indigo" onClick={handleUpdateData}>
                {isNew ? 'Add Tour' : 'Update Tour'}
              </Button>
            </Box>
          </Box>
        </DialogActions>
        .lighter
      </Dialog>
    </>
  );
}

export default TourUpdateModal;
