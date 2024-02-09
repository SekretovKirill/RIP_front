// EmployeesPage.tsx
import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import SearchBar from './SearchBar';
import SortButton from './SortButton';
import Header from './Header';
import '../styles/Employees.css';
import logoImage from '../logo.jpg';

interface Employee {
  id: number;
  name: string;
  status: boolean;
  role: string;
  info: string;
  photo_binary: string|null;
}

const EmployeesPage: FC = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get('name') || '';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [nameValue] = useState(nameParam);
  const [sortOrder, setSortOrder] = useState('asc');

  const mockEmployees: Employee[] = [
    {
      id: 1,
      name: 'Сотрудник 1',
      status: true,
      role: 'преподаватель',
      info: 'Мок сотрудник ',
      photo_binary: null,
    },
    {
      id: 2,
      name: 'Сотрудник 2',
      status: true,
      role: 'преподаватель',
      info: 'Мок сотрудник ',
      photo_binary: null,
    },
    {
      id: 3,
      name: 'Сотрудник 3',
      status: true,
      role: 'студент',
      info: 'Мок сотрудник ',
      photo_binary: null,
    }
  ]
    const fetchEmployees = (searchName: string) => {
      const controller = new AbortController();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('Timeout'), 1000));
    
      Promise.race([
        fetch(`http://localhost:8000/employees/?filter=${searchName}`, { signal: controller.signal })
          .then(response => response.json())
          .then(data => setEmployees(data)),
        timeoutPromise
      ])
        .catch(error => {
          if (error === 'Timeout') {
            console.log('Время ожидания ответа превысило 3 секунды.');
            setEmployees(mockEmployees)
            // Дополнительная логика, если запрос прерван по тайм-ауту
          } else {
            console.error('Error fetching employees:', error);
            setEmployees(mockEmployees);
          }
        })
        .finally(() => controller.abort());
    };
    
  const breadcrumbsItems = [
    { label: 'Все сотрудники', link: '' }
  ];


  const handleSearch = (query: string) => {
    navigateTo(`?filter=${query}`);
    fetchEmployees(query);
  };

  const handleSortClick = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    fetchEmployees(nameValue);
  }, [nameValue]);

  const sortedEmployees = employees.slice().sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  return (

    <div className="album">
      <div className="container">
        <div className="row">
          < Header />
          <Breadcrumbs items={breadcrumbsItems} />

          <SearchBar onSearch={handleSearch} />

          {/* Добавлен блок для кнопки сортировки */}
          <SortButton sortOrder={sortOrder} onClick={handleSortClick} />

          <ul className="employees-list">
            {sortedEmployees.map((employee) => (
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
                    <button onClick={() => navigateTo(`/RIP_front/employees/${employee.id}/`)} className="btn btn-primary">
                      Подробнее
                    </button>
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

export default EmployeesPage;
