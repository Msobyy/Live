// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  CarOutlined,
  BookOutlined
} from '@ant-design/icons';
import TourIcon from '@mui/icons-material/Tour';


// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  CarOutlined,
  BookOutlined,
  TourIcon
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'services',
  title: 'Services',
  type: 'group',
  children: [
    // {
    //   id: 'util-typography',
    //   title: 'Typography',
    //   type: 'item',
    //   url: '/typography',
    //   icon: icons.FontSizeOutlined
    // },
    // {
    //   id: 'util-color',
    //   title: 'Color',
    //   type: 'item',
    //   url: '/color',
    //   icon: icons.BgColorsOutlined
    // },
    // {
    //   id: 'util-shadow',
    //   title: 'Shadow',
    //   type: 'item',
    //   url: '/shadow',
    //   icon: icons.BarcodeOutlined
    // },
    {
      id: 'Cars',
      title: 'Cars',
      type: 'item',
      url: '/cars-page',
      icon: icons.CarOutlined
    },
    {
      id: 'Bookings',
      title: 'Bookings',
      type: 'item',
      url: '/bookings-page',
      icon: icons.BookOutlined
    },
    {
      id: 'Tours',
      title: 'Tours',
      type: 'item',
      url: '/tours-page',
      icon: icons.TourIcon
    }
  ]
};

export default utilities;
