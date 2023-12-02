import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EmployeesPage from './Employees';
import EmployeeDetailPage from './EmployeeDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Это наша стартовая страница</h1>,
  },
  {
    path: '/RIP/',
    element: <h1>Это наша страница с чем-то новеньким</h1>,
  },
  {
    path: '/RIP_front/employees',
    element: <EmployeesPage />,
  },
  {
    path: '/RIP_front/employees/:id/',
    element: <EmployeeDetailPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <hr />
    <RouterProvider router={router} />
  </React.StrictMode>,
);
