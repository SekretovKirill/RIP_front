import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../redux/store';
import Breadcrumbs from './Breadcrumbs';
import Header from './Header';

interface Employee {
  name: string;
  status: boolean;
  role: string;
  info: string;
  photo_binary: File | null;
}
const breadcrumbsItems = [
  { label: 'Список сотрудников', link: '/RIP_front/moderator/employees/' },
  { label: 'Создание', link: '' }
];

const ModeratorEmployeesNewPage: React.FC = () => {
  const isUserLoggedIn = document.cookie.includes('session_key');
  const auth = useSelector((state: RootState) => state.auth);
  // const user_role = useSelector((state: RootState) => state.auth.role);
  // const username = useSelector((state: RootState) => state.auth.name);
  const navigateTo = useNavigate();
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const [employeeData, setEmployeeData] = useState<Employee>({
    name: '',
    status: true,
    role: '',
    info: '',
    photo_binary: null,
  });

  useEffect(() => {
    // Проверяем авторизацию пользователя
    if (!isUserLoggedIn || auth.role !== 'Admin') {
      // Если пользователь не авторизован или не администратор, перенаправляем его на другую страницу
      console.log(auth.role)
      navigateTo('/RIP_front/login'); // Замените '/login' на путь к странице входа
    } else {
    }
  }, [auth.isAuthenticated, auth.role, navigateTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null;
  //   setEmployeeData((prevData) => ({
  //     ...prevData,
  //     photo_binary: file,
  //   }));
  // };

  // const openFileInput = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  const handleSaveChanges = async () => {
    try {
      // Step 1: Create new employee with POST request
      await axios.post('http://localhost:8000/employees/post/', {
        name: employeeData.name,
        status: employeeData.status,
        role: employeeData.role,
        info: employeeData.info,} ,{withCredentials: true },
      );
      navigateTo('/RIP_front/moderator/employees');

      // const newEmployeeData = response.data;

      // Step 2: Upload photo using PUT request
      // const formData = new FormData();
      // formData.append('key', 'photo');
      // formData.append('photo', employeeData.photo_binary as Blob);

      // const uploadResponse = await axios.put(
      //   `http://localhost:8000/employees/photo/${newEmployeeData.id}`,
      //   formData,{withCredentials: true }
      // );

      // Update employee data including image_url

    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  return (
    <div>
      <Header/>
      <div className="container">
        <div className="row">
          <div className="col">
          <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Имя
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      name="name"
                      value={employeeData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="info" className="form-label">
                      Информация
                    </label>
                    <textarea
                      className="form-control form-control-dis"
                      id="info"
                      name="info"
                      value={employeeData.info}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Роль
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="role"
                      name="role"
                      value={employeeData.role}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label htmlFor="photo" className="form-label">
                      Загрузить фото
                    </label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="photo"
                        name="photo"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />
                      <button type="button" className="btn btn-primary" onClick={openFileInput}>
                        Выберите файл
                      </button>
                    </div> */}
                  {/* </div> */}
                  <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                    Сохранить
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorEmployeesNewPage;
