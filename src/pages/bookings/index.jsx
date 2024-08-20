import React, { useState, useContext } from 'react';
import { Box, IconButton, Tabs, Tab } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { sendNotification, Updatedocdata, addNotification } from 'utils/firebaseutils';
import Loader from 'components/Loader';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';
import Modal from '../../components/modal';
import { toast } from 'react-toastify';

import { AuthContext } from 'contexts/authContext';

import DriverBookingModal from 'components/driverBookingModal';

import moment from 'moment';

const Bookings = () => {
  const theme = useTheme();

  // const [allData, setAllData] = useState([]);
  // const [drivers, setDrivers] = useState([]);
  // const [users, setUsers] = useState([]);
  // const [cars, setCars] = useState([]);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState({ val: false, data: null });
  const [selectedBookingType, setSelectedBookingType] = useState('carRental');
  const [selectedStatus, setSelectedStatus] = useState('Accepted');
  const [loading, setLoading] = useState(false);

  const { bookings, carRental, users, drivers, userData, airports } = useContext(AuthContext);

  const groupByBookingType = (bookings) => {
    return bookings.reduce((acc, booking) => {
      if (!acc[booking.bookingType]) {
        acc[booking.bookingType] = [];
      }
      acc[booking.bookingType].push(booking);
      return acc;
    }, {});
  };

  const getPendingLength = () => {
    let count = 0;
    if (allData && allData[selectedBookingType]) {
      allData[selectedBookingType].forEach((data) => {
        if (data.bookingStatus === 'Pending') {
          count++;
        }
      });
      return count;
    } else {
      return 0;
    }
  };
  const allData = groupByBookingType(bookings);
  const cars = carRental;

  const handleDeletion = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setShowModal(true);
  };

  const handleAgree = async () => {
    setLoading(true); // Start loading
    try {
      if (selectedRowIndex !== null) {
        const data = filteredData.find((obj) => obj.id == selectedRowIndex);
        if (!data) {
          toast.error('No data found for the selected row.');
          return;
        }

        const clone = JSON.parse(JSON.stringify(data));
        const customer = await getuser(clone.customerId);
        let driver;

        let notificationsSent = true;
        let notificationsSaved = true;

        if (clone.bookingStatus === 'Pending' || clone.bookingStatus === 'Accepted') {
          const customerNotificationSent = await sendNotification(
            clone,
            'users',
            customer.fcmToken,
            'User:Ride Cancelled',
            'Your ride has been cancelled by Traveluxe'
          );
          notificationsSent = notificationsSent && customerNotificationSent;

          if (clone.bookingStatus === 'Accepted') {
            driver = await getdriver(clone.driverId);
            const driverNotificationSent = await sendNotification(
              clone,
              'drivers',
              driver.fcmToken,
              'Driver:Ride Cancelled',
              'Your assigned ride has been cancelled by Traveluxe'
            );
            notificationsSent = notificationsSent && driverNotificationSent;
          }
        }

        if (notificationsSent) {
          notificationsSaved = await addNotification(
            clone,
            'users',
            customer.fcmToken,
            'User:Ride Cancelled',
            'Your ride has been cancelled by Traveluxe'
          );

          if (clone.bookingStatus === 'Accepted') {
            notificationsSaved =
              notificationsSaved &&
              (await addNotification(
                clone,
                'drivers',
                driver.fcmToken,
                'Driver:Ride Cancelled',
                'Your assigned ride has been cancelled by Traveluxe'
              ));
          }
        } else {
          throw new Error('Failed to send notifications.');
        }

        if (notificationsSaved) {
          const updateStatusResult = await Updatedocdata('bookings', selectedRowIndex, { bookingStatus: 'Cancelled' });
          if (!updateStatusResult) {
            throw new Error('Failed to update booking status.');
          }

          setShowModal(false);
          setSelectedRowIndex(null);
          toast.success('Cancelled Successfully');
        } else {
          throw new Error('Failed to save notifications.');
        }
      }
    } catch (error) {
      toast.error('Failed to cancel ride: ' + error.message);
    } finally {
      setLoading(false); // End loading
    }
  };
  const handleDisagree = () => {
    setShowModal(false);
    setShowUpdateModal({ val: false, data: null });
    setSelectedRowIndex(null);
  };

  const handleUpdateAgree = async () => {
    setLoading(true); // Start loading
    try {
      setShowUpdateModal({ val: false, data: null });
    } catch (error) {
      toast.error('Error while accepting booking.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const openEditModalFunction = (bookingID) => {
    const selBooking = allData[selectedBookingType].filter((obj) => obj.id === bookingID);

    if (selBooking[0]?.id) {
      setShowUpdateModal({ val: true, data: selBooking[0] });
    }
  };

  const openNewModalFunction = () => {
    setShowUpdateModal({ val: true, data: userData, isNew: true });
  };

  const handleBookingTypeChange = (event, newValue) => {
    setSelectedBookingType(newValue);
  };

  const handleStatusChange = (event, newValue) => {
    setSelectedStatus(newValue);
  };

  const filteredData = allData[selectedBookingType]?.filter((booking) => booking.bookingStatus === selectedStatus) || [];
  const getuser = (id) => {
    return users.find((user) => user.userId === id);
  };
  const getdriver = (id) => {
    return drivers.find((driver) => driver.userId === id);
  };
  const getCar = (id) => {
    return cars.find((car) => car.carId === id);
  };
  const getAirport = (id) => {
    return airports.find((airport) => airport.id === id);
  };
  const formatDateTime = (timeString) => {
    return { date: moment(timeString).format('YYYY-MM-DD'), time: moment(timeString).format('hh:mm a') };
  };

  const getColumns = (bookingType) => {
    switch (bookingType) {
      case 'carRental':
        return [
          {
            field: 'Customer',
            headerName: 'Customer',
            width: 130,
            cellClassName: 'name-column-cell',
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.name : 'unKnown'}</div>;
            }
          },
          {
            field: 'CustomerEmail',
            headerName: 'CustomerEmail',
            width: 165,
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.email : 'unKnown'}</div>;
            }
          },
          {
            field: 'CustomerPh',
            headerName: 'CustomerPh',
            width: 145,
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.phoneNo : 'N/A'}</div>;
            }
          },
          {
            field: 'Vehicle',
            headerName: 'Vehicle',
            width: 120,
            renderCell: (params) => {
              const vehicle = getCar(params.row.vehicleId);
              return <div>{vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A'}</div>;
            }
          },
          { field: 'totalPrice', headerName: 'Fare(£)', width: 115 },
          {
            field: 'pickuplocation',
            headerName: 'Pickup Location',
            width: 170,
            renderCell: (params) => <div>{params.row.pickupLocation.address}</div>
          },
          {
            field: 'PickUpTime',
            headerName: 'Pickup Time',
            width: 140,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.pickUpDateTime);
              return <div>{formatted ? formatted.time : 'N/A'}</div>;
            }
          },
          {
            field: 'PickUpDate',
            headerName: 'Pickup Date',
            width: 140,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.pickUpDateTime);
              return <div>{formatted ? formatted.date : 'N/A'}</div>;
            }
          },
          {
            field: 'Driver',
            headerName: 'Driver',
            width: 110,
            cellClassName: 'name-column-cell',
            renderCell: (params) => {
              const driver = getdriver(params.row.driverId);
              return <div>{driver ? driver.name : 'N/A'}</div>;
            }
          },
          {
            field: 'DriverEmail',
            headerName: 'DriverEmail',
            width: 160,
            renderCell: (params) => {
              const driver = getdriver(params.row.driverId);
              return <div>{driver ? driver.email : 'N/A'}</div>;
            }
          },
          {
            field: 'DriverPh',
            headerName: 'DriverPh',
            width: 120,
            renderCell: (params) => {
              const driver = getdriver(params.row.driverId);
              return <div>{driver ? driver.phoneNo : 'N/A'}</div>;
            }
          },
          {
            field: 'ArrivalTime',
            headerName: 'Arrival Time',
            width: 140,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.driverArrivedTime);
              return <div>{formatted ? formatted.time : 'N/A'}</div>;
            }
          },
          {
            field: 'DropOffTime',
            headerName: 'DropOff Time',
            width: 140,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.dropOffDateTime);
              return <div>{formatted ? formatted.time : 'N/A'}</div>;
            }
          },
          {
            field: 'DropOffDate',
            headerName: 'DropOff Date',
            width: 150,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.dropOffDateTime);
              return <div>{formatted ? formatted.date : 'N/A'}</div>;
            }
          },

          {
            field: 'isMultipleDayRide',
            headerName: 'MultipleDayRide',
            width: 130,
            renderCell: (params) =>
              params.row.isMultipleDayRide ? <VerifiedIcon sx={{ color: 'success.main' }} /> : <CancelIcon sx={{ color: 'error.main' }} />
          },
          {
            field: 'edit',
            headerName: 'Actions',
            renderCell: (params) => (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {selectedStatus === 'Pending' && (
                  <IconButton onClick={() => openEditModalFunction(params.row.id)}>
                    <EditIcon />
                  </IconButton>
                )}
                {selectedStatus !== 'Cancelled' && selectedStatus !== 'Completed' && (
                  <IconButton onClick={() => handleDeletion(params.row.id)}>
                    <DeleteOutlineOutlinedIcon sx={{ color: 'error.main' }} />
                  </IconButton>
                )}
              </Box>
            )
          }
        ];
      case 'tours':
        return [
          {
            field: 'Customer',
            headerName: 'Customer',
            width: 130,
            cellClassName: 'name-column-cell',
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.name : 'unKnown'}</div>;
            }
          },
          {
            field: 'CustomerEmail',
            headerName: 'CustomerEmail',
            width: 165,
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.email : 'unKnown'}</div>;
            }
          },
          {
            field: 'CustomerPh',
            headerName: 'CustomerPh',
            width: 145,
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.phoneNo : 'N/A'}</div>;
            }
          },
          {
            field: 'carCategory',
            headerName: 'Car',
            width: 120
          },
          {
            field: 'totalPrice',
            headerName: 'Price(£)',
            width: 120
          },
          {
            field: 'pickUpDate',
            headerName: 'PickUp Date',
            width: 150,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.pickUpDate);
              return <div>{formatted ? formatted.date : 'N/A'}</div>;
            }
          },
          {
            field: 'pickUpTime',
            headerName: 'PickUp Time',
            width: 150,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.pickUpTime);
              return <div>{formatted ? formatted.time : 'N/A'}</div>;
            }
          },
          {
            field: 'pickupLocation',
            headerName: 'Pickup Location',
            width: 170,
            renderCell: (params) => <div>{params.row.pickupLocation.address}</div>
          },
          {
            field: 'edit',
            headerName: 'Actions',
            renderCell: (params) => (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {selectedStatus === 'Pending' && (
                  <IconButton onClick={() => openEditModalFunction(params.row.id)}>
                    <EditIcon />
                  </IconButton>
                )}
                {selectedStatus !== 'Cancelled' && selectedStatus !== 'Completed' && (
                  <IconButton onClick={() => handleDeletion(params.row.id)}>
                    <DeleteOutlineOutlinedIcon sx={{ color: 'error.main' }} />
                  </IconButton>
                )}
              </Box>
            )
          }
        ];
      case 'airlines':
        return [
          {
            field: 'Customer',
            headerName: 'Customer',
            width: 130,
            cellClassName: 'name-column-cell',
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.name : 'unKnown'}</div>;
            }
          },
          {
            field: 'CustomerEmail',
            headerName: 'CustomerEmail',
            width: 165,
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.email : 'unKnown'}</div>;
            }
          },
          {
            field: 'CustomerPh',
            headerName: 'CustomerPh',
            width: 145,
            renderCell: (params) => {
              const user = getuser(params.row.customerId);
              return <div>{user ? user.phoneNo : 'N/A'}</div>;
            }
          },
          {
            field: 'Vehicle',
            headerName: 'Vehicle',
            width: 120,
            renderCell: (params) => {
              const vehicle = getCar(params.row.vehicleId);
              return <div>{vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A'}</div>;
            }
          },
          { field: 'totalPrice', headerName: 'Fare(£)', width: 115 },
          {
            field: 'Airport',
            headerName: 'Airport',
            width: 150,
            cellClassName: 'name-column-cell',
            renderCell: (params) => {
              const airport = getAirport(params.row.airportId);
              return <div>{airport ? airport.name : 'unKnown'}</div>;
            }
          },
          {
            field: 'Airport Address',
            headerName: 'Airport Address',
            width: 170,
            renderCell: (params) => {
              const airport = getAirport(params.row.airportId);
              return <div>{airport ? airport.address : 'unKnown'}</div>;
            }
          },
          {
            field: 'flightNumber',
            headerName: 'Flight No.',
            width: 130
          },
          {
            field: 'totalPassengers',
            headerName: 'Passengers',
            width: 140
          },
          {
            field: 'totalMiles',
            headerName: 'Miles',
            width: 110
          },
          {
            field: 'totalBags',
            headerName: 'Bags',
            width: 100
          },
          {
            field: 'isGoingToAirport',
            headerName: 'To Airport',
            width: 130,
            renderCell: (params) =>
              params.row.isGoingToAirport ? <VerifiedIcon sx={{ color: 'success.main' }} /> : <CancelIcon sx={{ color: 'error.main' }} />
          },
          {
            field: 'Booking Date',
            headerName: 'Booking Date',
            width: 150,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.bookingDate);
              return <div>{formatted ? formatted.date : 'N/A'}</div>;
            }
          },
          {
            field: 'Booking Time',
            headerName: 'Booking Time',
            width: 150,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.bookingDate);
              return <div>{formatted ? formatted.time : 'N/A'}</div>;
            }
          },
          {
            field: 'Driver',
            headerName: 'Driver',
            width: 110,
            cellClassName: 'name-column-cell',
            renderCell: (params) => {
              const driver = getdriver(params.row.driverId);
              return <div>{driver ? driver.name : 'N/A'}</div>;
            }
          },
          {
            field: 'DriverEmail',
            headerName: 'DriverEmail',
            width: 160,
            renderCell: (params) => {
              const driver = getdriver(params.row.driverId);
              return <div>{driver ? driver.email : 'N/A'}</div>;
            }
          },
          {
            field: 'DriverPh',
            headerName: 'DriverPh',
            width: 120,
            renderCell: (params) => {
              const driver = getdriver(params.row.driverId);
              return <div>{driver ? driver.phoneNo : 'N/A'}</div>;
            }
          },
          {
            field: 'ArrivalTime',
            headerName: 'Arrival Time',
            width: 140,
            renderCell: (params) => {
              const formatted = formatDateTime(params.row.driverArrivedTime);
              return <div>{formatted ? formatted.time : 'N/A'}</div>;
            }
          },
          {
            field: 'pickuplocation',
            headerName: 'Pickup Location',
            width: 170,
            renderCell: (params) => <div>{params.row.userLocation.address}</div>
          },

          {
            field: 'isRideVerified',
            headerName: 'Ride Verified',
            width: 130,
            renderCell: (params) =>
              params.row.isRideVerified ? <VerifiedIcon sx={{ color: 'success.main' }} /> : <CancelIcon sx={{ color: 'error.main' }} />
          },
          {
            field: 'edit',
            headerName: 'Actions',
            renderCell: (params) => (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {selectedStatus === 'Pending' && (
                  <IconButton onClick={() => openEditModalFunction(params.row.id)}>
                    <EditIcon />
                  </IconButton>
                )}
                {selectedStatus !== 'Cancelled' && selectedStatus !== 'Completed' && (
                  <IconButton onClick={() => handleDeletion(params.row.id)}>
                    <DeleteOutlineOutlinedIcon sx={{ color: 'error.main' }} />
                  </IconButton>
                )}
              </Box>
            )
          }
        ];

      default:
        return [];
    }
  };

  const columns = getColumns(selectedBookingType);

  return (
    <>
      {loading && <Loader />}
      <Box
        sx={{
          height: '75vh',
          width: '100%',
          backgroundColor: theme.palette.grey[0],
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme.palette.grey.A800,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <Tabs value={selectedBookingType} onChange={handleBookingTypeChange} aria-label="booking types tabs" centered>
            {Object.keys(allData).map((bookingType) => (
              <Tab
                key={bookingType}
                label={bookingType}
                value={bookingType}
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  color: '',
                  '&.Mui-selected': { color: 'indigo' }
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <Tabs value={selectedStatus} onChange={handleStatusChange} aria-label="booking statuses tabs" variant="fullWidth">
            {['Accepted', 'Arrived', 'In-Progress', 'On the Way', 'Pending', 'Completed', 'Cancelled'].map((status) => (
              <Tab
                key={status}
                label={status === 'Pending' ? `${status} (${getPendingLength()})` : status.replace('-', ' ')}
                value={status}
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  '&.Mui-selected': { color: theme.palette.primary.main }
                }}
              />
            ))}
          </Tabs>
        </Box>

        <DataGrid
          columns={columns}
          rows={filteredData}
          getRowSpacing={(params) => ({ top: params.isFirstVisible ? 0 : 5, bottom: params.isLastVisible ? 0 : 5 })}
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          sx={{
            flexGrow: 1,
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-cell.MuiDataGrid-cell--textLeft': { border: 'none' },
            '& .name-column-cell': { color: 'primary.main' },
            '& .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
              background: '#69c0ff !important',
              fontWeight: 'bold',
              borderBottom: 'none',
              marginBottom: 1
            },
            '& .MuiDataGrid-virtualScroller.css-1793420-MuiDataGrid-virtualScroller': {},
            '& .MuiDataGrid-footerContainer.MuiDataGrid-withBorderColor.css-wop1k0-MuiDataGrid-footerContainer': {
              borderTop: 'none',
              backgroundColor: '#69c0ff',
              marginTop: 1
            },
            '& .MuiDataGrid-row': { backgroundColor: 'secondary.lighter' },
            '& .MuiDataGrid-row:hover': { backgroundColor: 'secondary.light' },
            '& .MuiDataGrid-columnHeaderTitle.css-t89xny-MuiDataGrid-columnHeaderTitle': { fontWeight: 'bolder' },
            '& .MuiDataGrid-toolbarContainer .MuiButton-text': { color: `purple !important` }
          }}
        />

        <Modal
          message="Are you sure you want to Cancel the booking?"
          open={showModal}
          handleClose={() => setShowModal(false)}
          handleAgree={handleAgree}
          handleDisagree={handleDisagree}
        />

        {showUpdateModal.val && (
          <DriverBookingModal
            message={'Select Driver...'}
            open={showUpdateModal.val}
            handleClose={() => {
              setShowUpdateModal({ val: false, data: null });
            }}
            booking={showUpdateModal.data}
            drivers={drivers}
            users={users}
            handleDisagree={handleDisagree}
            handleAgree={handleUpdateAgree}
          />
        )}
      </Box>
    </>
  );
};

export default Bookings;
