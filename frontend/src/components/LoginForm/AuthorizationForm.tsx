import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import "./AuthorizationForm.scss";
import { useNavigate } from "react-router-dom";

export default function AuthorizationForm() {
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="authorization__wrapper">
      {login ? (
        <RegistrationForm onLogin={setLogin} />
      ) : (
        <LoginForm onLogin={setLogin} />
      )}
    </div>
  );
}
