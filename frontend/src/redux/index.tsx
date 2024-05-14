import { configureStore } from "@reduxjs/toolkit";
import MainSlice from "./MainSlice";
import createSagaMiddleware from "redux-saga";
import { mainSaga } from "./MainSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: MainSlice,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(mainSaga);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
