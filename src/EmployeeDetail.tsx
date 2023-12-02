import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import './EmployeeDetail.css'; // Изменил название стиля, предположим, что у вас есть стиль EmployeeDetail.css
import logoImage from './logo.jpg';

const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Accessing the employee_id from the URL
  const [employeeData, setEmployeeData] = useState({
    name: '',
    photo_binary: '',
    role: '',
    info: '',
  });

  const breadcrumbsItems = [
    { label: 'Все сотрудники', link: '/RIP_front/employees' },
    { label: 'Подробнее', link: '' },
  ];

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/employees/photo/${id}`); // Assuming your API endpoint is like 'employees/id'
        const data = await response.json();
        setEmployeeData(data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData(); // Call the fetchEmployeeData function when the component mounts

    // Cleanup the effect when the component is unmounted (optional)
    return () => {
      // Cleanup code (if needed)
    };
  }, [id]); // Dependency array ensures the effect runs whenever 'id' changes

  return (
    <div className="container">
      {
        <div className="row">
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
                <p className="card-text">Роль: {employeeData.role}</p>
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
