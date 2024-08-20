import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getAllUsersData, DeleteDoc } from 'utils/firebaseutils';
import Modal from '../../components/modal';
//import Typography from 'themes/typography';
import { Typography, IconButton } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/system';
import Avatar from 'components/@extended/Avatar';
import { AuthContext } from 'contexts/authContext';
import Loader from 'components/Loader';

export default function User() {
  const { users } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const usersData = users;
  const theme = useTheme();

  //DataGrid
  const cols = useMemo(
    () => [
      {
        field: 'profilePic',
        headerName: 'Avatar',
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => <Avatar src={params.row.profilePic} />
      },
      { field: 'name', headerName: 'Name', width: 150, cellClassName: 'name-column-cell' },
      { field: 'userId', headerName: 'ID', width: 230 },
      { field: 'email', headerName: 'Email', width: 200, sortable: false },
      { field: 'gender', headerName: 'Gender', width: 150 },
      {
        field: 'isAdmin',
        headerName: 'Role',
        headerAlign: 'center',
        width: 200,
        sortable: false,
        cellClassName: 'access-column-cell',
        renderCell: ({ row: { isAdmin } }) => (
          <Box
            backgroundColor={isAdmin === true ? 'indigo.main' : 'indigo.light'}
            // backgroundColor={isAdmin === true ? 'indigo.main' : isDispatcher === true ? 'indigo.lighter' : 'indigo.light'}
            sx={{
              width: '100%',
              margin: '0 auto',
              p: '5px',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
          >
            <Typography sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{isAdmin === true ? 'Admin' : 'Not Specified'}</Typography>
            {/* {isAdmin === true ? 'Admin' : isDispatcher === true ? 'Dispatcher' : 'User'} */}
          </Box>
        )
      },
      {
        field: 'delete',
        headerName: 'Delete',
        sortable: false,
        width: 150,
        renderCell: ({ row, rowIndex }) => (
          <Box
            sx={{
              width: '60%',
              margin: '0 auto',
              p: '5px',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
          >
            <IconButton
              onClick={() => {
                handleDeletion(row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ color: 'error.main' }} />
            </IconButton>
          </Box>
        )
      }
    ],
    []
  );

  //Modal
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeletion = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setShowModal(true);
  };

  const handleAgree = async () => {
    if (selectedRowIndex !== null) {
      setLoading(true);
      try {
        // Delete the document from the database
        const res = await DeleteDoc('users', selectedRowIndex);
        if (res) {
          // Reset selectedRowIndex and close modal
          setShowModal(false);
          setSelectedRowIndex(null);
          toast.success('Data deleted Successfully');
        } else {
          toast.error('Error deleting user');
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
    setSelectedRowIndex(null);
  };

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
          columns={cols}
          rows={usersData}
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
      </Box>
    </>
  );
}
