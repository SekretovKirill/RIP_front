import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/Employees.css';
import SearchBar from './SearchBar';
import { RootState } from '../redux/store';
import { setSearch, setSortOrder } from '../redux/FilterSlice';
import SortButton from './SortButton';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';

import axios from 'axios';


interface Employee {
  id: number;
  name: string;
  status: boolean;
  role: string;
  info: string;
  photo_binary: string|null;
}
interface EmployeePageState {
  employees: Employee[];
  draft_id: number | null;
}

const breadcrumbsItems = [
  { label: 'Список сотрудников', link: '' }
];

const ModeratorEmployeesPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('q') || '';

  const [sortOrder, setLocalSortOrder] = useState<'asc' | 'desc'>('asc');
  const auth = useSelector((state: RootState) => state.auth);
  const [state, setState] = useState<EmployeePageState>({
    employees: [],
    draft_id: null,
  });
  const filter = useSelector((state: RootState) => state.filter);

  const isUserLoggedIn = document.cookie.includes('session_key');

  const handleSearch = (query: string) => {
    dispatch(setSearch(query));
    fetchEmployees(query);
  };

  const handleDelete = (employeeId: number) => {
    axios.delete(`/api/employees/${employeeId}/delete/`,  {withCredentials: true} )
      .then(() => fetchEmployees(filter.search || searchParam))
      .catch(error => {
        console.error('Error deleting employee:', error);
      });
  };


  const fetchEmployees = (searchText: string) => {
    axios.get(`/api/employees/?filter=${searchText}`, {
      withCredentials: true,
    })
      .then(response => {
        const { employees, draft_id }: { employees: Employee[]; draft_id: number | null } = response.data;
        setState((prev) => ({ ...prev, employees, draft_id: draft_id !== undefined ? draft_id : null }));
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  };
  

  const handleSortClick = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setLocalSortOrder(newSortOrder);
    dispatch(setSortOrder(newSortOrder));
  };

  function getValidSortOrder(value: string): 'asc' | 'desc' {
    return value === 'asc' ? 'asc' : 'desc';
  }

  useEffect(() => {
    if (!isUserLoggedIn || auth.role !== 'Admin') {
      navigateTo('/RIP_front/login');
    } else {
      setLocalSortOrder(getValidSortOrder(filter.sortOrder));
      fetchEmployees(filter.search || searchParam);
    }
  }, [auth.isAuthenticated, auth.role, navigateTo]);


  const sortedEmployees = state.employees ? state.employees.slice().sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
  
    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  }) : [];

  return (
    <div>
      <Header />
      <div className="album">
        <div className="container">
          <div className="row">
            <Breadcrumbs items={breadcrumbsItems} />
            <div className="input-group mb-3">
              <SearchBar onSearch={handleSearch} value={filter.search || searchParam} />
              <SortButton sortOrder={sortOrder} onClick={handleSortClick} />
              <div className="text-and-button">
                <button className="btn btn-primary" onClick={() => navigateTo('/RIP_front/moderator/employees/new/')}>
                  Добавить сотрудника
                </button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">№</th>
                  <th scope="col">Имя</th>
                  <th scope="col">Роль</th>
                  <th scope="col">Информация</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{employee.id}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{employee.name}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{employee.role}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{employee.info}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>
                      <button onClick={() => handleDelete(employee.id)} className="btn btn-primary">
                        Удалить
                      </button>
                      <a href={`/RIP_front/moderator/employees/change/${employee.id}/`} className="btn btn-primary">
                        Редактировать
                      </a>
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

export default ModeratorEmployeesPage;
