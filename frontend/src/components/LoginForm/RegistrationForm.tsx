import { useEffect, useState } from "react";
import "./RegistrationForm.scss";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import {
  endAuthorization,
  getSuccessRegistration,
  registration,
} from "../../redux/MainSlice";
import {
  validateEmail,
  validateLogin,
  validatePassword,
} from "../../utils/validators";
import ErrorMessage from "../Messages/ErrorMessage";

type Props = { onLogin: React.Dispatch<React.SetStateAction<boolean>> };

export default function RegistrationForm({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const errorMessage = useAppSelector((state) => state.error);
  const success = useAppSelector((state) => state.success.registration);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (success) {
      onLogin(false);
      setUsername("");
      setPassword("");
      dispatch(getSuccessRegistration(false));
    }
  }, [success, dispatch, onLogin]);

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      {errorMessage && <ErrorMessage message={errorMessage.message} />}
      <h2>Регистрация</h2>
      <label>
        Username:
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </label>
      <br />
      <label>
        Иня:
        <input
          type="text"
          id="first_name"
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <br />
      <label>
        Фамилия:
        <input
          type="text"
          id="last_name"
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </label>
      <br />
      <div className="login-form__btns">
        <button type="submit">Регистрация</button>
        <button className="cancel" onClick={handleCancel}>
          Отмена
        </button>
      </div>
      <span>
        Если у вас уже есть аккаунт вы можете{" "}
        <b onClick={() => onLogin(false)}>Авторизоваться</b>
      </span>
    </form>
  );

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.setCustomValidity("");
    setUsername(e.target.value);
  }
  function handleFirstNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(e.target.value);
  }
  function handleLastNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLastName(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.setCustomValidity("");
    setPassword(e.target.value);
  }
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.setCustomValidity("");
    setEmail(e.target.value);
  }
  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch(endAuthorization());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // console.log("Username:", username);
    // console.log("Password:", password);
    let check = true;
    const target = e.target as HTMLFormElement;
    try {
      validateLogin(username);
    } catch (error) {
      target.username.setCustomValidity((error as Error).message);
      target.username.reportValidity();
      check = false;
    }
    try {
      validatePassword(password);
    } catch (error) {
      target.password.setCustomValidity((error as Error).message);
      target.password.reportValidity();
      check = false;
    }
    try {
      validateEmail(email);
    } catch (error) {
      target.email.setCustomValidity((error as Error).message);
      target.email.reportValidity();
      check = false;
    }

    if (check) {
      dispatch(
        registration({ username, password, email, firstName, lastName })
      );
    }
  }
}
