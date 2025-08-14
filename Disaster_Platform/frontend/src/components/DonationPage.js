import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DonationPage.css";
import PublicNavbar from "../components/PublicNavbar";

const DonationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="a12345b67890">
      <PublicNavbar />
      
      <main className="b23456c78901">
        <div className="c34567d89012">
          <h2 className="d45678e90123">Donation Center</h2>
          
          <div className="e56789f01234">
            <div className="f67890g12345" onClick={() => navigate("/public/view-campaign")}>
              <div className="g78901h23456">
                <svg className="h89012i34567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i90123j45678">View Donation Campaigns</span>
              <p className="j01234k56789">Browse active donation campaigns and contribute to causes</p>
            </div>
            
            <div className="f67890g12345" onClick={() => navigate("/public/my-donation")}>
              <div className="g78901h23456">
                <svg className="h89012i34567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i90123j45678">My Donations</span>
              <p className="j01234k56789">View your donation history and track your contributions</p>
            </div>
            
            {/* <div className="f67890g12345" onClick={() => navigate("/public/new-donation")}>
              <div className="g78901h23456">
                <svg className="h89012i34567" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="i90123j45678">Make a Donation</span>
              <p className="j01234k56789">Contribute directly to disaster relief efforts</p>
            </div> */}
          </div>
        </div>
      </main>
      <footer className="k12345l67890">
        <p className="l23456m78901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DonationPage;