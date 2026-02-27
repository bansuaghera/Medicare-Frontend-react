import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOTP from "../pages/VerifyOTP";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Patients from "../pages/admin/Patients";
import AddPatient from "../pages/admin/AddPatient";
import Doctors from "../pages/admin/Doctors";
import AddDoctor from "../pages/admin/AddDoctor";
import Staff from "../pages/admin/Staff";
import AddStaff from "../pages/admin/AddStaff";
import OPDSchedule from "../pages/admin/OPDSchedule";
import AddOPDSchedule from "../pages/admin/AddOPDSchedule";
import Appointments from "../pages/admin/Appointments";
import TokenQueue from "../pages/admin/TokenQueue";
import Prescriptions from "../pages/admin/Prescriptions";
import PrescriptionDetail from "../pages/admin/PrescriptionDetail";
import Medicines from "../pages/admin/Medicines";
import AddMedicine from "../pages/admin/AddMedicine";
import Templates from "../pages/admin/Templates";
import AddTemplate from "../pages/admin/AddTemplate";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import UserProfile from "../pages/admin/Profile";
import StaffDashboard from "../pages/staff/StaffDashboard";
import RegisterPatient from "../pages/staff/RegisterPatient";
import StaffPatients from "../pages/staff/Patients";
import BookAppointment from "../pages/staff/BookAppointment";
import GenerateToken from "../pages/staff/GenerateToken";
import QueueMonitor from "../pages/staff/QueueMonitor";
import CallToken from "../pages/staff/CallToken";
import StaffOPDSchedule from "../pages/staff/OPDSchedule";
import Print from "../pages/staff/Print";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/patients/add" element={<AddPatient />} />
        <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin/doctors/add" element={<AddDoctor />} />
        <Route path="/admin/staff" element={<Staff />} />
        <Route path="/admin/staff/add" element={<AddStaff />} />
        <Route path="/admin/schedule" element={<OPDSchedule />} />
        <Route path="/admin/schedule/add" element={<AddOPDSchedule />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/queue" element={<TokenQueue />} />
        <Route path="/admin/prescriptions" element={<Prescriptions />} />
        <Route path="/admin/prescriptions/detail" element={<PrescriptionDetail />} />
        <Route path="/admin/medicines" element={<Medicines />} />
        <Route path="/admin/medicines/add" element={<AddMedicine />} />
        <Route path="/admin/templates" element={<Templates />} />
        <Route path="/admin/templates/add" element={<AddTemplate />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/profile" element={<UserProfile />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/register-patient" element={<RegisterPatient />} />
        <Route path="/staff/patients" element={<StaffPatients />} />
        <Route path="/staff/appointments" element={<BookAppointment />} />
        <Route path="/staff/tokens" element={<GenerateToken />} />
        <Route path="/staff/queue" element={<QueueMonitor />} />
        <Route path="/staff/call-token" element={<CallToken />} />
        <Route path="/staff/schedule" element={<StaffOPDSchedule />} />
        <Route path="/staff/print" element={<Print />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
