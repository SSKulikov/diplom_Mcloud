import axios from "axios";
import { ChangeUser } from "../models/models";

const connect = axios.create({
  baseURL: import.meta.env.VITE_HOST || "http://localhost:8000/",
});

//login or get token
export const loginApi = (username: string, password: string) => {
  return connect
    .post("api-token-auth/", { username, password })
    .then((response) => response.data);
};

//Registration user
export const registrationApi = (
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  return connect.post("api/users/", {
    username,
    password,
    email,
    first_name: firstName,
    last_name: lastName,
  });
};

//Get users
export const getUsersApi = (token: string) => {
  return connect
    .get("api/users/", { headers: { Authorization: "token " + token } })
    .then((response) => response.data);
};
//Get user detail
export const getUserDetailApi = (token: string) => {
  return connect
    .get("api/users/detail", { headers: { Authorization: "token " + token } })
    .then((response) => response.data);
};

//Get user
export const getUserApi = (token: string, id: number | string) => {
  return connect
    .get(`api/users/${id}/`, {
      headers: { Authorization: "token " + token },
    })
    .then((response) => response.data);
};

//Del user
export const delUserApi = (token: string, id: number) => {
  return connect.delete(`api/users/${id}/`, {
    headers: { Authorization: "token " + token },
  });
};
//Update user
export const updateUserApi = (token: string, body: ChangeUser, id: number) => {
  return connect.patch(`api/users/${id}/`, body, {
    headers: { Authorization: "token " + token },
  });
};
//Get files
export const getFilesApi = (token: string) => {
  return connect
    .get("api/files/", { headers: { Authorization: "token " + token } })
    .then((response) => response.data);
};
//Add file
export const addFileApi = (
  token: string,
  body: { name: string; description?: string; file: File }
) => {
  const formData = new FormData();
  formData.append("name", body.name);
  body.description && formData.append("description", body.description);
  formData.append("file", body.file);

  return connect.post(`api/files/`, formData, {
    headers: {
      Authorization: "token " + token,
      "content-type": "multipart/form-data",
    },
  });
};
//Delete file
export const deleteFileApi = (token: string, fileId: string | number) => {
  return connect.delete(`api/files/${fileId}/`, {
    headers: { Authorization: "token " + token },
  });
};
//Update file
export const updateFileApi = (
  token: string,
  fileId: string | number,
  body: { name?: string; description?: string }
) => {
  return connect.patch(`api/files/${fileId}/`, body, {
    headers: { Authorization: "token " + token },
  });
};
