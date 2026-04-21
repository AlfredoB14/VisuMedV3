import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
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
import PatientDetail from "./pages/PatientDetail";
import StudyViewer from "./pages/StudyViewer";
import { ROUTES } from "./routes/routes";
import { ProtectedRoute } from "./routes/protected-route";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path={ROUTES.APP.HOME} element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* Others Page */}
            <Route path={ROUTES.APP.PROFILE} element={<ProtectedRoute><UserProfiles /></ProtectedRoute>} />
            <Route path={ROUTES.APP.CALENDAR} element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path={ROUTES.APP.PATIENT_REGISTRY} element={<ProtectedRoute><PatientRegistry /></ProtectedRoute>} />

            {/* Pages */}
            <Route path={ROUTES.APP.BLANK} element={<ProtectedRoute><Blank /></ProtectedRoute>} />
            <Route path={ROUTES.APP.SEARCH_PATIENT} element={<ProtectedRoute><PacientesSearch /></ProtectedRoute>} />
            <Route path={ROUTES.APP.NEW_REPORT} element={<ProtectedRoute><NewReport /></ProtectedRoute>} />
            <Route path={ROUTES.APP.PATIENT_DETAIL} element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
            <Route path={ROUTES.APP.STUDY_VIEWER} element={<ProtectedRoute><StudyViewer /></ProtectedRoute>} />

            {/* Forms */}
            <Route path={ROUTES.APP.FORMS.ELEMENTS} element={<ProtectedRoute><FormElements /></ProtectedRoute>} />

            {/* Tables */}
            <Route path={ROUTES.APP.TABLES.BASIC} element={<ProtectedRoute><BasicTables /></ProtectedRoute>} />

            {/* Ui Elements */}
            <Route path={ROUTES.APP.UI.ALERTS} element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path={ROUTES.APP.UI.AVATARS} element={<ProtectedRoute><Avatars /></ProtectedRoute>} />
            <Route path={ROUTES.APP.UI.BADGE} element={<ProtectedRoute><Badges /></ProtectedRoute>} />
            <Route path={ROUTES.APP.UI.BUTTONS} element={<ProtectedRoute><Buttons /></ProtectedRoute>} />
            <Route path={ROUTES.APP.UI.IMAGES} element={<ProtectedRoute><Images /></ProtectedRoute>} />
            <Route path={ROUTES.APP.UI.VIDEOS} element={<ProtectedRoute><Videos /></ProtectedRoute>} />

            {/* Charts */}
            <Route path={ROUTES.APP.CHARTS.LINE} element={<ProtectedRoute><LineChart /></ProtectedRoute>} />
            <Route path={ROUTES.APP.CHARTS.BAR} element={<ProtectedRoute><BarChart /></ProtectedRoute>} />
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
    </AuthProvider>
  );
}
