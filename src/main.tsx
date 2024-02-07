import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EmployeesPage from './components/Employees';
import EmployeeDetailPage from './components/EmployeeDetail';
import RegistrationPage from './components/Registration'
import LoginPage from './components/LoginPage';
import ModeratorEmployeesPage from './components/Moderator_employees';
import ModeratorEmployeesChangePage from './components/Moderator_employees_change';
// import ModeratorEmployeesNewPage from './components/Moderator_employees_new';
import RequestDetailsPage from './components/RequestDetails';
import RequestsPage from './components/Requests';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const router = createBrowserRouter([
  {
    path: 'RIP_front/login/',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <EmployeesPage />,
  },
  {
    path: 'RIP_front/register/',
    element: <RegistrationPage />,
  },
  {
    path: '/RIP_front',
    element: <EmployeesPage />,
  },
  {
    path: '/RIP_front/employees',
    element: <EmployeesPage />,
  },
  {
    path: '/employees',
    element: <EmployeesPage />,
  },
  {
    path: '/RIP_front/employees/:id/',
    element: <EmployeeDetailPage />,
  },
  {
    path: '/RIP_front/moderator/employees/new',
    element: <ModeratorEmployeesChangePage />,
  },
  {
    path: '/RIP_front/moderator/employees',
    element: <ModeratorEmployeesPage />,
  },
  {
    path: '/RIP_front/moderator/employees/change/:id',
    element: <ModeratorEmployeesChangePage />,
  },
  {
    path: '/RIP_front/requests',
    element: <RequestsPage />,
  },
  {
    path: '/RIP_front/requests/:id/',
    element: <RequestDetailsPage />,
  },

]);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <hr />
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// );

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <hr />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
