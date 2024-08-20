import { createContext, useState, useEffect } from 'react';
import { db } from 'firebase.config';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { messaging } from 'firebase.config';
import { getToken } from 'firebase/messaging';
import { Updatedocdata } from 'utils/firebaseutils';

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userData: null,
  setUserData: () => {},
  carRental: null,
  setCarRental: () => {},
  bookings: null,
  setBookings: () => {},
  drivers: null,
  setDrivers: () => {},
  users: null,
  setUsers: () => {},
  tours: null,
  setTours: () => {},
  airports: null,
  setAirports: () => {}
});

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check for existing login state in localStorage
    const storedValue = localStorage.getItem('isLoggedIn');
    return storedValue === 'true';
  });
  const [userData, setUserData] = useState();
  const [carRental, setCarRental] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [airports, setAirports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { VITE_APP_VAPID_KEY } = import.meta.env;

  async function requestPermission() {
    //requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: VITE_APP_VAPID_KEY
      });

      //We can send token to server

      return token;
    } else if (permission === 'denied') {
      //notifications are blocked
      alert('You denied for the notification');
      return null;
    }
  }

  useEffect(() => {
    async function handleToken() {
      if (isLoggedIn && userData) {
        const token = await requestPermission();
        if (token) {
          await Updatedocdata('users', userData.userId, { fcmToken: token });
        }
      }
    }
    handleToken();
  }, [isLoggedIn, userData]);

  useEffect(() => {
    let unsubNotifications = () => {};
    if (isLoggedIn) {
      const unsub = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        const arr = [];
        snapshot.docs.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });

        setBookings(arr);
      });

      const unsubusers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const arr = [];
        snapshot.docs.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setUsers(arr);
      });

      const unsubdrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
        const arr = [];
        snapshot.docs.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setDrivers(arr);
      });

      const unsubCars = onSnapshot(collection(db, 'carRental'), (snapshot) => {
        const arr = [];
        snapshot.docs.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setCarRental(arr);
      });

      const unsubTours = onSnapshot(collection(db, 'tours'), (snapshot) => {
        const arr = [];
        snapshot.docs.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setTours(arr);
      });
      const unsubairports = onSnapshot(collection(db, 'airports'), (snapshot) => {
        const arr = [];
        snapshot.docs.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setAirports(arr);
      });
      if (userData) {
        const notificationsRef = collection(db, 'users', userData.userId, 'notifications');
        const unsubNotifications = onSnapshot(notificationsRef, (snapshot) => {
          const arr = [];
          snapshot.docs.forEach((doc) => {
            arr.push({ id: doc.id, ...doc.data() });
          });
          setNotifications(arr);
        });
      }

      return () => {
        unsub();
        unsubusers();
        unsubdrivers();
        unsubCars();
        unsubTours();
        unsubairports();
        if (userData) {
          unsubNotifications();
        }
      };
    }
  }, [isLoggedIn, userData]);

  useEffect(() => {
    // Check for existing user data in localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData)); // Parse back to object
    }
  }, []);

  useEffect(() => {
    // Update localStorage when isLoggedIn changes
    localStorage.setItem('isLoggedIn', isLoggedIn);
    // Update localStorage when userData changes (optional)
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [isLoggedIn, userData]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null); // Clear user data on logout
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    cleanupRecaptchaVerifier();
  };

  const cleanupRecaptchaVerifier = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  // Call cleanup function when logging out or when component unmounts
  useEffect(() => {
    return () => {
      cleanupRecaptchaVerifier();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userData,
        setUserData,
        login,
        logout,
        carRental,
        setCarRental,
        bookings,
        setBookings,
        drivers,
        setDrivers,
        users,
        setUsers,
        tours,
        setTours,
        airports,
        setAirports,
        notifications,
        setNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
