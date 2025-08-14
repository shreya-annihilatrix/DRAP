import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PublicAccount.css";
import PublicNavbar from "../components/PublicNavbar";

const PublicAccount = () => {
  const navigate = useNavigate();
  
  return (
    <div className="a12345678b90">
      <PublicNavbar />
      
      <main className="b23456789c01">
        <div className="c34567890d12">
          <h2 className="d45678901e23">Account Settings</h2>
          
          <div className="e56789012f34">
            <div className="f67890123g45" onClick={() => navigate("/public/profile")}>
              <div className="g78901234h56">
                <svg className="h89012345i67" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="i90123456j78">My Profile</span>
              <p className="j01234567k89">View your personal information</p>
            </div>
            
            <div className="f67890123g45" onClick={() => navigate("/public/edit-profile")}>
              <div className="g78901234h56">
                <svg className="h89012345i67" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="i90123456j78">Edit Profile</span>
              <p className="j01234567k89">Update your details</p>
            </div>
            
            <div className="f67890123g45" onClick={() => navigate("/public/change-password")}>
              <div className="g78901234h56">
                <svg className="h89012345i67" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v3m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="i90123456j78">Change Password</span>
              <p className="j01234567k89">Update your security</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="k12345678l90">
        <p className="l23456789m01">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicAccount;