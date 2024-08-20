// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// assets
import avatar from 'assets/images/users/avatar-group.png';
import AnimateButton from 'components/@extended/AnimateButton';
import { AuthContext } from 'contexts/authContext';
import { useContext, useState } from 'react';
import Modal from 'components/modal';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

export default function NavCard() {
  const { userData, logout } = useContext(AuthContext);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleAgreeLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleDisagreeLogout = () => {
    setShowLogoutModal(false);
  };
  return (
    <>
      <MainCard sx={{ bgcolor: 'indigo.lighter', m: 3 }}>
        <Stack alignItems="center" spacing={2.5}>
          <CardMedia component="img" image={userData?.profilePic} sx={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          <Stack alignItems="center">
            <Typography variant="h3" color={'purple'}>
              {userData?.name}
            </Typography>
            <Typography variant="h6" color="secondary">
              {userData?.isAdmin ? 'ADMIN' : 'DISPATCHER'}
            </Typography>
          </Stack>
          <AnimateButton>
            <Button component={Link} onClick={handleLogout} variant="contained" color="error" size="small">
              Logout
            </Button>
          </AnimateButton>
        </Stack>
      </MainCard>
      <Modal
        message="Are you sure you want to logout?"
        open={showLogoutModal}
        handleClose={() => setShowLogoutModal(false)}
        handleAgree={handleAgreeLogout}
        handleDisagree={handleDisagreeLogout}
      />
    </>
  );
}
