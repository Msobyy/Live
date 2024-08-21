import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from 'contexts/authContext.jsx';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <AuthProvider>
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router}  />
          <ToastContainer />
        </ScrollTop>
      </ThemeCustomization>
    </AuthProvider>
  );
}
