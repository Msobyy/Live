import { auth, db, storage, messaging } from 'firebase.config';
import { collection, getDocs, doc, query, where, getDoc, setDoc, deleteDoc, updateDoc, deleteField, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from 'contexts/authContext';
import { getToken } from 'firebase/messaging';

const getCurrentUserData = async (id, collection) => {
  try {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      toast.error('User Not Found!');
      return null;
    }
  } catch (error) {
    toast.error('womething went wrong while getting user');
    return null;
  }
};

const getAllUsersData = async (collectionName) => {
  try {
    const arr = [];
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
      arr.push({ id: doc.id, ...doc.data() });
    });
    return arr;
  } catch (error) {
    toast.error('Something went wrong!!:getALLUsersData');
    return null;
  }
};

const DeleteDoc = async (collection, id) => {
  try {
    // First, delete all fields of the document

    // Then, delete the document itself
    await deleteDoc(doc(db, collection, id));

    return true;
  } catch (error) {
    return false;
  }
};

const Updatedocdata = async (collection, id, data) => {
  try {
    const dataRef = doc(db, collection, id);
    await updateDoc(dataRef, data);
    return true; // Indicate success
  } catch (error) {
    return false; // Indicate failure
  }
};

const UploadImage = (collection, file) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `${collection}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            break;
          case 'running':
            break;
        }
      },
      (error) => {
        reject({
          error: error,
          success: false
        });
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            success: true,
            data: downloadURL
          });
        } catch (error) {
          reject({
            error: error,
            success: false
          });
        }
      }
    );
  });
};

const AddDoc = async (collection, id, data) => {
  try {
    await setDoc(doc(db, collection, id), data);
    return true;
  } catch (error) {
    return false;
  }
};

const getUser = async (phoneNo) => {
  try {
    const q = query(collection(db, 'users'), where('phoneNo', '==', `+${phoneNo}`));
    let data;

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        data = doc.data();
      });
      if (data.isAdmin || data.isDispatcher) {
        return true;
      }
    }
    toast.error('Admin not registered');
    return false;
  } catch (error) {
    toast.error('Something went wrong');
    return false;
  }
};

export function generateRandomId() {
  const randomNumber = Math.floor(Math.random() * 1e17); // Generates a random number up to 17 digits
  return randomNumber.toString().padStart(17, '0'); // Ensures the ID is exactly 17 digits
}

export const sendNotification = async (data, target, deviceToken, title, body) => {
  const url = import.meta.env.VITE_APP_NOTIFICATION_URL;
  const accessToken = import.meta.env.VITE_APP_SERVER_KEY; // Replace with your actual FCM server key

  const notificationData = {
    to: deviceToken,
    notification: {
      title: title,
      body: body
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${accessToken}`
      },
      body: JSON.stringify(notificationData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send notification: ${errorData.error || response.statusText}`);
    }

    return true; // Indicate success
  } catch (error) {
    return false; // Indicate failure
  }
};

export const addNotification = async (booking, target, deviceToken, title, body) => {
  const obj = {
    title: title,
    description: body,
    fcmToken: deviceToken,
    targetUserCollection: target,
    targetUserId: target == 'users' ? booking.customerId : booking.driverId,
    customerId: booking.customerId,
    driverId: booking.driverId ? booking.driverId : null,
    vehicleId: booking.vehicleId ? booking.vehicleId : null,
    notificationType: 'booking',
    saveNotification: 'true',
    bookingId: booking.bookingId,
    createdAt: new Date().toISOString(),
    type: 'booking'
  };

  try {
    // Reference to the notifications collection of the target user
    const notificationsRef = collection(db, target, obj.targetUserId, 'notifications');

    // Add the notification document to the collection
    const docRef = await addDoc(notificationsRef, obj);

    return true; // Indicate success
  } catch (e) {
    return false; // Indicate failure
  }
};

export { getCurrentUserData, getAllUsersData, DeleteDoc, Updatedocdata, UploadImage, AddDoc, getUser };
