import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { AuthContext } from 'contexts/authContext';
import MainCard from 'components/MainCard';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: 'indigo'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: 'indigo'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1
  }
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: 'indigo',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  }),
  ...(ownerState.completed && {
    backgroundColor: 'indigo'
  })
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  const icons = {
    1: <Check />,
    2: <Check />,
    3: <Check />,
    4: <Check />,
    5: <Check />,
    6: <Check />,
    7: <Check />
  };
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node
};

const steps = ['Pending', 'Accepted', 'On the Way', 'Arrived', 'In-Progress', 'Completed', 'Cancelled'];

export default function CustomizedSteppers() {
  const groupByBookingType = (bookings) => {
    return bookings.reduce((acc, booking) => {
      if (!acc[booking.bookingType]) {
        acc[booking.bookingType] = [];
      }
      acc[booking.bookingType].push(booking);
      return acc;
    }, {});
  };

  const { bookings, carRental, users, drivers } = React.useContext(AuthContext);
  const getuser = (id) => {
    return users.find((user) => user.userId === id);
  };
  const getdriver = (id) => {
    return drivers.find((driver) => driver.userId === id);
  };
  const getCar = (id) => {
    return carRental.find((car) => car.carId === id);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      {bookings
        .filter((booking) => booking.bookingStatus !== 'Cancelled')
        .map((booking) => {
          const activeStep = steps.indexOf(booking.bookingStatus);
          const user = getuser(booking.customerId);
          const driver = getdriver(booking.driverId);
          const car = getCar(booking.vehicleId);
          return (
            <MainCard key={booking.id} sx={{ p: 2 }}>
              <Box display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {booking.bookingType}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ID: {booking.id}
                  </Typography>
                </Box>
                {user && (
                  <Typography variant="body2">
                    <b>Customer:</b> {user.name}
                  </Typography>
                )}
                {driver && (
                  <Typography variant="body2">
                    <b>Driver:</b> {driver.name}
                  </Typography>
                )}
                {car && (
                  <Typography variant="body2">
                    <b>Car:</b> {car.model}
                  </Typography>
                )}
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Stepper
                  alternativeLabel
                  activeStep={activeStep}
                  connector={<ColorlibConnector />}
                  orientation="horizontal"
                  sx={{ flexWrap: 'nowrap' }}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </MainCard>
          );
        })}
    </Stack>
  );
}
