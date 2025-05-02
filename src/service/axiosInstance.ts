import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  },
});

export const uploadInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json, text/plain, */*',
  },
});

const onRequest = (
  request: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const access = JSON.parse(sessionStorage.getItem('id') || 'null');
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  if (user) {
    request.headers.Authorization = `Bearer ${user?.accessToken}` || '';
  } else {
    request.headers.Authorization = `Bearer ${access?.accessToken}` || '';
  }
  return request;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  const statusCode = error?.response?.status;
  if (statusCode === 401) {
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  }
  return Promise.reject(error);
};

// Attach interceptors
axiosInstance.interceptors.request.use(onRequest, onRequestError);
axiosInstance.interceptors.response.use(onResponse, onResponseError);
uploadInstance.interceptors.request.use(onRequest, onRequestError);
uploadInstance.interceptors.response.use(onResponse, onResponseError);

export default axiosInstance;
