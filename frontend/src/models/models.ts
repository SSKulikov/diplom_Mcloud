export interface File_data {
  created_at: string;
  description: string;
  file: string;
  id: number;
  name: string;
  size: number;
  user: number;
  linkUiid: string;
  download_counter: number;
  download_at: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  files: File_data[];
  date_joined: string;
}

export interface ChangeUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  is_staff?: boolean;
  password?: string;
}

export interface RegistrationData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}
