
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUserAsync } from '../features/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  withCredentials:true
});

// Axios interceptor for response
axiosInstance.interceptors.response.use(
  (response) => response, // If response is successful, return it
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 errors (unauthorized)
      console.log('Unauthorized - Logging out');
      const dispatch = useDispatch();
      const navigate = useNavigate();

      // Dispatch logout action
      dispatch(logoutUserAsync());

      // Optionally, redirect to login page
      navigate('/login');

      return Promise.reject(error); // Reject the promise to stop further execution
    }

    return Promise.reject(error); // If not 401, reject the error
  }
);

export default axiosInstance;
