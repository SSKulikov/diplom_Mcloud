import "./Header.scss";
import logo from "../../assets/logo.png";
import cloudy from "../../assets/cloudy.png";
import DropMenu from "./DropMenu/DropMenu";
import avatarUnknown from "../../assets/avatar_unknown.png";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { setDropMenuHeader, startAuthorization } from "../../redux/MainSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const isLogin = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="header">
      <img
        className="header-logo"
        src={logo}
        onClick={() => {
          dispatch(setDropMenuHeader("Каталог"));
          navigate("/");
        }}
      ></img>
      <img src={cloudy} className="cloud1"></img>
      <img src={cloudy} className="cloud2"></img>
      <img src={cloudy} className="cloud3"></img>
      <div className="header__menu">
        <div>
          <img
            className="avatar"
            src={avatarUnknown}
            style={
              isLogin
                ? { backgroundColor: "green" }
                : { backgroundColor: "red" }
            }
          ></img>
        </div>
        <div className="page">
          {isLogin !== null ? (
            <DropMenu />
          ) : (
            <div
              className="header__login"
              onClick={() => {
                dispatch(startAuthorization());
              }}
            >
              Войти
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
