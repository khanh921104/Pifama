import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PigList from "./pages/Pigs/PigList";
import AreaList from "./pages/Areas/AreaList";
import PenList from "./pages/Pens/PenList";
import PigForm from "./pages/Pigs/PigForm";
import AreaForm from "./pages/Areas/AreaForm";
import PenForm from "./pages/Pens/PenForm";
import StaffList from "./pages/Staff/StaffList";
import StaffForm from "./pages/Staff/StaffForm";
import Dashboard from "./pages/Dashboard/DashboardPage";
import Login from "./pages/Login/LoginPage";
import FoodList from "./pages/Foods/FoodList";
import FoodForm from "./pages/Foods/FoodForm";
import MedicineList from "./pages/Medicines/MedicineList";
import MedicineForm from "./pages/Medicines/MedicineForm";
import AssignmentList from "./pages/Assignments/AssignmentList";
import AssignmentForm from "./pages/Assignments/AssignmentForm";
import InjectList from "./pages/Inject/InjectList";
import InjectsForm from "./pages/Inject/InjectForm";


import Header from "./pages/header";
import Account from "./pages/Login/Account";
import ProtectedRoute from "./routes/ProtectedRoute";

const ROLE_ADMIN = 1;
const ROLE_MANAGER = 2;

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />

        {/* Dashboard - admin + manager */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Pigs - manager can view list and view page, only admin can add/edit */}
        <Route
          path="/pigs"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <PigList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pigs/add"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <PigForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pigs/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <PigForm />
            </ProtectedRoute>
          }
        />

        {/* Areas - manager can view list and view page, only admin can add/edit */}
        <Route
          path="/areas"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <AreaList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/areas/add"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <AreaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/areas/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <AreaForm />
            </ProtectedRoute>
          }
        />

        {/* Pens - manager can view list and view page, only admin can add/edit */}
        <Route
          path="/pens"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <PenList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pens/add"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <PenForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pens/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <PenForm />
            </ProtectedRoute>
          }
        />

        {/* Staffs - only admin */}
        <Route
          path="/staffs"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <StaffList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staffs/add"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <StaffForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staffs/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <StaffForm />
            </ProtectedRoute>
          }
        />

        {/* Foods - manager and admin can view, only admin add/edit */}
        <Route
          path="/foods"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <FoodList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/foods/add"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <FoodForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/foods/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <FoodForm />
            </ProtectedRoute>
          }
        />

        {/* Medicines - manager and admin can view, only admin add/edit */}
        <Route
          path="/medicines"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <MedicineList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicines/add"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <MedicineForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicines/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <MedicineForm />
            </ProtectedRoute>
          }
        />

        {/* Assignments - manager and admin can view, only admin add/edit */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <AssignmentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments/add"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <AssignmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <AssignmentForm />
            </ProtectedRoute>
          }
        />

        {/* Injects - manager and admin can view, only admin add/edit */}
        <Route
          path="/inject-medicines"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <InjectList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inject-medicines/add"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <InjectsForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inject-medicines/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <InjectsForm />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
