import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import "./styles/LanguageSwitch.css";

export default function LanguageSwitch({ icon }) {
  const { i18n } = useTranslation();
  const [anim, setAnim] = useState(false);
  const cur = i18n.language?.startsWith("en") ? "EN" : "RU";
  const next = cur === "RU" ? "EN" : "RU";

  const smoothSwitch = useCallback(() => {
    const html = document.documentElement;
    const modalOpen = html.classList.contains("modal-open");

    // Включаем shine в любом случае
    setAnim(true);

    // Вешаем корректный класс для плавного текста
    const cls = modalOpen ? "lang-anim-modal" : "lang-anim";
    html.classList.add(cls);

    setTimeout(() => {
      i18n.changeLanguage(next.toLowerCase());
      setTimeout(() => {
        html.classList.remove(cls);
        setAnim(false);
      }, 320);
    }, 80);
  }, [i18n, next]);

  return (
    <button
      className={`lang ${anim ? "lang--shine" : ""}`}
      title={next}
      onClick={smoothSwitch}
    >
      <span className="lang__icon">{icon}</span>
      <span className="lang__text"><span className="lang__swap">{cur}</span></span>
    </button>
  );
}
