import {
  Action,
  ActionCreatorWithPayload,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  DELETE_USER,
  DEL_FILES,
  GET_FILES,
  GET_TOKEN,
  GET_USERS,
  GET_USER_DATA,
  GET_USER_DETAIL,
  REGISTRATION,
  SEND_FILE,
  UPDATE_FILE,
  UPDATE_USER,
  clearCurrentUser,
  endAuthorization,
  setAdminUserDataLoading,
  setAdminUsersLoading,
  setLoginLoading,
  setProfileLoading,
  getSuccessFiles,
  getSuccessToken,
  getSuccessUser,
  getSuccessUserDetail,
  getSuccessUsers,
  get_user_data,
  get_users,
  setIsChangeFile,
  setIsSendFile,
  setErrorState,
  setCatalogError,
  setProfileError,
  setCatalogLoading,
  setAdminUsersError,
  setAdminUserDataError,
  getSuccessRegistration,
  setSendChangeLoading,
  setDelFileLoading,
  setInfoMessage,
  setAdminFileChangeLoading,
  get_user_detail,
  get_files,
} from "./MainSlice";
import { call, delay, put, select, takeEvery } from "redux-saga/effects";
import { AxiosError, AxiosResponse } from "axios";
import {
  getUserApi,
  updateUserApi,
  addFileApi,
  deleteFileApi,
  getFilesApi,
  getUserDetailApi,
  getUsersApi,
  loginApi,
  registrationApi,
  updateFileApi,
  delUserApi,
} from "../utils/api";
import { File_data, ChangeUser, RegistrationData } from "../models/models";
import { User } from "../models/models";

export function* getTokenSaga(
  action: PayloadAction<{ username: string; password: string }>
) {
  yield put(setLoginLoading(true));
  try {
    const response: { token: string } = yield loginApi(
      action.payload.username,
      action.payload.password
    );

    yield put(getSuccessToken(response));
    yield put(endAuthorization());
    yield put(get_user_detail());

    if (response.token) {
      localStorage.setItem("token", JSON.stringify(response.token));
    }
  } catch (error) {
    yield put(setLoginLoading(false));
    yield call(showErrorMessage, error as AxiosError);
  }
}
export function* registrationSaga(action: PayloadAction<RegistrationData>) {
  const { username, password, email, firstName, lastName } = action.payload;

  yield put(setLoginLoading(true));
  try {
    const response: AxiosResponse = yield registrationApi(
      username,
      password,
      email,
      firstName,
      lastName
    );

    if (response.status >= 200 && response.status < 300) {
      yield put(getSuccessRegistration(true));
      yield call(showMessage, "Успешно зарегистрирован");
    }
  } catch (error) {
    yield call(showErrorMessage, error as AxiosError);
    yield put(setLoginLoading(false));
  }
}

export function* getFilesSaga(action: Action) {
  const token: string | null = yield select((store) => store.token);

  yield put(setCatalogError(null));

  if (token) {
    yield put(setCatalogLoading(true));
    try {
      const response: File_data[] = yield getFilesApi(token);
      yield put(getSuccessFiles(response));
    } catch (error) {
      yield call(setError, error as AxiosError, setCatalogError, action);
      yield put(setCatalogLoading(false));
    }
  } else {
    yield put(getSuccessFiles([]));
  }
}
export function* sendFileSaga(
  action: PayloadAction<{
    name: string;
    description: string;
    file: File;
  }>
) {
  const token: string | null = yield select((store) => store.token);

  if (token) {
    try {
      const response: AxiosResponse = yield addFileApi(token, action.payload);

      if (response.status === 201) {
        yield put(get_files());
        yield put(setIsSendFile());
        yield call(showMessage, "Успешно добавлен");
      }
    } catch (error) {
      yield call(showErrorMessage, error as AxiosError);
    }
  }
}
export function* updateFileSaga(
  action: PayloadAction<{ name?: string; description?: string }>
) {
  const token: string | null = yield select((store) => store.token);

  if (token) {
    const fileChangeInfo: {
      name?: string;
      description?: string;
      id?: string;
      isActive: boolean;
    } = yield select((store) => store.isChangeFile);
    const currentUser: User | null = yield select(
      (store) => store.adminPanel.currentUser
    );

    yield put(setAdminFileChangeLoading(true));

    try {
      const response: AxiosResponse = yield updateFileApi(
        token,
        String(fileChangeInfo.id),
        action.payload
      );
      if (response.status === 200) {
        yield put(get_files());
        yield put(setIsChangeFile({}));
        yield call(showMessage, "Файл изменен");

        if (currentUser) {
          yield put(get_user_data(currentUser.id));
        }
      }
    } catch (error) {
      yield call(showErrorMessage, error as AxiosError);
    }
  }
}
export function* delFilesSaga(action: PayloadAction<string | number>) {
  const token: string | null = yield select((store) => store.token);
  const currentUser: User = yield select(
    (store) => store.adminPanel.currentUser
  );

  if (token) {
    yield put(setDelFileLoading(true));
    yield put(setAdminFileChangeLoading(true));
    try {
      const response: AxiosResponse = yield deleteFileApi(
        token,
        action.payload
      );
      if (response.status === 204) {
        yield put(setDelFileLoading(false));
        yield put(get_files());

        yield call(showMessage, "Файл удален");

        if (currentUser) {
          yield put(get_user_data(currentUser.id));
        }
      }
    } catch (error) {
      yield put(setDelFileLoading(false));
      yield call(showErrorMessage, error as AxiosError);
    }
  }
}

