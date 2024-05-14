import { useEffect } from "react";
import "./AdminPanel.scss";
import UserCard from "./Items/UserItem";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { get_users } from "../../redux/MainSlice";
import FIleItemAdmin from "./Items/FIleItemAdmin";
import UserInfo from "./UserInfo";
import ChangeFileForm from "../Files/ChangeFileForm/ChangeFileForm";
import Louder from "../Louder/Louder";
import ErrorForm from "../Messages/ErrorForm";
import ErrorMessage from "../Messages/ErrorMessage";
import SuccessMessage from "../Messages/SuccessMessage";

export default function AdminPanel() {
  const errorUserData = useAppSelector(
    (state) => state.errorsGet.adminUserData
  );
  const error = useAppSelector((state) => state.error);
  const user = useAppSelector((state) => state.adminPanel.currentUser);
  const errorUsers = useAppSelector((state) => state.errorsGet.adminUsers);
  const infoMessage = useAppSelector((state) => state.infoMessage);
  const adminPanel = useAppSelector((state) => state.adminPanel);
  const isChangeFile = useAppSelector((state) => state.isChangeFile);
  const loading = useAppSelector((state) => state.loading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(get_users());
  }, [dispatch]);

  return (
    <div className="admin__wrapper">
      <div className="admin__users">
        {errorUsers && <ErrorForm data={errorUsers} />}
        <div>
          <h2>Пользователи: </h2>
          {adminPanel.users &&
            adminPanel.users.map((el) => <UserCard key={el.id} user={el} />)}
        </div>
      </div>
      <div className="admin__info">
        {errorUserData && <ErrorForm data={errorUserData} />}
        {loading.adminUserData ? <Louder /> : <UserInfo />}
        {infoMessage && !isChangeFile.isActive && (
          <SuccessMessage message={infoMessage} />
        )}

        {error && !isChangeFile.isActive && (
          <ErrorMessage message={error.message} />
        )}
        {loading.adminUserData ? null : (
          <div className="admin__files">
            {user && <h2>Список файлов:</h2>}
            {loading.adminFilesChange && <Louder />}
            {adminPanel.currentUser &&
              adminPanel.currentUser.files.map((file) => (
                <FIleItemAdmin key={file.id + file.name} data={file} />
              ))}
          </div>
        )}
      </div>
      {isChangeFile.isActive && (
        <ChangeFileForm
          name={isChangeFile.name!}
          desc={isChangeFile.description!}
        />
      )}
    </div>
  );
}
