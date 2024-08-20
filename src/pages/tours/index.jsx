import React, { useEffect, useState, useContext } from 'react';
import { Box, IconButton, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getAllUsersData, DeleteDoc } from 'utils/firebaseutils';
import Avatar from 'components/@extended/Avatar';
import { useTheme } from '@mui/material/styles';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';

import Modal from '../../components/modal';
import { toast } from 'react-toastify';
import TourUpdateModal from 'components/tourUpdateModal';
import { AuthContext } from 'contexts/authContext';
import AnimateButton from 'components/@extended/AnimateButton';

const Tours = () => {
  const theme = useTheme();

  //getting tours DATA

  const { userData, tours } = useContext(AuthContext);
  const allData = tours;

  //Deletion and updation of Data
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState({ val: false, data: null, isNew: false });

  const handleDeletion = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setShowModal(true);
  };

  const handleAgree = async () => {
    if (selectedRowIndex !== null) {
      try {
        const res = await DeleteDoc('tours', selectedRowIndex);
        if (res) {
          // Reset selectedRowIndex and close modal
          setShowModal(false);
          setSelectedRowIndex(null);
          toast.success('Data deleted Successfully');
        } else {
          toast.error('Error Deleting Tour');
        }
      } catch (error) {
        toast.error('Data cannot be deleted');
        // Handle error appropriately, e.g., show error message
      }
    }
  };
  const handleDisagree = () => {
    setShowModal(false);
    setShowUpdateModal(false);
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

  const openEditModalFunction = (tourId) => {
    const selTour = allData.filter((obj) => obj.id == tourId);
    if (selTour[0]?.id) {
      setShowUpdateModal({ val: true, data: selTour[0], isNew: false });
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
      { field: 'name', headerName: 'Name', width: 160, cellClassName: 'name-column-cell' },
      { field: 'category', headerName: 'Category', width: 125 },
      { field: 'location', headerName: 'Location', width: 160, renderCell: (params) => <div>{params.row.location.address}</div> },
      { field: 'fPrice', headerName: 'Family(£)', width: 130 },
      { field: 'vPrice', headerName: 'VIP(£)', width: 130 },
      {
        field: 'isAvailable',
        headerName: 'Availibility',
        width: 130,
        renderCell: (params) =>
          params.row.isAvailable ? <EventAvailableIcon sx={{ color: 'success.main' }} /> : <NewReleasesIcon sx={{ color: 'error.main' }} />
      },
      { field: 'tourOwnerName', headerName: 'Owner', width: 120, renderCell: (params) => <div>{params.row.tourOwner.name}</div> },
      { field: 'tourOwnerEmail', headerName: 'OwnerEmail', width: 150, renderCell: (params) => <div>{params.row.tourOwner.email}</div> },
      { field: 'tourOwnerPhone', headerName: 'OwnerPH', width: 140, renderCell: (params) => <div>{params.row.tourOwner.phoneNo}</div> },

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
            New Tour
          </Button>
        </AnimateButton>
      </Box>
      <DataGrid
        columns={columns}
        rows={allData}
        getRowSpacing={(params) => ({ top: params.isFirstVisible ? 0 : 5, bottom: params.isLastVisible ? 0 : 5 })}
        getRowId={(row) => row.tourId}
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
        <TourUpdateModal
          message="Are you sure you want to Update?"
          open={showUpdateModal.val}
          handleClose={() => {
            setShowUpdateModal({ val: false, data: null, isNew: false });
          }}
          tour={showUpdateModal.data}
          isNew={showUpdateModal.isNew}
          handleUpdateAgree={handleUpdateAgree}
        />
      )}
    </Box>
  );
};

export default Tours;
