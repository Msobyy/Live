import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const User = Loadable(lazy(() => import('pages/users/index')));
const Drivers = Loadable(lazy(() => import('pages/drivers/index')));
const Cars = Loadable(lazy(() => import('pages/cars/index')));
const Bookings = Loadable(lazy(() => import('pages/bookings/index')));
const Tours = Loadable(lazy(() => import('pages/tours/index')));
// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
import ProtectedRouteDispatcher from './ProtectedRouteDispatcher';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'users-page',
      element: (
        <ProtectedRouteDispatcher>
          <User />
        </ProtectedRouteDispatcher>
      )
    },
    {
      path: 'drivers-page',
      element: (
        <ProtectedRouteDispatcher>
          <Drivers />
        </ProtectedRouteDispatcher>
      )
    },
    {
      path: 'cars-page',
      element: (
        <ProtectedRouteDispatcher>
          <Cars />
        </ProtectedRouteDispatcher>
      )
    },
    {
      path: 'bookings-page',
      element: <Bookings />
    },
    {
      path: 'tours-page',
      element: (
        <ProtectedRouteDispatcher>
          <Tours />
        </ProtectedRouteDispatcher>
      )
    }
  ]
};

export default MainRoutes;
