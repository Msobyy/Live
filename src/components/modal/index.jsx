// Modal.jsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/system';
import Login from 'pages/authentication/login';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Modal({ message, open, handleClose, handleAgree, handleDisagree }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
      <DialogContent sx={{ backgroundColor: theme.palette.primary[700] }}>
        <DialogContentText sx={{ color: theme.palette.grey[0] }} id="alert-dialog-slide-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.grey[0] }}>
        <Button className="Modaldisgree" sx={{ color:"error.main" }} onClick={handleDisagree}>
          Cancel
        </Button>
        <Button className="ModalAgree" onClick={handleAgree}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Modal;
