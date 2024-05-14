import {
  Action,
  createAction,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { File_data, ChangeUser, RegistrationData } from "../models/models";
import { User } from "../models/models";

interface InitialStateType {
  loading: {
    login: boolean;
    catalog: boolean;
    profile: boolean;
    adminUsers: boolean;
    adminUserData: boolean;
    adminFilesChange: boolean;
    sendChange: boolean;
    delFile: boolean;
  };
  error: { status: string; message: string } | null;
  infoMessage: string | null;
  success: {
    registration: boolean;
  };
  errorsGet: {
    catalog: { status: string; message: string; action: Action } | null;
    profile: { status: string; message: string; action: Action } | null;
    adminUsers: { status: string; message: string; action: Action } | null;
    adminUserData: { status: string; message: string; action: Action } | null;
  };
  token: string | null;
  files: File_data[];
  lastDropOn: number | null;
  authorization: boolean;
  isSendFile: boolean;
  isChangeFile: {
    name?: string;
    description?: string;
    id?: string;
    isActive: boolean;
  };
  isShareFile: {
    isShare: boolean;
    uuid?: string;
  };
  user: User | null;
  adminPanel: {
    users: User[] | null;
    currentUser: User | null;
  };
  dropMenuHeader: string | null;
}

const initialState: InitialStateType = {
  loading: {
    login: false,
    catalog: false,
    profile: false,
    adminUsers: false,
    adminUserData: false,
    adminFilesChange: false,
    sendChange: false,
    delFile: false,
  },
  error: null,
  infoMessage: null,
  success: {
    registration: false,
  },
  errorsGet: {
    catalog: null,
    profile: null,
    adminUsers: null,
    adminUserData: null,
  },
  token: null,
  files: [],
  lastDropOn: null,
  isSendFile: false,
  isChangeFile: { isActive: false },
  isShareFile: { isShare: false },
  user: null,
  adminPanel: {
    users: null,
    currentUser: null,
  },
  authorization: false,
  dropMenuHeader: null,
};

const MainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    startAuthorization(state) {
      state.authorization = true;
    },
    endAuthorization(state) {
      state.authorization = false;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.adminPanel.users = null;
      state.adminPanel.currentUser = null;
      state.files = [];
    },
    getSuccessToken(state, action) {
      state.token = action.payload.token;
      state.loading.login = false;
    },
    clearUserToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
    getSuccessRegistration(state, action) {
      state.success.registration = action.payload;
    },

    setLoginLoading(state, action) {
      state.loading.login = action.payload;
      state.success.registration = false;
    },
    setProfileLoading(state, action) {
      state.loading.profile = action.payload;
    },
    setCatalogLoading(state, action) {
      state.loading.catalog = action.payload;
    },
    setAdminUsersLoading(state, action) {
      state.loading.adminUsers = action.payload;
    },
    setAdminUserDataLoading(state, action) {
      state.loading.adminUserData = action.payload;
    },
    setSendChangeLoading(state, action) {
      state.loading.sendChange = action.payload;
    },
    setAdminFileChangeLoading(state, action) {
      state.loading.adminFilesChange = action.payload;
    },
    setDelFileLoading(state, action) {
      state.loading.delFile = action.payload;
    },

    getSuccessUserDetail(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading.profile = false;
    },
    getSuccessUser(state, action: PayloadAction<User | null>) {
      state.adminPanel.currentUser = action.payload;
      state.loading.adminUserData = false;
    },
    clearCurrentUser(state) {
      state.adminPanel.currentUser = null;
    },
    getSuccessUsers(state, action: PayloadAction<User[]>) {
      state.adminPanel.users = action.payload;
      state.loading.adminUsers = false;
      state.errorsGet.adminUsers = null;
    },

    setErrorState(state, action) {
      state.error = action.payload;
      state.success.registration = false;
    },
    setCatalogError(state, action) {
      state.errorsGet.catalog = action.payload;
    },
    setAdminUsersError(state, action) {
      state.errorsGet.adminUsers = action.payload;
    },
    setProfileError(state, action) {
      state.errorsGet.profile = action.payload;
    },
    setAdminUserDataError(state, action) {
      state.errorsGet.adminUserData = action.payload;
    },

    getSuccessFiles(state, action: PayloadAction<File_data[]>) {
      state.files = [...action.payload];
      state.loading.catalog = false;
    },
    setDropMenuHeader(state, action: PayloadAction<string>) {
      state.dropMenuHeader = action.payload;
    },
    setLastDropOn(state, action) {
      state.lastDropOn = action.payload;
    },
    setIsSendFile(state) {
      state.isSendFile = !state.isSendFile;
    },
    setIsShareFile(state, action: PayloadAction<string>) {
      state.isShareFile.isShare = !state.isShareFile.isShare;
      if (action.payload) {
        state.isShareFile.uuid = action.payload;
      }
    },
    setInfoMessage(state, action: PayloadAction<string | null>) {
      state.infoMessage = action.payload;
    },
    setIsChangeFile(
      state,
      action: PayloadAction<{
        name?: string;
        description?: string;
        id?: string;
      }>
    ) {
      state.isChangeFile.isActive = !state.isChangeFile.isActive;
      if (action.payload) {
        state.isChangeFile.name = action.payload.name;
        state.isChangeFile.description = action.payload.description;
        state.isChangeFile.id = action.payload.id;
      }
    },
  },
});

export const GET_TOKEN = "main/getToken";
export const getToken = createAction<{
  username: string;
  password: string;
}>(GET_TOKEN);
export const REGISTRATION = "main/registration";
export const registration = createAction<RegistrationData>(REGISTRATION);
export const GET_USERS = "main/getUsers";
export const get_users = createAction(GET_USERS);
export const GET_FILES = "main/getFiles";
export const get_files = createAction(GET_FILES);
export const DEL_FILES = "main/delFiles";
export const del_files = createAction<string | number>(DEL_FILES);
export const SEND_FILE = "main/sendFile";
export const send_file = createAction<{
  name: string;
  description: string;
  file: File;
}>(SEND_FILE);
export const UPDATE_FILE = "main/updateFile";
export const update_file = createAction<{
  name: string;
  description: string;
}>(UPDATE_FILE);
export const GET_USER_DETAIL = "main/getUserDetail";
export const get_user_detail = createAction(GET_USER_DETAIL);
export const DELETE_USER = "main/delUser";
export const del_user = createAction<number>(DELETE_USER);
export const UPDATE_USER = "main/updateUser";
export const update_user = createAction<{ body: ChangeUser; id: number }>(
  UPDATE_USER
);
export const GET_USER_DATA = "main/getUserData";
export const get_user_data = createAction<number>(GET_USER_DATA);

export const {
  startAuthorization,
  endAuthorization,
  logout,
  clearUserToken,
  getSuccessToken,
  getSuccessRegistration,

  setLoginLoading,
  setProfileLoading,
  setCatalogLoading,
  setAdminUsersLoading,
  setAdminUserDataLoading,
  setAdminFileChangeLoading,
  setSendChangeLoading,
  setDelFileLoading,

  getSuccessUserDetail,
  getSuccessUser,
  getSuccessUsers,
  clearCurrentUser,

  setErrorState,
  setCatalogError,
  setProfileError,
  setAdminUsersError,
  setAdminUserDataError,

  getSuccessFiles,
  setIsSendFile,
  setIsChangeFile,
  setIsShareFile,
  setLastDropOn,
  setDropMenuHeader,
  setInfoMessage,
} = MainSlice.actions;

export default MainSlice.reducer;
