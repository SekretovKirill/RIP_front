import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/Employees.css'; // Update your CSS file if needed
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import { Link } from 'react-router-dom'; // Импортируем Link
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { RootState } from '../redux/store';
import { setUser, setStatus, setStartDate, setEndDate } from '../redux/FilterSlice';

interface Request {
  request: {
    id: number;
    name: string;
    status: string;
    created_date: string;
    formation_date: string;
    completion_date: string | null;
    client: number;
    moderator: number;
    info: string;
    security_count: number;
  };
}


const breadcrumbsItems = [
  { label: 'Список заявок', link: '' },
];
const ModeratorRequestsPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userParam = queryParams.get('user') || '';
  const statusParam = queryParams.get('status') || '';
  const startDateParam = queryParams.get('start_date') || '';
  const endDateParam = queryParams.get('end_date') || '';

  const [requests, setRequests] = useState<Request[]>([]);
  
  const auth = useSelector((state: RootState) => state.auth);
  const filter = useSelector((state: RootState) => state.filter);

  const isUserLoggedIn = document.cookie.includes('session_key');

  const fetchRequests = async () => {
    try {
      const response = await axios.get<Request[]>(`http://localhost:8000/requests/`, {
        params: {
          status: filter.status,
          start_date: filter.startDate,
          end_date: filter.endDate,
        },
        withCredentials: true,
      });
  
      const data = response.data;
  
      // Если у пользователя роль админа и указан конкретный пользователь в фильтре, фильтруем по client
      let filteredData = data;
  
      if (auth.role === 'Admin' && filter.user !== null && filter.user !== '') {
        const userId = parseInt(filter.user, 10);
        filteredData = data.filter((requestItem: Request) => requestItem.request.client === userId);
      }
      if (auth.role === 'User' && auth.id) {
        const userAuthId = parseInt(auth.id, 10);
        filteredData = data.filter((requestItem: Request) => requestItem.request.client === userAuthId);
      }
  
      setRequests(filteredData);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
  
  useEffect(() => {
    if (!isUserLoggedIn) {
      navigateTo('/RIP_front/login');
    } else {
      const userFromStorage = localStorage.getItem('user');
      dispatch(setUser(userFromStorage || userParam));

      // Установим статус из localStorage, если он там есть
      const statusFromStorage = localStorage.getItem('status');
      dispatch(setStatus(statusFromStorage || statusParam));

      dispatch(setStartDate(localStorage.getItem('start_date') || startDateParam));
      dispatch(setEndDate(localStorage.getItem('end_date') || endDateParam));
      fetchRequests();
    }
  }, [auth.isAuthenticated, auth.role, userParam, statusParam, startDateParam, endDateParam, navigateTo]);


  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    dispatch(setStatus(selectedStatus));

    // Сохраняем статус в localStorage
    localStorage.setItem('status', selectedStatus);
  };

  const handleUserChange = (value: string) => {
    if (auth.role === 'Admin') {
      dispatch(setUser(value));
    }
  };

  const statusTranslations: Record<string, string> = {
    'in progress': 'В процессе',
    'completed': 'Завершено',
    'canceled': 'Отменено',
    null: 'Неизвестно',
  };
  
  const handleApprove = (requestId: number) => {
    const data = { status: 'completed' };
  
    const cookies = document.cookie;
  
    // const headers = {
    //   'Content-Type': 'application/json',
    //   'Cookie': `session_key=${cookies}`
    // };
  
    axios.put(`http://localhost:8000/requests/${requestId}/put_admin/`, data, {withCredentials: true,})
      .then(response => {
        console.log(response.data);
        fetchRequests();
      })
      .catch(error => {
        console.error('Error approving request:', error);
      });
  };
  const handleReject = (requestId: number) => {
    const data = { status: 'canceled' };
  
    axios.put(`http://localhost:8000/requests/${requestId}/put_admin/`, data, {withCredentials: true,})
      .then(response => {
        console.log(response.data);
        fetchRequests();
      })
      .catch(error => {
        console.error('Error rejecting request:', error);
      });
  };
  
  
  const handleStartDateChange = (date: Date | null) => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;
    dispatch(setStartDate(formattedDate));
  };
  
  const handleEndDateChange = (date: Date | null) => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;
    dispatch(setEndDate(formattedDate));
  };


  return (
    <div>
      <Header />
      <div className="album">
        <div className="container">
          <div className="row">
            <Breadcrumbs items={breadcrumbsItems} />
            {auth.role === 'Admin' && (
              <div>
                <label htmlFor="userId" >User ID:</label>
                <input
                  type="text"
                  id="userId"
                  value={filter.user || ''}
                  onChange={(e) => handleUserChange(e.target.value)}
                />
              </div>
            )}
            <select
              value={filter.status || ''}
              onChange={handleStatusChange}
            >
            <option value="">
              {statusTranslations[filter.status] || 'Все статусы'}
            </option>
            {['in progress', 'completed', 'canceled'].map((status) => (
              <option key={status} value={status}>
                {statusTranslations[status]}
              </option>
            ))}

            </select>
            <DatePicker
              value={filter.startDate ? format(new Date(filter.startDate), 'dd.MM.yyyy') : ''}
              selected={filter.startDate ? new Date(filter.startDate) : null}
              onChange={handleStartDateChange}
              placeholderText="Дата от"
            />
            <DatePicker
              value={filter.endDate ? format(new Date(filter.endDate), 'dd.MM.yyyy') : ''}
              selected={filter.endDate ? new Date(filter.endDate) : null}
              onChange={handleEndDateChange}
              placeholderText="Дата до"
            />
            <button onClick={fetchRequests}>Search</button>
            <table className="table"> 
            <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Название</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Дата создания</th>
                  <th scope="col">Дата формирования</th>
                  <th scope="col">Дата завершения</th>
                  {auth.role === 'Admin' && (
                    <>
                      <th scope="col">Модератор</th>
                      <th scope="col">Пользователь</th>
                    </>
                  )}
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.request.id}>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{req.request.id}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>
                      <Link to={`/RIP_front/requests/${req.request.id}` }>
                        {req.request.name}
                      </Link>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{statusTranslations[req.request.status]}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{format(new Date(req.request.created_date), 'dd.MM.yyyy')}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{format(new Date(req.request.formation_date), 'dd.MM.yyyy')}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{req.request.completion_date ? format(new Date(req.request.completion_date), 'dd.MM.yyyy') : 'N/A'}</td>
                    {auth.role === 'Admin' && (
                    <>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{req.request.moderator}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{req.request.client}</td>
                    </>
                  )}
                    <td>
                      <Link to={`/RIP_front/requests/${req.request.id}`} className="btn btn-primary">
                        Подробнее
                      </Link>
                      {auth.role === 'Admin' && req.request.status === 'in progress' && (
                        <div>
                          <button
                            onClick={() => handleApprove(req.request.id)}
                            className="btn btn-success"
                          >
                            Подтвердить
                          </button>
                          <button
                            onClick={() => handleReject(req.request.id)}
                            className="btn btn-danger"
                          >
                            Отклонить
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorRequestsPage;
