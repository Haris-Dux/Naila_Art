
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUserAsync } from '../features/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  withCredentials:true
});


axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {

      console.log('Unauthorized - Logging out');
      const dispatch = useDispatch();
      const navigate = useNavigate();

     
      dispatch(logoutUserAsync());

      navigate('/login');

      return Promise.reject(error); 
    }

    return Promise.reject(error); 
  }
);

export default axiosInstance;
