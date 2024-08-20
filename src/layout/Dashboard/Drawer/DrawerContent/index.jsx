// project import
import { Box, Typography } from '@mui/material';
import NavCard from './NavCard';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { AuthContext } from 'contexts/authContext';
import { useContext } from 'react';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  const { userData } = useContext(AuthContext);

  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        <NavCard />

        <Navigation />
      </SimpleBar>
    </>
  );
}
