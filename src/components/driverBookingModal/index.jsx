import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import Slide from '@mui/material/Slide';
import { toast } from 'react-toastify';
import { sendNotification, Updatedocdata, addNotification } from 'utils/firebaseutils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DriverBookingModal({ message, open, handleClose, handleAgree, handleDisagree, booking, drivers, users }) {
  const [selectedDriver, setSelectedDriver] = React.useState(null);

  const getuser = (id) => users.find((user) => user.userId === id);
  const getdriver = (id) => drivers.find((driver) => driver.userId === id);

  const handleChange = (driverId) => setSelectedDriver(driverId);

  const addDriver = async () => {
    try {
      if (selectedDriver) {
        const customer = getuser(booking.customerId);
        const driver = getdriver(selectedDriver);

        let notificationsSent = true;
        let notificationsSaved = true;

        // Send notifications
        const customerNotificationSent = await sendNotification(
          booking,
          'users',
          customer.fcmToken,
          'Ride Accepted',
          'Your ride has been accepted by the driver.'
        );
        notificationsSent = notificationsSent && customerNotificationSent;

        const driverNotificationSent = await sendNotification(
          booking,
          'drivers',
          driver.fcmToken,
          'Ride Accepted',
          'You have been assigned a new ride.'
        );
        notificationsSent = notificationsSent && driverNotificationSent;

        // Save notifications if sending was successful
        if (notificationsSent) {
          const customerNotificationSaved = await addNotification(
            booking,
            'users',
            customer.fcmToken,
            'Ride Accepted',
            'Your ride has been accepted by the driver.'
          );
          notificationsSaved = notificationsSaved && customerNotificationSaved;

          const driverNotificationSaved = await addNotification(
            booking,
            'drivers',
            driver.fcmToken,
            'Ride Accepted',
            'You have been assigned a new ride.'
          );
          notificationsSaved = notificationsSaved && driverNotificationSaved;
        } else {
          throw new Error('Failed to send notifications.');
        }

        if (notificationsSaved) {
          const updateResult = await Updatedocdata('bookings', booking.id, { bookingStatus: 'Accepted', driverId: selectedDriver });

          if (updateResult) {
            toast.success('Booking accepted and notifications sent and saved successfully.');
            handleAgree();
          } else {
            throw new Error('Failed to update booking status.');
          }
        } else {
          throw new Error('Failed to save notifications.');
        }
      }
    } catch (error) {
      toast.error('Error while accepting booking: ' + error.message);
    }
  };

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} maxWidth="sm">
      <DialogContent sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 5 }}>
        <DialogContentText id="alert-dialog-slide-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Driver
          </Typography>
          <List dense={true}>
            {drivers.map((driver, index) => (
              <React.Fragment key={driver.id}>
                <ListItem
                  onClick={() => handleChange(driver.id)}
                  sx={{
                    py: 2,
                    borderBottom: selectedDriver === driver.id ? '2px solid indigo' : 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      transition: 'background-color 0.2s ease-in-out'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={driver.profilePic} alt={driver.name} />
                  </ListItemAvatar>
                  <ListItemText primary={driver.name} />
                  {selectedDriver === driver.id && <VerifiedIcon color="indigo" />}
                </ListItem>
                {index < drivers.length - 1 && <Divider sx={{ borderColor: 'secondary.400' }} />}
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleDisagree}>
              Cancel
            </Button>
            <Button variant="contained" color="indigo" onClick={addDriver} sx={{ ml: 1 }}>
              Confirm Booking
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default DriverBookingModal;
