import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEventForm from "./AddEventForm";
import AdminDashboard from "./AdminAddEvent";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);

    if (!adminStatus) {
      navigate("/"); // Redirect non-admin users
    }
  }, [navigate]);

  return (
    <div>
      <h2 className="text-center mt-4">Admin Dashboard</h2>
      {/* {isAdmin ? <AddEventForm isAdmin={true} /> : <p className="text-danger text-center">Access Denied</p>} */}
      {isAdmin ? <AdminDashboard isAdmin={true} /> : <p className="text-danger text-center">Access Denied</p>}

    </div>
  );
};

export default AdminPage;
