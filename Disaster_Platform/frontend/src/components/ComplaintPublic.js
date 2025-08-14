import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ComplaintPage.css"; // Reusing the same CSS
import PublicNavbar from "../components/PublicNavbar";

const ComplaintPublic = () => {
  const navigate = useNavigate();

  return (
    <div className="a1234567b890">
      <PublicNavbar />
      
      <main className="b2345678c901">
        <div className="c3456789d012">
          <h2 className="d4567890e123">Complaint Center</h2>
          
          <div className="e5678901f234">
            <div className="f6789012g345" onClick={() => navigate("/public/complaint")}>
              <div className="g7890123h456">
                <svg className="h8901234i567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i9012345j678">Submit Complaint</span>
              <p className="j0123456k789">File a new complaint about services or issues</p>
            </div>
            
            <div className="f6789012g345" onClick={() => navigate("/public/view-complaint")}>
              <div className="g7890123h456">
                <svg className="h8901234i567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i9012345j678">View Complaint Status</span>
              <p className="j0123456k789">Track and manage your submitted complaints</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ComplaintPublic;