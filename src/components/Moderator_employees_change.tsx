import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoImage from '../logo.jpg';
import axios from 'axios';
import { RootState } from '../redux/store';
import Breadcrumbs from './Breadcrumbs';
import Header from './Header';

interface Employee {
  name: string;
  status: boolean;
  role: string;
  info: string;
  photo_binary: string;
}

const breadcrumbsItems = [
  { label: 'Список сотрудников', link: '/RIP_front/moderator/employees/' },
  { label: 'Редактирование', link: '' },
];

const ModeratorEmployeesChangePage: React.FC = () => {
  const isUserLoggedIn = document.cookie.includes('session_key');
  const navigateTo = useNavigate();
  const { id } = useParams<{ id: string }>();
  const auth = useSelector((state: RootState) => state.auth);

  const [employeeData, setEmployeeData] = useState<Employee>({
    name: '',
    status: true,
    role: '',
    info: '',
    photo_binary: '',
  });

  const [editedData, setEditedData] = useState<Employee>({
    name: '',
    status: true,
    role: '',
    info: '',
    photo_binary: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUserLoggedIn || auth.role !== 'Admin') {
      navigateTo('/RIP_front/login');
    } else {
    
    const fetchEmployeeData = async () => {
      try {
        if (id) {
          const response = await axios.get(`/api/employees/photo/${id}/`);
          setEmployeeData(response.data);
          setEditedData(response.data);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();

    return () => {
      // Cleanup code (if needed)
    };}
  }, [id, auth.isAuthenticated, auth.role, navigateTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveChanges = async (isCreate: boolean) => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('photo_binary', selectedFile);
      }

      formData.append('name', editedData.name);
      formData.append('role', editedData.role);
      formData.append('info', editedData.info);
      formData.append('status', String(true));


      const requestConfig = {
        withCredentials: true,
      };

      const response = isCreate
        ? await axios.post(`/api/employees/post/`, formData, requestConfig)
        : await axios.put(`/api/employees/${id ? id + '/' : ''}put_photo/`, formData, requestConfig);

      const updatedData = response.data;
      setEmployeeData(updatedData);

      navigateTo(`/RIP_front/moderator/employees/`);
    } catch (error) {
      console.error('Error updating/creating employee data:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumbs items={breadcrumbsItems} />
            <div className="card">
              <img
                src={(employeeData.photo_binary !== null) ? `data:image/jpeg;base64,${employeeData.photo_binary}` : logoImage}
                alt={employeeData.name}
                className="card-img-top"
              />
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
                      value={editedData.name}
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
                      value={editedData.info}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Должность
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="role"
                      name="role"
                      value={editedData.role}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="photo" className="form-label">
                      Обновить фото
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
                    </div>
                  </div>
                  {id ? (
                    <button type="button" className="btn btn-primary" onClick={() => handleSaveChanges(false)}>
                      Сохранить изменения
                    </button>
                  ) : (
                    <button type="button" className="btn btn-primary" onClick={() => handleSaveChanges(true)}>
                      Создать сотрудника
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorEmployeesChangePage;
