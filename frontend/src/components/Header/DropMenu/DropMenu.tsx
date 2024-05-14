import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import {
  clearUserToken,
  get_files,
  logout,
  setDropMenuHeader,
} from "../../../redux/MainSlice";

export default function DropMenu() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const dropMenuValue = useAppSelector((state) => state.dropMenuHeader);

  return (
    <select
      value={dropMenuValue ? dropMenuValue : "Каталог"}
      onChange={(el) => {
        DropMenuNav(el.target);
      }}
    >
      <option value="Каталог">Каталог</option>
      <option value="Личный кабинет">Личный кабинет</option>
      {user?.is_staff && <option value="Админ панель">Админ панель</option>}
      <option value="Выход">Выход</option>;
    </select>
  );

  function DropMenuNav(target: HTMLSelectElement) {
    const name = target.value;

    switch (name) {
      case "Каталог":
        navigate("/");
        dispatch(setDropMenuHeader("Каталог"));
        break;
      case "Личный кабинет":
        navigate("/profile");
        dispatch(setDropMenuHeader("Личный кабинет"));
        break;
      case "Админ панель":
        navigate("/admin-panel");
        dispatch(setDropMenuHeader("Админ панель"));
        break;
      case "Выход":
        dispatch(logout());
        dispatch(clearUserToken());
        dispatch(get_files());
        dispatch(setDropMenuHeader("Каталог"));

        navigate("/");
        break;
      default:
        break;
    }
  }
}
