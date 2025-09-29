export interface Project {
  _id: string;
  title: string;
  description: string;
  status?: string;
  createdAt?:string;
  updatedAt?:string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status?: string;
  dueDate?: string; 
}

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type StoredUser = {
  name:string;
  email:string; 
}
