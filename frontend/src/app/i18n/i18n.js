import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ru: { translation: {
    brand: "Eventum",
    nav: { guest: "Гость", org: "Организатор", login: "Войти" },
    header: { profile: "Профиль", logout: "Выйти", login: "Войти" },
    modal: {
      who: "Кто вы?",
      guest: "Гость",
      organizer: "Организатор",
      welcome: "Добро пожаловать в Eventum",
      eventCode: "Код события",
      username: "Имя пользователя",
      continue: "Далее",
      phone: "Телефон",
      password: "Пароль",
      signIn: "Войти"
    }
  }},
  en: { translation: {
    brand: "Eventum",
    nav: { guest: "Guest", org: "Organizer", login: "Login" },
    header: { profile: "Profile", logout: "Logout", login: "Login" },
    modal: {
      who: "Who are you?",
      guest: "Guest",
      organizer: "Organizer",
      welcome: "Welcome to Eventum",
      eventCode: "Event code",
      username: "Username",
      continue: "Next",
      phone: "Phone",
      password: "Password",
      signIn: "Sign in"
    }
  }}
};

i18n.use(initReactI18next).init({
  resources, lng: "ru", fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

export default i18n;
