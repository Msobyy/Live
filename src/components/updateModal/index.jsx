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
import { Updatedocdata } from 'utils/firebaseutils';
import { toast } from 'react-toastify';
import Loader from 'components/Loader';

const emptyObj = {
  name: '',
  email: '',
  driverType: '',
  isAvailable: false,
  isProfileCompleted: false,
  isProfileVerified: false
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UpdateModal({ message, open, handleClose, driver, handleUpdateAgree }) {
  const [initialValues, setInitialValues] = useState(emptyObj);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driver) {
      setPreviousData();
    }
  }, []);

  const setPreviousData = () => {
    setInitialValues({
      name: driver?.name,
      email: driver?.email,
      driverType: driver?.driverType,
      isAvailable: driver?.isAvailable,
      isProfileCompleted: driver?.isProfileCompleted,
      isProfileVerified: driver?.isProfileVerified
    });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setInitialValues((prevValues) => ({
      ...prevValues,
      [name]: newValue
    }));
  };

  const handleUpdateData = async () => {
    setLoading(true);
    const { id, ...rest } = driver;
    const updatedDriver = { userId: id, ...rest };

    if (initialValues.name) {
      updatedDriver.name = initialValues.name;
    }
    if (initialValues.email) {
      updatedDriver.email = initialValues.email;
    }
    if (initialValues.driverType) {
      updatedDriver.driverType = initialValues.driverType;
    }
    if (initialValues.isAvailable !== null) {
      updatedDriver.isAvailable = initialValues.isAvailable;
    }
    if (initialValues.isProfileCompleted !== null) {
      updatedDriver.isProfileCompleted = initialValues.isProfileCompleted;
    }
    if (initialValues.isProfileVerified !== null) {
      updatedDriver.isProfileVerified = initialValues.isProfileVerified;
    }

    try {
      const res = await Updatedocdata('drivers', updatedDriver.userId, updatedDriver);
      if (res) {
        handleUpdateAgree();
      } else {
        toast.error('Error Updating Driver');
      }
    } catch (error) {
      toast.error('Something Went Wrong ');
    } finally {
      setLoading(false);
      handleClose();
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
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
              Update User Profile
            </Typography>

            <TextField fullWidth label="Name" name="name" value={initialValues.name} onChange={handleChange} sx={{ mb: 3 }} />
            <TextField fullWidth label="Email" name="email" value={initialValues.email} onChange={handleChange} sx={{ mb: 3 }} />
            <TextField fullWidth label="Role" name="driverType" value={initialValues.driverType} onChange={handleChange} sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 3 }}>
              <FormControlLabel
                control={<Checkbox name="isAvailable" checked={initialValues.isAvailable} onChange={handleChange} />}
                label="Availability"
              />
              <FormControlLabel
                control={<Checkbox name="isProfileCompleted" checked={initialValues.isProfileCompleted} onChange={handleChange} />}
                label="Profile Status"
              />
              <FormControlLabel
                control={<Checkbox name="isProfileVerified" checked={initialValues.isProfileVerified} onChange={handleChange} />}
                label="Profile Verified"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ minWidth: 100 }}>
                Cancel
              </Button>
              <Button variant="contained" color="indigo" onClick={handleUpdateData} sx={{ minWidth: 100 }}>
                Update
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateModal;
