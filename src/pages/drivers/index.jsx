import React, { useContext, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getAllUsersData, DeleteDoc } from 'utils/firebaseutils';
import Avatar from 'components/@extended/Avatar';

import { useTheme } from '@mui/material/styles';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '../../components/modal';
import { toast } from 'react-toastify';
import UpdateModal from 'components/updateModal';
import { AuthContext } from 'contexts/authContext';
import Loader from 'components/Loader';

const Drivers = () => {
  const theme = useTheme();

  //getting drivers DATA

  const { drivers } = useContext(AuthContext);

  //Deletion and updation of Data
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState({ val: false, data: null });
  const [loading, setLoading] = useState(false);

  const handleDeletion = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setShowModal(true);
  };

  const handleAgree = async () => {
    if (selectedRowIndex !== null) {
      setLoading(true);
      try {
        const res = await DeleteDoc('drivers', selectedRowIndex);
        if (res) {
          // Reset selectedRowIndex and close modal
          setShowModal(false);
          setSelectedRowIndex(null);
          toast.success('Data deleted Successfully');
        } else {
          toast.error('Error Deleting Driver');
        }
      } catch (error) {
        toast.error('Data cannot be deleted');
        // Handle error appropriately, e.g., show error message
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateAgree = async () => {
    try {
      // Reset selectedRowIndex and close modal
      toast.success('Data Updated Successfully');
    } catch (error) {
      toast.error('Data cannot be Updated');
    }
  };

  const handleDisagree = () => {
    setShowModal(false);
    setShowUpdateModal(false);
    setSelectedRowIndex(null);
  };

  const openEditModalFunction = (driverId) => {
    const selDriver = drivers.filter((obj) => obj.id == driverId);
    if (selDriver[0]?.id) {
      setShowUpdateModal({ val: true, data: selDriver[0] });
    }
  };

  //initiating data for Data Frid
  const columns =
    // useMemo(
    [
      {
        field: 'profilePic',
        headerName: 'Avatar',
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => <Avatar src={params.row.profilePic} />
      },
      { field: 'name', headerName: 'Name', width: 200, cellClassName: 'name-column-cell' },
      { field: 'driverType', headerName: 'Role', width: 200 },
      {
        field: 'isAvailable',
        headerName: 'Availibility',
        width: 180,
        renderCell: (params) =>
          params.row.isAvailable ? <EventAvailableIcon sx={{ color: 'success.main' }} /> : <NewReleasesIcon sx={{ color: 'error.main' }} />
      },
      {
        field: 'isProfileCompleted',
        headerName: 'Profile Status',
        width: 180,
        renderCell: (params) => (params.row.isProfileCompleted === true ? 'Completed' : 'InComplete')
      },
      {
        field: 'isProfileVerified',
        headerName: 'Profile Verified',
        width: 150,
        renderCell: (params) =>
          params.row.isProfileVerified ? <VerifiedIcon sx={{ color: 'success.main' }} /> : <CancelIcon sx={{ color: 'error.main' }} />
      },
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
        <DataGrid
          columns={columns}
          rows={drivers}
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
          <UpdateModal
            message="Are you sure you want to Update?"
            open={showUpdateModal.val}
            handleClose={() => {
              setShowUpdateModal({ val: false, data: null });
            }}
            driver={showUpdateModal.data}
            handleUpdateAgree={handleUpdateAgree}
          />
        )}
      </Box>
    </>
  );
};

export default Drivers;
