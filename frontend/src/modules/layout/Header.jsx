import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Globe2, User as UserIcon, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { thLogout } from "../../app/store/slices/authSlice";
import LanguageSwitch from "./LanguageSwitch";
import ProfileIcon from "./ProfileIcon";
import "./styles/Header.css";

export default function Header() {
  const { t } = useTranslation();
  const { user, role } = useSelector(s=>s.auth);
  const dispatch = useDispatch();

  return (
    <header className="hdr enter-fade">
      <div className="hdr__left">
        <Link to="/" className="hdr__brand">{t("brand")}</Link>
      </div>

      <div className="hdr__right">
        <LanguageSwitch icon={<Globe2 size={18}/>}/>
        <ProfileIcon
          isAuthed={!!user}
          role={role}
          onLogout={() => dispatch(thLogout())}
          loginIcon={<LogIn size={18}/>}
          userIcon={<UserIcon size={18}/>}
        />
      </div>
    </header>
  );
}
