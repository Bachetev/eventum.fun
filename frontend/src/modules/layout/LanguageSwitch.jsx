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
    const body = document.body;

    // Включаем плавную анимацию на всём интерфейсе (включая модалки)
    html.classList.add("lang-anim");
    setAnim(true);
    // Блокируем клики на короткое время  меньше шанса артефактов
    body.style.pointerEvents = "none";

    // Даем движку применить стили (layout flush)
    requestAnimationFrame(() => {
      setTimeout(() => {
        i18n.changeLanguage(next.toLowerCase());
        // Держим пост-анимацию и потом чистим классы/разблокируем клики
        setTimeout(() => {
          html.classList.remove("lang-anim");
          setAnim(false);
          body.style.pointerEvents = "";
        }, 340);
      }, 80); // короткий pre-fade перед сменой текста
    });
  }, [i18n, next]);

  return (
    <button className={`lang ${anim ? "lang--shine" : ""}`} title={next} onClick={smoothSwitch}>
      <span className="lang__icon">{icon}</span>
      <span className="lang__text"><span className="lang__swap">{cur}</span></span>
    </button>
  );
}
