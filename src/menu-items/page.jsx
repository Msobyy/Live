// assets
import { LoginOutlined, CarOutlined, ProfileOutlined, BookOutlined } from '@ant-design/icons';
import TourIcon from '@mui/icons-material/Tour';
import GroupIcon from '@mui/icons-material/Group';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { AuthContext } from 'contexts/authContext';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  GroupIcon,
  SupervisedUserCircleIcon,
  CarOutlined,
  BookOutlined,
  TourIcon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'Groups',
  title: 'Groups',
  type: 'group',
  children: [
    // {
    //   id: 'login1',
    //   title: 'Login',
    //   type: 'item',
    //   url: '/login',
    //   icon: icons.LoginOutlined,
    //   target: false
    // },
    // {
    //   id: 'register1',
    //   title: 'Register',
    //   type: 'item',
    //   url: '/register',
    //   icon: icons.ProfileOutlined,
    //   target: false
    // },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users-page',
      icon: icons.GroupIcon
    },
    {
      id: 'Drivers',
      title: 'Drivers',
      type: 'item',
      url: '/drivers-page',
      icon: icons.SupervisedUserCircleIcon
    },
    // {
    //   id: 'Cars',
    //   title: 'Cars',
    //   type: 'item',
    //   url: '/cars-page',
    //   icon: icons.CarOutlined
    // },
    // {
    //   id: 'Bookings',
    //   title: 'Bookings',
    //   type: 'item',
    //   url: '/bookings-page',
    //   icon: icons.BookOutlined
    // },
    // {
    //   id: 'Tours',
    //   title: 'Tours',
    //   type: 'item',
    //   url: '/tours-page',
    //   icon: icons.TourIcon
    // }
  ]
};

export default pages;
