import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getAllUsersData, DeleteDoc } from 'utils/firebaseutils';
import Avatar from 'components/@extended/Avatar';
import { useTheme } from '@mui/material/styles';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import EditIcon from '@mui/icons-material/Edit';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import Modal from '../../components/modal';
import { toast } from 'react-toastify';
import CarUpdateModal from 'components/carUpdateModal';
import AnimateButton from 'components/@extended/AnimateButton';
import { AuthContext } from 'contexts/authContext';
import Loader from 'components/Loader';

const Cars = () => {
  const theme = useTheme();

  //getting drivers DATA

  const { carRental, userData } = useContext(AuthContext);
  const allCars = carRental;

  //Deletion and updation of Data
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState({ val: false, data: null, isNew: false });
  const [loading, setLoading] = useState(false);

  const handleDeletion = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setShowModal(true);
  };

  const handleAgree = async () => {
    if (selectedRowIndex !== null) {
      setLoading(true);
      try {
        const res = await DeleteDoc('carRental', selectedRowIndex);
        if (res) {
          // Reset selectedRowIndex and close modal
          setShowModal(false);
          setSelectedRowIndex(null);
          toast.success('Data deleted Successfully');
        } else {
          toast.error('Error Deleting Car');
        }
      } catch (error) {
        toast.error('Data cannot be deleted');
        // Handle error appropriately, e.g., show error message
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDisagree = () => {
    setShowModal(false);
    setShowUpdateModal({ val: false, data: null, isNew: false });
    setSelectedRowIndex(null);
  };

  const handleUpdateAgree = async () => {
    try {
      // Reset selectedRowIndex and close modal
      setShowUpdateModal({ val: false, data: null, isNew: false });
      toast.success('Data Updated Successfully');
    } catch (error) {
      toast.error('Data cannot be Updated');
    }
  };

  const openEditModalFunction = (driverId) => {
    const selCar = allCars.filter((obj) => obj.id == driverId);
    if (selCar[0]?.id) {
      setShowUpdateModal({ val: true, data: selCar[0], isNew: false });
    }
  };

  const openNewModalFunction = () => {
    setShowUpdateModal({ val: true, data: userData, isNew: true });
  };

  //initiating data for Data Frid
  const columns =
    // useMemo(
    [
      {
        field: 'imagesList',
        headerName: 'Avatar',
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => <Avatar src={params.row.imagesList[0]} />
      },
      { field: 'brand', headerName: 'Brand', width: 110, cellClassName: 'name-column-cell' },
      { field: 'model', headerName: 'Modal', width: 110 },
      { field: 'year', headerName: 'Year', width: 100 },
      { field: 'category', headerName: 'Category', width: 125 },
      { field: 'seats', headerName: 'Seats', width: 105 },
      { field: 'price', headerName: 'Price', width: 100 },
      {
        field: 'wifi',
        headerName: 'WIFI',
        width: 120,
        renderCell: (params) =>
          params.row.wifi ? <WifiIcon sx={{ color: 'primary.darker' }} /> : <WifiOffIcon sx={{ color: 'error.main' }} />
      },
      {
        field: 'bluetooth',
        headerName: 'Bluetooth',
        width: 120,
        renderCell: (params) =>
          params.row.bluetooth ? <BluetoothIcon sx={{ color: 'primary.darker' }} /> : <BluetoothDisabledIcon sx={{ color: 'error.main' }} />
      },
      {
        field: 'charger',
        headerName: 'Charger',
        width: 115,
        renderCell: (params) =>
          params.row.bluetooth ? <BatteryChargingFullIcon sx={{ color: 'primary.darker' }} /> : <CancelIcon sx={{ color: 'error.main' }} />
      },
      { field: 'engineSize', headerName: 'EngineSize', width: 100 },
      {
        field: 'water',
        headerName: 'Water',
        width: 115,
        renderCell: (params) =>
          params.row.water ? <VerifiedIcon sx={{ color: 'success.main' }} /> : <CancelIcon sx={{ color: 'error.main' }} />
      },
      { field: 'vehicleNo', headerName: 'Veh#', width: 100 },
      { field: 'fuel', headerName: 'Fuel', width: 100 },
      {
        field: 'isAvailable',
        headerName: 'Availibility',
        width: 130,
        renderCell: (params) =>
          params.row.isAvailable ? <EventAvailableIcon sx={{ color: 'success.main' }} /> : <NewReleasesIcon sx={{ color: 'error.main' }} />
      },
      { field: 'carOwnerName', headerName: 'Owner', width: 100, renderCell: (params) => <div>{params.row.carOwner.name}</div> },
      { field: 'carOwnerEmail', headerName: 'OwnerEmail', width: 150, renderCell: (params) => <div>{params.row.carOwner.email}</div> },
      { field: 'carOwnerPhone', headerName: 'OwnerPH', width: 140, renderCell: (params) => <div>{params.row.carOwner.phoneNo}</div> },

      {
        field: 'edit',
        headerName: 'Actions',
        renderCell: (params) => {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton
                onClick={() => {
                  openEditModalFunction(params.row.id);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  handleDeletion(params.row.id);
                }}
              >
                <DeleteOutlineOutlinedIcon sx={{ color: 'error.main' }} />
              </IconButton>
            </Box>
          );
        }
      }
    ];

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
          borderColor: theme.palette.grey.A800
        }}
      >
        <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
          <AnimateButton>
            <Button
              disableElevation
              sx={{ mt: 2, mr: 2 }}
              size="large"
              type="submit"
              variant="contained"
              color="indigo"
              startIcon={<EditIcon />}
              onClick={openNewModalFunction}
            >
              New Car
            </Button>
          </AnimateButton>
        </Box>
        <DataGrid
          columns={columns}
          rows={allCars}
          getRowSpacing={(params) => ({ top: params.isFirstVisible ? 0 : 5, bottom: params.isLastVisible ? 0 : 5 })}
          getRowId={(row) => row.id}
          slots={{
            toolbar: GridToolbar
          }}
          sx={{
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-cell.MuiDataGrid-cell--textLeft': {
              border: 'none'
            },
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
            '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
              color: `purple !important`
            }
          }}
        />
        <Modal
          message="Are you sure you want to Delete?"
          open={showModal}
          handleClose={() => setShowModal(false)}
          handleAgree={handleAgree}
          handleDisagree={handleDisagree}
        />

        {showUpdateModal.val && (
          <CarUpdateModal
            message="Are you sure you want to Update?"
            open={showUpdateModal.val}
            handleClose={() => {
              setShowUpdateModal({ val: false, data: null, isNew: false });
            }}
            car={showUpdateModal.data}
            isNew={showUpdateModal.isNew}
            handleUpdateAgree={handleUpdateAgree}
          />
        )}
      </Box>
    </>
  );
};

export default Cars;
