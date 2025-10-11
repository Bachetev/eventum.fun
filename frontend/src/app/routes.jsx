import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { ROUTES } from "../shared/constants/routes";
import RequireAuth from "../shared/guards/RequireAuth";

import Login from "../modules/auth/pages/Login";
import GuestDashboard from "../modules/guest/pages/GuestDashboard";
import Timing from "../modules/guest/pages/Timing";
import Activities from "../modules/guest/pages/Activities";
import Voting from "../modules/guest/pages/Voting";
import Privileges from "../modules/guest/pages/Privileges";

import OrganizerDashboard from "../modules/organizer/pages/OrganizerDashboard";
import Events from "../modules/organizer/pages/Events";
import OrgActivities from "../modules/organizer/pages/Activities";
import Plans from "../modules/organizer/pages/Plans";
import Settings from "../modules/organizer/pages/Settings";
import Staff from "../modules/organizer/pages/Staff";

const Home = () => <div />; // без плашек

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: ROUTES.LOGIN, element: <Login /> },

      { element: <RequireAuth allow={["GUEST"]} />, children: [
        { path: ROUTES.GUEST_DASH, element: <GuestDashboard /> },
        { path: ROUTES.GUEST_TIMING, element: <Timing /> },
        { path: ROUTES.GUEST_ACTIVITIES, element: <Activities /> },
        { path: ROUTES.GUEST_VOTING, element: <Voting /> },
        { path: ROUTES.GUEST_PRIVILEGES, element: <Privileges /> },
      ]},

      { element: <RequireAuth allow={["ORGANIZER"]} />, children: [
        { path: ROUTES.ORG_DASH, element: <OrganizerDashboard /> },
        { path: ROUTES.ORG_EVENTS, element: <Events /> },
        { path: ROUTES.ORG_ACTIVITIES, element: <OrgActivities /> },
        { path: ROUTES.ORG_PLANS, element: <Plans /> },
        { path: ROUTES.ORG_SETTINGS, element: <Settings /> },
        { path: ROUTES.ORG_STAFF, element: <Staff /> },
      ]},
    ],
  },
]);
