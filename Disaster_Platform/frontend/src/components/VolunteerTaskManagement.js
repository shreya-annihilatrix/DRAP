import "../styles/VolunteerTaskManagement.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const VolunteerTaskManagement = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(0);
  const [taskStats, setTaskStats] = useState({
    assigned: 7,
    accepted: 4,
    completed: 12
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching task data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const taskCards = [
    {
      title: "Assigned Tasks",
      description: "View and manage tasks assigned to you",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="c123d4567">
          <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5C15 5.53043 14.7893 6.03914 14.4142 6.41421C14.0391 6.78929 13.5304 7 13 7H11C10.4696 7 9.96086 6.78929 9.58579 6.41421C9.21071 6.03914 9 5.53043 9 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: taskStats.assigned,
      path: "/volunteer/tasks"
    },
    {
      title: "Accepted Tasks",
      description: "Manage tasks you've accepted responsibility for",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="c123d4567">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: taskStats.accepted,
      path: "/volunteer/accepted-task"
    },
    {
      title: "Completed Tasks",
      description: "View your completed and archived tasks",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="c123d4567">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: taskStats.completed,
      path: "/volunteer/completed-tasks"
    }
  ];

  return (
    <div className="s123p4567">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="m123a4567">
        <div className="d123i4567">
          <h2 className="t123l4567">Task Management</h2>
          
          {loading ? (
            <div className="l123o4567">
              {/* Changed the class name here from s123p4567 to s123w4567 */}
              <div className="s123w4567"></div>
              <p>Loading task data...</p>
            </div>
          ) : (
            <div className="g123r4567">
              {taskCards.map((card, index) => (
                <div key={index} className="c123a4567" onClick={() => navigate(card.path)}>
                  <div className="i123c4567">
                    {card.icon}
                  </div>
                  <div className="t123e4567">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                  <button className="b123u4567">
                    Manage
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> 
      </main>
      
      <footer className="f123o4567">
        <p className="p123r4567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerTaskManagement;