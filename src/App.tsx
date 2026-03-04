import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import PatientRegistry from "./pages/PatientRegistry";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import VisuMedLanding from "./pages/LandingPage";
import PacientesSearch from "./pages/PatientSearch";
import NewReport from "./pages/NewReport";
import { ROUTES } from "./routes/routes";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          
          <Route element={<AppLayout />}>
            <Route path={ROUTES.APP.HOME} element={<Home />} />

            {/* Others Page */}
            <Route path={ROUTES.APP.PROFILE} element={<UserProfiles />} />
            <Route path={ROUTES.APP.CALENDAR} element={<Calendar />} />
            <Route path={ROUTES.APP.PATIENT_REGISTRY} element={<PatientRegistry />} />

            {/* Pages */}
            <Route path={ROUTES.APP.BLANK} element={<Blank />} />
            <Route path={ROUTES.APP.SEARCH_PATIENT} element={<PacientesSearch />} />
            <Route path={ROUTES.APP.NEW_REPORT} element={<NewReport />} />

            {/* Forms */}
            <Route path={ROUTES.APP.FORMS.ELEMENTS} element={<FormElements />} />

            {/* Tables */}
            <Route path={ROUTES.APP.TABLES.BASIC} element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path={ROUTES.APP.UI.ALERTS} element={<Alerts />} />
            <Route path={ROUTES.APP.UI.AVATARS} element={<Avatars />} />
            <Route path={ROUTES.APP.UI.BADGE} element={<Badges />} />
            <Route path={ROUTES.APP.UI.BUTTONS} element={<Buttons />} />
            <Route path={ROUTES.APP.UI.IMAGES} element={<Images />} />
            <Route path={ROUTES.APP.UI.VIDEOS} element={<Videos />} />

            {/* Charts */}
            <Route path={ROUTES.APP.CHARTS.LINE} element={<LineChart />} />
            <Route path={ROUTES.APP.CHARTS.BAR} element={<BarChart />} />
          </Route>

          {/* Auth */}
          <Route path={ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTES.AUTH.SIGN_UP} element={<SignUp />} />

          {/* Landing */}
          <Route path={ROUTES.ROOT} element={<VisuMedLanding />} />

          {/* Fallback */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
