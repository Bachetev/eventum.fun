import { useState } from "react";
import { useDispatch } from "react-redux";
import { thGuestJoin, thLoginOrganizer } from "../../../app/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Hash, Phone, KeyRound } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import GlassButton from "../../../shared/ui/GlassButton";
import GlassInput from "../../../shared/ui/GlassInput";
import "./styles/RoleModal.css";

export default function RoleModal({ open=true, onClose }) {
  const { t } = useTranslation();
  const [step, setStep] = useState("choose"); // choose | guest_code | guest_name | org
  const [joinCode, setJoinCode] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const setStepSmooth = (name) => {
    // лёгкий fade между блоками
    setStep((prev) => (prev === name ? prev : name));
  };

  const chooseGuest = () => setStepSmooth("guest_code");
  const chooseOrg = () => setStepSmooth("org");

  const nextGuestFromCode = (e) => { e.preventDefault(); if (!joinCode.trim()) return; setStepSmooth("guest_name"); };
  const loginGuest = async (e) => {
    e.preventDefault();
    try { await dispatch(thGuestJoin({ join_code: joinCode.trim() })).unwrap(); onClose?.(); nav("/guest"); } catch {}
  };
  const loginOrganizer = async (e) => {
    e.preventDefault();
    try { await dispatch(thLoginOrganizer({ email: phone.trim(), password })).unwrap(); onClose?.(); nav("/org"); } catch {}
  };

  return (
    <Modal open={open} onClose={onClose} width={640}>
      <div className="rm__wrap">
        {step === "choose" && (
          <div className="rm__step rm__step--enter">
            <h2 className="rm__title rm__title--center">{t("modal.who")}</h2>
            <div className="rm__grid2">
              <GlassButton variant="primary" onClick={chooseGuest} iconLeft={<User size={18}/>}>
                {t("modal.guest")}
              </GlassButton>
              <GlassButton onClick={chooseOrg} iconLeft={<User size={18}/>}>
                {t("modal.organizer")}
              </GlassButton>
            </div>
          </div>
        )}

        {step === "guest_code" && (
          <form className="rm__step rm__step--enter rm__form" onSubmit={nextGuestFromCode}>
            <h2 className="rm__welcome">{t("modal.welcome")}</h2>
            <GlassInput
              label={t("modal.eventCode")}
              value={joinCode}
              onChange={(e)=>setJoinCode(e.target.value)}
              placeholder="JOIN-XXXX"
              required
              icon={<Hash size={18}/>}
            />
            <div className="rm__actions">
              <GlassButton variant="primary">{t("modal.continue")}</GlassButton>
            </div>
          </form>
        )}

        {step === "guest_name" && (
          <form className="rm__step rm__step--enter rm__form" onSubmit={loginGuest}>
            <GlassInput
              label={t("modal.username")}
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="Иван"
              required
              icon={<User size={18}/>}
            />
            <div className="rm__actions">
              <GlassButton variant="primary">{t("modal.signIn")}</GlassButton>
            </div>
          </form>
        )}

        {step === "org" && (
          <form className="rm__step rm__step--enter rm__form" onSubmit={loginOrganizer}>
            <h2 className="rm__welcome">{t("modal.welcome")}</h2>
            <GlassInput
              label={t("modal.phone")}
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              placeholder="+7..."
              required
              icon={<Phone size={18}/>}
            />
            <GlassInput
              label={t("modal.password")}
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              icon={<KeyRound size={18}/>}
            />
            <div className="rm__actions">
              <GlassButton variant="primary">{t("modal.signIn")}</GlassButton>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
