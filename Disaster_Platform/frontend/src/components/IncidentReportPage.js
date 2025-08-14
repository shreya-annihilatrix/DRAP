import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IncidentReportPage.css";
import PublicNavbar from "../components/PublicNavbar";

const IncidentReport = () => {
  const navigate = useNavigate();

  return (
    <div className="a1234b567890">
      <PublicNavbar />
      
      <main className="b2345c678901">
        <div className="c3456d789012">
          <h2 className="d4567e890123">Incident Report Center</h2>
          
          <div className="e5678f901234">
            <div className="f6789g012345" onClick={() => navigate("/report-incident")}>
              <div className="g7890h123456">
                <svg className="h8901i234567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i9012j345678">Report an Incident</span>
              <p className="j0123k456789">Submit a new disaster incident report for emergency response</p>
            </div>
            
            <div className="f6789g012345" onClick={() => navigate("/my-incidents")}>
              <div className="g7890h123456">
                <svg className="h8901i234567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i9012j345678">View My Incident Reports</span>
              <p className="j0123k456789">Access and track the status of your submitted reports</p>
            </div>
            
            {/* <div className="f6789g012345" onClick={() => navigate("/public-incidents")}>
              <div className="g7890h123456">
                <svg className="h8901i234567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3H3V10H10V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 3H14V10H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 14H14V21H21V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14H3V21H10V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
               <span className="i9012j345678">Public Incident Map</span>
              <p className="j0123k456789">View verified incidents and ongoing disaster situations</p> 
            </div> */}
          </div>

          
          {/* <div className="k1234l567890">
            <h3 className="l2345m678901">Recent Incidents</h3>
            <div className="m3456n789012">
              <p className="n4567o890123">No recent incidents to display. Submit an incident report to get started.</p>
            </div>
          </div> */}
        </div>

      </main>
      <footer className="m345n6789012">
        <p className="n456o7890123">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default IncidentReport;