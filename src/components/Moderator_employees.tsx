import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/Employees.css';
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

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchValue, setSearchValue] = useState(searchParam);
  const [sortOrder, setLocalSortOrder] = useState<'asc' | 'desc'>('asc');
  const auth = useSelector((state: RootState) => state.auth);

  const filter = useSelector((state: RootState) => state.filter);

  const isUserLoggedIn = document.cookie.includes('session_key');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = e.target.value;
    setSearchValue(newSearchValue);
    dispatch(setSearch(newSearchValue));
  };

  const handleSearchClick = () => {
    axios.get(`http://localhost:8000/employees/?filter=${searchValue}`)
      .then(response => {
        const data = response.data;
        setEmployees(data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  };

  const handleDelete = (employeeId: number) => {
    axios.delete(`http://localhost:8000/employees/${employeeId}/delete/`,  {withCredentials: true} )
      .then(() => fetchEmployees(searchValue))
      .catch(error => {
        console.error('Error deleting employee:', error);
      });
  };


  const fetchEmployees = (searchText: string) => {
    axios.get(`http://localhost:8000/employees/?filter=${searchText}&order=${sortOrder}`, {
      withCredentials: true,
    })
      .then(response => {
        const { employees, draft_id } = response.data;
        console.log(draft_id)
        
        // If draft_id is needed for some logic, use it here
  
        setEmployees(employees);
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
      const storedSearch = localStorage.getItem('search') || '';
      setLocalSortOrder(getValidSortOrder(filter.sortOrder));
      setSearchValue(storedSearch);
      dispatch(setSearch(storedSearch));
      fetchEmployees(storedSearch);
    }
  }, [auth.isAuthenticated, auth.role, navigateTo]);


  const sortedEmployees = employees.slice().sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  return (
    <div>
      <Header />
      <div className="album">
        <div className="container">
          <div className="row">
            <Breadcrumbs items={breadcrumbsItems} />
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Поиск"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={handleSearchClick}>
                Поиск
              </button>
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
