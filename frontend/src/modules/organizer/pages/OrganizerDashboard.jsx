import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
export default function OrganizerDashboard(){
  return <div className="card">
    <div className="card-title">Панель организатора</div>
    <div className="card-body">
      <p><Link to={ROUTES.ORG_EVENTS}>События</Link></p>
      <p><Link to={ROUTES.ORG_ACTIVITIES}>Активности</Link></p>
      <p><Link to={ROUTES.ORG_PLANS}>Планы</Link></p>
      <p><Link to={ROUTES.ORG_STAFF}>Персонал</Link></p>
      <p><Link to={ROUTES.ORG_SETTINGS}>Настройки</Link></p>
    </div>
  </div>;
}
