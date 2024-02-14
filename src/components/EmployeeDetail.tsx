import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import '../styles/EmployeeDetail.css';
import logoImage from '../logo.jpg';
import Header from './Header';
import axios from 'axios';


const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Accessing the employee_id from the URL
  const [employeeData, setEmployeeData] = useState({
    name: 'Сотрудник 1',
    photo_binary: null,
    role: 'преподаватель',
    info: 'Мок сотрудник',
  });
  const breadcrumbsItems = [
    { label: 'Все сотрудники', link: '/RIP_front/employees' },
    { label: 'Подробнее', link: '' },
  ];


  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`/api/employees/photo/${id}/`);
      const data = response.data;
      setEmployeeData(data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();

    return () => {
    };
  }, [id]); // Dependency array ensures the effect runs whenever 'id' changes

  return (
    <div className="container">
      {
        <div className="row">
          <Header/>
          <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
          <div className="col">
            <div className="card">
              <img
                src={(employeeData.photo_binary !== null) ? `data:image/jpeg;base64,${employeeData.photo_binary}` : logoImage}
                alt={employeeData.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h3 className="card-title">{employeeData.name}</h3>
                <p className="card-text">Должность: {employeeData.role}</p>
                <p className="card-text">Информация: {employeeData.info}</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default EmployeeDetailPage;
