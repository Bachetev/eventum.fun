import Header from "../modules/layout/Header";
import { Outlet } from "react-router-dom";
import "./../assets/styles/base.css";
import "./../assets/styles/typography.css";
import "./../assets/styles/animations.css";

export default function App() {
  return (
    <div className="app-root bg-waves">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
