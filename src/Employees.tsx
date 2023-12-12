import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import './Employees.css';
import logoImage from './logo.jpg';

interface Employee {
  id: number;
  name: string;
  status: boolean;
  role: string;
  info: string;
  photo_binary: string;
}

const EmployeesPage: FC = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get('name') || '';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [nameValue, setNameValue] = useState(nameParam);
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchEmployees = (searchName: string) => {
    fetch(`http://localhost:8000/employees/?filter=${searchName}`)
      .then(response => response.json())
      .then(data => {
        setEmployees(data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  };

  const breadcrumbsItems = [
    { label: 'Все сотрудники', link: '' }
  ];

  const handleSearchClick = () => {
    navigateTo(`?filter=${nameValue}`);
    fetchEmployees(nameValue);
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
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="search-bar">
            <input
              type="text"
              id="name-input"
              placeholder="Поиск"
              value={nameValue}
              onChange={(event => setNameValue(event.target.value))}
            />
            <button type="button" id="search-button" onClick={handleSearchClick}>
              Искать
            </button>
          </div>

          {/* Добавлен блок для кнопки сортировки */}
          <div className="sort-button-container text-center">
            <button type="button" id="sort-button" onClick={handleSortClick}>
              Сортировка: {sortOrder === 'asc' ? 'А-Я' : 'Я-А'}
            </button>
          </div>

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
