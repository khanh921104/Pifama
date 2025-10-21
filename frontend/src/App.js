
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />

        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* <Route path="/" element={<PigList />} /> */}
        <Route path="/pigs" element={<PigList />} />
        <Route path="/pigs/add" element={<PigForm />} />
        <Route path="/pigs/edit/:id" element={<PigForm />} />

        <Route path="/areas" element={<AreaList />} />
        <Route path="/areas/add" element={<AreaForm />} />
        <Route path="/areas/edit/:id" element={<AreaForm />} />

        <Route path="/pens" element={<PenList />} />
        <Route path="/pens/add" element={<PenForm />} />
        <Route path="/pens/edit/:id" element={<PenForm />} />

        <Route path="/staffs" element={<StaffList />} />
        <Route path="/staffs/add" element={<StaffForm />} />
        <Route path="/staffs/edit/:id" element={<StaffForm />} />

        <Route path="/foods" element={<FoodList />} />
        <Route path="/foods/add" element={<FoodForm />} />
        <Route path="/foods/edit/:id" element={<FoodForm />} /> 

        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/medicines/add" element={<MedicineForm />} />
        <Route path="/medicines/edit/:id" element={<MedicineForm />} />

        <Route path="/assignments" element={<AssignmentList />} />
        <Route path="/assignments/add" element={<AssignmentForm />} />
        <Route path="/assignments/edit/:id" element={<AssignmentForm />} />

        <Route path="/inject-medicines" element={<InjectList />} />
        <Route path="/inject-medicines/add" element={<InjectsForm />} />
        <Route path="/inject-medicines/edit/:id" element={<InjectsForm />} />

      </Routes>
    </Router>
  );
};

export default App;
