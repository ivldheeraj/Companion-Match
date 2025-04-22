import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminAddEvent";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const adminStatus = userType === "admin";

    setIsAdmin(adminStatus);

    if (!adminStatus) {
      navigate("/"); // Redirect non-admin users
    }
  }, [navigate]);

  return (
    <div>
      <h2 className="text-center mt-4">Admin Dashboard</h2>
      {isAdmin ? <AdminDashboard isAdmin={true} /> : <p className="text-danger text-center">Access Denied</p>}

    </div>
  );
};

export default AdminPage;
