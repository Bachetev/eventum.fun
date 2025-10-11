import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
export default function GuestDashboard(){
  return <div className="card">
    <div className="card-title">Гостевой кабинет</div>
    <div className="card-body">
      <p><Link to={ROUTES.GUEST_TIMING}>Расписание</Link></p>
      <p><Link to={ROUTES.GUEST_ACTIVITIES}>Активности</Link></p>
      <p><Link to={ROUTES.GUEST_VOTING}>Голосования</Link></p>
      <p><Link to={ROUTES.GUEST_PRIVILEGES}>Привилегии</Link></p>
    </div>
  </div>;
}
