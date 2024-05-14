import { useState } from "react";
import "./LoginForm.scss";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { endAuthorization, getToken } from "../../redux/MainSlice";
import ErrorMessage from "../Messages/ErrorMessage";
import SuccessMessage from "../Messages/SuccessMessage";

type Props = { onLogin: React.Dispatch<React.SetStateAction<boolean>> };

export default function LoginForm({ onLogin }: Props) {
  const infoMessage = useAppSelector((state) => state.infoMessage);
  const errorMessage = useAppSelector((state) => state.error);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {infoMessage && <SuccessMessage message={infoMessage} />}

      {errorMessage && <ErrorMessage message={errorMessage.message} />}
      <h2>Авторизация</h2>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </label>
      <br />
      <div className="login-form__btns">
        <button type="submit">Войти</button>
        <button className="cancel" onClick={handleCancel}>
          Отмена
        </button>
      </div>
      <span>
        Если у вас нет аккаунта вы можете{" "}
        <b
          onClick={() => {
            onLogin(true);
          }}
        >
          Зарегистрироваться
        </b>
      </span>
    </form>
  );

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }
  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch(endAuthorization());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // console.log("Username:", username);
    // console.log("Password:", password);

    dispatch(getToken({ username, password }));

    setUsername("");
    setPassword("");
  }
}
