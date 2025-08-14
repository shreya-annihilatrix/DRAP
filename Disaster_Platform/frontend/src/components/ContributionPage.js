import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ContributionPage.css";
import PublicNavbar from "../components/PublicNavbar";

const ContributionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="a123456b7890">
      <PublicNavbar />
      
      <main className="b234567c8901">
        <div className="c345678d9012">
          <h2 className="d456789e0123">Contribution Center</h2>
          
          <div className="e567890f1234">
            <div className="f678901g2345" onClick={() => navigate("/public/contribute-res")}>
              <div className="g789012h3456">
                <svg className="h890123i4567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i901234j5678">Add Contributed Resources</span>
              <p className="j012345k6789">Submit new resources to help with disaster relief efforts</p>
            </div>
            
            <div className="f678901g2345" onClick={() => navigate("/public/view-contribute")}>
              <div className="g789012h3456">
                <svg className="h890123i4567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i901234j5678">View My Contributions</span>
              <p className="j012345k6789">Access and track the status of your submitted contributions</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="k123456l7890">
        <p className="l234567m8901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContributionPage;