import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import FileList from "./components/Files/FIleList/FIleList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import AuthorizationForm from "./components/LoginForm/AuthorizationForm";
import { useAppDispatch, useAppSelector } from "./models/hooks";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import { useEffect } from "react";
import { get_user_detail, getSuccessToken } from "./redux/MainSlice";

function App() {
  const authorization = useAppSelector((state) => state.authorization);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getSuccessToken({ token: JSON.parse(token) }));
      dispatch(get_user_detail());
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Header />
      {authorization && <AuthorizationForm />}
      <Routes>
        <Route path="/" element={<FileList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-panel" element={<AdminPanel />} />y
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
