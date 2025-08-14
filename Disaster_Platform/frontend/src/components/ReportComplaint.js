import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import "../styles/ReportComplaint.css";

const ReportComplaint = () => {
  const [complaintType, setComplaintType] = useState("");
  const [otherComplaintType, setOtherComplaintType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(3); // Adjust based on your navbar

  const complaintTypes = [
    "Service Issue",
    "Technical Problem",
    "Volunteer Conduct",
    "Safety Concern",
    "Program Feedback",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const finalComplaintType = complaintType === "Other" ? otherComplaintType : complaintType;

    if (complaintType === "Other" && !otherComplaintType.trim()) {
      setError("Please specify the complaint type");
      setIsSubmitting(false);
      return;
    }

    try {
      const complaintData = {
        userId: user.id,
        complaintType: finalComplaintType,
        description
      };
      
      await axios.post("http://localhost:5000/api/complaints/report", complaintData);
      
      setSuccess(true);
      setComplaintType("");
      setOtherComplaintType("");
      setDescription("");
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="abc345678901234">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="abc345678901235">
        <div className="abc345678901236">
          <h2 className="abc345678901237">Report a Complaint</h2>
          
          {error && (
            <div className="abc345678901238">
              <svg className="abc345678901239" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="abc345678901240">
              <svg className="abc345678901241" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Complaint submitted successfully!</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="abc345678901242">
            <div className="abc345678901243">
              <label htmlFor="complaintType" className="abc345678901244">Complaint Type</label>
              <select 
                id="complaintType"
                value={complaintType} 
                onChange={(e) => setComplaintType(e.target.value)}
                className="abc345678901245"
                required
              >
                <option value="">Select a complaint type</option>
                {complaintTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            {complaintType === "Other" && (
              <div className="abc345678901243">
                <label htmlFor="otherComplaintType" className="abc345678901244">Specify Complaint Type</label>
                <input
                  type="text"
                  id="otherComplaintType"
                  value={otherComplaintType}
                  onChange={(e) => setOtherComplaintType(e.target.value)}
                  className="abc345678901246"
                  placeholder="Please specify the complaint type"
                  required
                />
              </div>
            )}
            
            <div className="abc345678901243">
              <label htmlFor="description" className="abc345678901244">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="abc345678901247"
                placeholder="Please provide details about your complaint"
                rows="6"
                required
              />
            </div>
            
            <div className="abc345678901248">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="abc345678901249"
              >
                {isSubmitting ? (
                  <>
                    <svg className="abc345678901250" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </button>
              
              <button 
                onClick={() => navigate(-1)} 
                className="abc345678901251"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ReportComplaint;