export function* getUsersSaga(action: Action) {
  const token: string | null = yield select((store) => store.token);

  yield put(setAdminUsersError(null));
  yield put(setAdminUsersLoading(true));

  if (token) {
    try {
      const response: User[] = yield getUsersApi(token);

      yield put(getSuccessUsers(response));
    } catch (error) {
      yield call(setError, error as AxiosError, setAdminUsersError, action);
      yield put(setAdminUsersLoading(false));
    }
  }
}
export function* getUserDetailForTokenSaga(action: Action) {
  const token: string | null = yield select((store) => store.token);

  yield put(setProfileError(null));
  yield put(setProfileLoading(true));
  if (token) {
    try {
      const response: User[] = yield getUserDetailApi(token);

      yield put(getSuccessUserDetail(response[0]));
    } catch (error) {
      yield call(setError, error as AxiosError, setProfileError, action);
      yield put(setProfileLoading(false));
    }
  }
}
export function* getUserSaga(action: PayloadAction<string | number>) {
  const token: string | null = yield select((store) => store.token);

  yield put(setAdminUserDataLoading(true));
  yield put(setAdminUserDataError(null));

  if (token) {
    try {
      const response: User = yield getUserApi(token, action.payload);

      yield put(getSuccessUser(response));
      yield put(setAdminFileChangeLoading(false));
    } catch (error) {
      yield call(setError, error as AxiosError, setAdminUserDataError, action);
      yield put(getSuccessUser(null));

      yield put(setAdminUserDataLoading(false));
    }
  }
}
export function* updateUserSaga(
  action: PayloadAction<{ body: ChangeUser; id: number }>
) {
  const token: string | null = yield select((store) => store.token);
  const { body, id } = action.payload;

  yield put(setSendChangeLoading(true));

  if (token && body) {
    try {
      const response: AxiosResponse = yield updateUserApi(token, body, id);
      if (response.status >= 200 && response.status < 300) {
        yield put(setSendChangeLoading(false));
        yield call(showMessage, "Данные изменены");
      }
    } catch (error) {
      yield put(setSendChangeLoading(false));
      yield call(showErrorMessage, error as AxiosError);
    }
  }
}
export function* delUserSaga(action: PayloadAction<number>) {
  const token: string | null = yield select((store) => store.token);

  const id = action.payload;

  if (token) {
    try {
      const response: AxiosResponse = yield delUserApi(token, id);

      if (response.status > 200 && response.status < 300) {
        yield put(get_users());
        yield put(clearCurrentUser());
        yield call(showMessage, "Пользователь удален");
      }
    } catch (error) {
      yield call(showErrorMessage, error as AxiosError);
    }
  }
}

export function* mainSaga() {
  yield takeEvery(GET_TOKEN, getTokenSaga);
  yield takeEvery(REGISTRATION, registrationSaga);
  yield takeEvery(GET_FILES, getFilesSaga);
  yield takeEvery(DEL_FILES, delFilesSaga);
  yield takeEvery(SEND_FILE, sendFileSaga);
  yield takeEvery(UPDATE_FILE, updateFileSaga);
  yield takeEvery(GET_USERS, getUsersSaga);
  yield takeEvery(GET_USER_DETAIL, getUserDetailForTokenSaga);
  yield takeEvery(UPDATE_USER, updateUserSaga);
  yield takeEvery(GET_USER_DATA, getUserSaga);
  yield takeEvery(DELETE_USER, delUserSaga);
}

function* showError(myError: { status: string; message: string }) {
  yield put(setErrorState(myError));
  yield delay(5 * 1000);
  yield put(setErrorState(null));
}
function* showMessage(message: string) {
  yield put(setInfoMessage(message));
  yield delay(5 * 1000);
  yield put(setInfoMessage(null));
}

function* showErrorMessage(error: AxiosError) {
  if (error.code === "ERR_NETWORK") {
    yield call(showError, {
      status: "0",
      message: "Сервер не работает, попробуйте позже",
    });
  }
  if (error.response?.data && error.code !== "ERR_NETWORK") {
    const errorData = {
      status: String(error?.response?.status),
      message: String(Object.values(error.response?.data)[0]),
    };
    yield call(showError, errorData);
  }
}

function* setError(
  error: AxiosError,
  setErrorFunc: ActionCreatorWithPayload<object, string>,
  action: Action
) {
  if (error.code === "ERR_NETWORK") {
    yield put(
      setErrorFunc({
        status: "0",
        message: "Сервер не работает, попробуйте позже",
        action: action,
      })
    );
  }
  if (error.response?.data && error.code !== "ERR_NETWORK") {
    const errorData = {
      status: error?.response?.status,
      message: Object.values(error.response?.data)[0],
      action: action,
    };

    yield put(setErrorFunc(errorData));
  }
}
