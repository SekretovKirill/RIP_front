import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from './Breadcrumbs';
import SearchBar from './SearchBar';
import SortButton from './SortButton';
import { RootState } from '../redux/store';
import { setSearch, setSortOrder } from '../redux/FilterSlice';
import Header from './Header';
import '../styles/Employees.css';
import logoImage from '../logo.jpg';
import emptycart from '../empty.png';
import fullcart from '../full.png';
import axios, { AxiosError } from 'axios';

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

const EmployeesPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('filter') || '';

  const [sortOrder, setLocalSortOrder] = useState<'asc' | 'desc'>('asc');
  const userStatus = useSelector((state: RootState) => state.auth.role);

  // Explicitly define setState function
  const [state, setState] = useState<EmployeePageState>({
    employees: [],
    draft_id: null,
  });


  const filter = useSelector((state: RootState) => state.filter);

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
  const fetchEmployees = async (searchName: string) => {
    const controller = new AbortController();
    // const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('Timeout'), 1000));
  
    try {
      const response = await axios.get(`http://localhost:8000/employees/?filter=${searchName}`, {
        withCredentials: true,
        signal: controller.signal,
      });
  
      const { employees, draft_id }: { employees: Employee[]; draft_id: number | null } = response.data;
      setState((prev) => ({ ...prev, employees, draft_id: draft_id !== undefined ? draft_id : null }));      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          console.log('Not Found');
        } else {
          console.error('Error fetching employees:', axiosError.message);
        }
      } else if (error instanceof Error && error.message === 'Timeout') {
        console.log('Время ожидания ответа превысило 3 секунды.');
        setState((prev) => ({ ...prev, employees: mockEmployees }));
      } else {
        console.error('Error fetching employees:', error);
        setState((prev) => ({ ...prev, employees: mockEmployees }));
      }
    } finally {
      controller.abort();
    }
  };
  
    
  const breadcrumbsItems = [
    { label: 'Все сотрудники', link: '' }
  ];

  const handleSearch = (query: string) => {
    dispatch(setSearch(query));
    fetchEmployees(query);
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
  setLocalSortOrder(getValidSortOrder(filter.sortOrder));
  fetchEmployees(filter.search || searchParam);
}, [filter.search, filter.sortOrder, searchParam]);


const sortedEmployees = state.employees ? state.employees.slice().sort((a, b) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();

  return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
}) : [];

const handleUserButtonClick = (draftId: number | null) => {
  if (userStatus === 'User' && draftId !== null) {
    navigateTo(`/RIP_front/requests/${draftId}/`)
  }
};

const renderCartButton = (employee: Employee) => {
  if (userStatus === 'User') {
    return (
      <button
        className="btn btn-primary"
        onClick={() => handleAddToCart(employee.id)}
      >
        Добавить в корзину
      </button>
    );
  }
  return null;
};

const handleAddToCart = async (employeeId: number) => {
  try {
    const response = await axios.post(`http://localhost:8000/add-employee-to-request/${employeeId}/`, null, {
      withCredentials: true,
    });
    fetchEmployees(filter.search || searchParam);
    console.log('Employee added to cart:', response.data);
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error);
  }
};

const renderUserButton = (userStatus: string | null) => {
  if (userStatus === 'User') {
    return (
      <div style={{ marginLeft: 'auto', textAlign: 'right'}}>
        <button
          className=""
          onClick={() => handleUserButtonClick(state.draft_id)}
          disabled={state.draft_id === null}
          style={{ backgroundColor: 'white', border: 'none' }}
        >
          <img
            src={state.draft_id ? fullcart : emptycart}
            alt="Cart Icon"
            style={{ width: '70px', height: '70px' }}
          />
        </button>
      </div>
    );
  } else {
    // Render null or another component for other roles
    return null;
  }
};




  return (

    <div className="album">
      <div className="container">
        <div className="row">
          < Header />
          <Breadcrumbs items={breadcrumbsItems} />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SearchBar onSearch={handleSearch} value={filter.search || searchParam} />
            <div style={{ margin: '10px auto', textAlign: 'center' }}>
              <SortButton sortOrder={sortOrder} onClick={handleSortClick} />
            </div>
            {renderUserButton(userStatus)}
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
                    {renderCartButton(employee)}
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

