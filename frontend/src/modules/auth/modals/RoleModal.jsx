import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { thGuestJoin, thLoginOrganizer } from "../../../app/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Hash, Phone, KeyRound } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import GlassButton from "../../../shared/ui/GlassButton";
import GlassInput from "../../../shared/ui/GlassInput";
import "./styles/RoleModal.css";

const STEP_MS = 220;

export default function RoleModal({ open=true, onClose }) {
  const { t } = useTranslation();
  const [step, setStep] = useState("choose");       // целевой шаг
  const [renderStep, setRenderStep] = useState("choose"); // видимый на экране
  const [leaving, setLeaving] = useState(false);

  const [joinCode, setJoinCode] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const nav = useNavigate();

  // Плавный переход: сначала уходим со старого шага, затем подменяем контент
  const goStep = (next) => {
    if (renderStep === next) return;
    setLeaving(true);
    setTimeout(() => {
      setRenderStep(next);
      setLeaving(false);
    }, STEP_MS);
    setStep(next);
  };

  const toChoose = () => goStep("choose");
  const chooseGuest = () => goStep("guest_code");
  const chooseOrg   = () => goStep("org");

  const nextGuestFromCode = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    goStep("guest_name");
  };

  const loginGuest = async (e) => {
    e.preventDefault();
    try { await dispatch(thGuestJoin({ join_code: joinCode.trim() })).unwrap(); onClose?.(); nav("/guest"); } catch {}
  };

  const loginOrganizer = async (e) => {
    e.preventDefault();
    try { await dispatch(thLoginOrganizer({ email: phone.trim(), password })).unwrap(); onClose?.(); nav("/org"); } catch {}
  };

  // Сбрасываем промежуточные состояния при открытии заново
  useEffect(() => {
    if (open) { setStep("choose"); setRenderStep("choose"); setLeaving(false); }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} width={640}>
      <div className="rm__wrap">
        {/* Шаг: КТО ВЫ */}
        <div className={[
          "rm__view",
          renderStep === "choose" ? "rm__view--active" : "rm__view--hidden",
          leaving && step !== "choose" && renderStep === "choose" ? "rm__view--leave" : ""
        ].join(" ")}>
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

        {/* Шаг: ГОСТЬ  код */}
        <form
          className={[
            "rm__view rm__form",
            renderStep === "guest_code" ? "rm__view--active" : "rm__view--hidden",
            leaving && step !== "guest_code" && renderStep === "guest_code" ? "rm__view--leave" : ""
          ].join(" ")}
          onSubmit={nextGuestFromCode}
        >
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
            <GlassButton variant="ghost" onClick={toChoose} type="button">Отмена</GlassButton>
            <GlassButton variant="primary" type="submit">{t("modal.continue")}</GlassButton>
          </div>
        </form>

        {/* Шаг: ГОСТЬ  имя */}
        <form
          className={[
            "rm__view rm__form",
            renderStep === "guest_name" ? "rm__view--active" : "rm__view--hidden",
            leaving && step !== "guest_name" && renderStep === "guest_name" ? "rm__view--leave" : ""
          ].join(" ")}
          onSubmit={loginGuest}
        >
          <GlassInput
            label={t("modal.username")}
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            placeholder="Иван"
            required
            icon={<User size={18}/>}
          />
          <div className="rm__actions">
            <GlassButton variant="ghost" onClick={toChoose} type="button">Отмена</GlassButton>
            <GlassButton variant="primary" type="submit">{t("modal.signIn")}</GlassButton>
          </div>
        </form>

        {/* Шаг: ОРГАНИЗАТОР */}
        <form
          className={[
            "rm__view rm__form",
            renderStep === "org" ? "rm__view--active" : "rm__view--hidden",
            leaving && step !== "org" && renderStep === "org" ? "rm__view--leave" : ""
          ].join(" ")}
          onSubmit={loginOrganizer}
        >
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
            <GlassButton variant="ghost" onClick={toChoose} type="button">Отмена</GlassButton>
            <GlassButton variant="primary" type="submit">{t("modal.signIn")}</GlassButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}
