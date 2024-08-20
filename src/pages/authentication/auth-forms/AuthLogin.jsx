import PropTypes from 'prop-types';
import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { auth } from '../../../firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { AuthContext } from 'contexts/authContext.jsx';
import { getCurrentUserData, getUser } from '../../../utils/firebaseutils.js';
import Loader from 'components/Loader';

// assets

import FirebaseSocial from './FirebaseSocial';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  // const [checked, setChecked] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ph, setPh] = useState('');
  //const [loading, setLoading] = false;
  const { isLoggedIn, login, setUserData, userData } = useContext(AuthContext);

  const navigate = useNavigate();

  const onCaptchVerify = async () => {
    if (!window.recaptchaVerifier) {
      const response = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {},
        'expired-callback': () => {}
      });

      if (response) {
        return response;
      } else {
        return false;
      }
    }
  };

  const handlePhoneVerification = async () => {
    setLoading(true);

    try {
      const isAdmin = await getUser(ph);
      if (isAdmin) {
        const response = await onCaptchVerify();

        if (response) {
          const formatPh = '+' + ph;
          const confirmationResult = await signInWithPhoneNumber(auth, formatPh, response);
          window.confirmationResult = confirmationResult;
          setShowOtp(true);
          toast.success('Otp sent successfully');
        } else {
          toast.error('captcha not verified');
        }
      }
    } catch (error) {
      toast.error('Error while sending otp');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result?.user;
      let result2 = false;
      if (user) {
        result2 = await getCurrentUserData(user.uid, 'users');
      }
      if (result2) {
        login();
        setUserData(result2);
        toast.success('Login Successfully');
        navigate('/');
      } else {
        toast.success('Userdata cannot be set');
      }
    } catch (error) {
      toast.error('Otp not verified');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div id="recaptcha-container"></div>
      {showOtp ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <InputLabel htmlFor="email-login">Enter Your OTP</InputLabel>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  inputType="tel"
                  inputStyle={{ width: '100%', height: '2em' }}
                  renderInput={(props) => <input {...props} />}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleOtpVerification}
                >
                  Verify
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <InputLabel htmlFor="email-login">Phone Number</InputLabel>
                <PhoneInput
                  value={ph}
                  onChange={setPh}
                  country={'pk'}
                  placeholder="Enter Your Phone Numbr"
                  inputStyle={{ width: '100%' }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handlePhoneVerification}
                >
                  Sign in
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
