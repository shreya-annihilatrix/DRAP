import "../styles/ComplaintFeedback.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const VolunteerCompFeed = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(0);

  const feedbackCards = [
    {
      title: "View Feedbacks",
      description: "Review feedback submitted by users and volunteers",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="a1b2345678">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: "/volunteer/feedback-view"
    },
    {
      title: "Submit Complaint",
      description: "File a new complaint about any issue or incident",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="a1b2345678">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: "/user/complaint"
    },
    {
      title: "View Complaint Status",
      description: "Check the status of your submitted complaints",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="a1b2345678">
          <path d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: "/user/view-complaint"
    }
  ];

  return (
    <div className="a1b3456789">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="c1d3456789">
        <div className="e1f3456789">
          <h2 className="g1h3456789">Complaint & Feedback</h2>
          
          <div className="m1n3456789">
            {feedbackCards.map((card, index) => (
              <div key={index} className="o1p3456789" onClick={() => navigate(card.path)}>
                <div className="q1r3456789">
                  {card.icon}
                </div>
                <div className="s1t3456789">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <button className="u1v3456789">
                  Manage
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div> 
      </main>
      
      <footer className="w1x3456789">
        <p className="y1z3456789">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerCompFeed;