
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5500/api/v1',  
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const extractErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response?.data.data;  
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to login"));
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response?.data.data;  
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to register"));
  }
};

export const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response?.data;
  } catch (error: unknown) {
  throw new Error(extractErrorMessage(error, "Failed to fetch projects"));  }
};


export const createProject = async (projectData: { title: string, description: string }) => {
  try {
    const response = await api.post('/projects', projectData);
    return response?.data;  
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to create project"));
  }
};

export const updateProject = async (projectId: string, projectData: { title: string, description: string }) => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response?.data;  
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to update project"));
  }
};


export const deleteProject = async (projectId: string) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response?.data;  
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to delete project"));
  }
};

 export const fetchTasks = async (projectId: string, page:number)  => {
  try {
    const response =  await api.get(`/projects/${projectId}/tasks?page=${page}`);
    return response?.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to fetch tasks"));
  }
 } 
 
export const createTask = async (projectId:string , taskData: { title: string, description: string }) => {
  try {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response?.data; 
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to create task"));
  }
};


export const updateTask = async (projectId: string, taskId: string, taskData: { title: string, description: string }) => {
  try {
    const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
    return response?.data;  
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to update task"));
  }
};

export const deleteTask = async (projectId: string, taskId : string) => {
  try {
    const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    return response?.data; 
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to delete task"));
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};