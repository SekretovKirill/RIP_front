import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import logoImage from '../logo.jpg';

interface Employee {
  id: number;
  name: string;
  status: boolean;
  role: string;
  info: string;
  photo_binary: string | null;
}

interface RequestDetails {
  id: number;
  status: string;
  name: string;
  info: string;
  created_date: string;
  formation_date: string;
  completion_date: string;
  client: number;
  moderator: number;
  related_employees: Array<Employee>;
}

const statusTranslations: Record<string, string> = {
  'in progress': 'В процессе',
  'completed': 'Завершено',
  'canceled': 'Отменено',
  'entered': 'Введено',
  null: 'Неизвестно',
};

const formatDate = (dateString: string | null): string => {
  if (dateString === null) {
    return 'N/A'; // Or any other placeholder for null dates
  }

  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const RequestDetailsPage: React.FC = () => {
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const { id } = useParams<{ id: string }>();

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get<RequestDetails>(`/api/requests/${id}/`, { withCredentials: true });
      setRequestDetails(response.data);
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  if (!requestDetails) {
    return <div>Loading...</div>;
  }

  const formattedCreationDate = formatDate(requestDetails.created_date);
  const formattedFormationDate = formatDate(requestDetails.formation_date);
  const formattedCompletionDate = formatDate(requestDetails.completion_date);

  const breadcrumbsItems = [
    { label: 'Все заявки', link: '/RIP_front/requests' },
    { label: `${requestDetails ? requestDetails.name : 'Loading...'}`, link: `` },
  ];

  const handleRemoveEmployee = async (employeeId: number) => {
    try {
      await axios.delete(`/api/remove-employee-from-request/`, {
        data: { request_id: id, employee_id: employeeId },
        withCredentials: true,
      });
      fetchRequestDetails();
    } catch (error) {
      console.error('Error removing employee from request:', error);
    }
  };

  const handleSendRequest = async () => {
    try {
      await axios.put(`/api/requests/${id}/put_user/`, null, {
        withCredentials: true,
      });
      fetchRequestDetails();
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <Breadcrumbs items={breadcrumbsItems} />
        <h1>{requestDetails.name}</h1>
        <p></p>
        {requestDetails.status === 'entered' && (
          <div>
            <button
              className="btn btn-primary"
              onClick={handleSendRequest}
            >
              Отправить заявку
            </button>
          </div>
        )}

        <div>
        <p>Статус: {statusTranslations[requestDetails.status]}</p>
          <p>Дата создания: {formattedCreationDate}</p>
          <p>Дата формирования: {formattedFormationDate}</p>
          <p>Дата завершения: {formattedCompletionDate}</p>
          <p>Информация: {requestDetails.info}</p>
        </div>

        <div>
          <h2>Сотрудники в заявке:</h2>
          <ul className="employees-list">
            {requestDetails.related_employees?.map((employee) => (
              <li key={employee.id}>
                <div className="card">
                  <img
                    src={(employee.photo_binary !== null) ? `data:image/jpeg;base64,${employee.photo_binary}` : logoImage}
                    alt={employee.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h3 className="card-title">{employee.name}</h3>
                    <p className="card-text">Должность: {employee.role}</p>
                    {requestDetails.status === 'entered' && (
                      <>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveEmployee(employee.id)}
                        >
                          Убрать из заявки
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
