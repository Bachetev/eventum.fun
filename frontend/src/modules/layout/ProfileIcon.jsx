import { useNavigate } from "react-router-dom";
import "./styles/ProfileIcon.css";

export default function ProfileIcon({ isAuthed, role, onLogout, loginIcon, userIcon }) {
  const nav = useNavigate();

  const goLogin = () => {
    const ts = Date.now();             // уникальный параметр, чтобы роутер отреагировал всегда
    nav(`/login?m=${ts}`);
  };

  if (!isAuthed) {
    return (
      <button
        className="prof"
        onClick={goLogin}
        title="Войти"
        aria-label="Войти"
      >
        {loginIcon}
      </button>
    );
  }

  return (
    <div className="prof prof--authed" title={role || "User"}>
      {userIcon}
      <div className="prof__menu">
        <button className="prof__item" onClick={()=>nav("/profile")}>Профиль</button>
        <button className="prof__item" onClick={onLogout}>Выйти</button>
      </div>
    </div>
  );
}
