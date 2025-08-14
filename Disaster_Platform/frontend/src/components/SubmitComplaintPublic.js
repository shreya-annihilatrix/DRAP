import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";
import "../styles/SubmitComplaintPublic.css";

const SubmitComplaintPublic = () => {
  const [complaintType, setComplaintType] = useState("");
  const [otherComplaintType, setOtherComplaintType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

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
    <div className="a00010000000001">
      <PublicNavbar />
      
      <main className="a00010000000002">
        <div className="a00010000000003">
          <div className="a00010000000004">
            <h1 className="a00010000000005">Report a Complaint</h1>
            <p className="a00010000000006">We're here to help. Please provide details about your concern.</p>
            
            {error && (
              <div className="a00010000000007">
                <svg className="a00010000000008" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span className="a00010000000009">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="a00010000000010">
                <svg className="a00010000000011" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="a00010000000012">Complaint submitted successfully!</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="a00010000000013">
              <div className="a00010000000014">
                <label htmlFor="complaintType" className="a00010000000015">Complaint Type</label>
                <select 
                  id="complaintType"
                  value={complaintType} 
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="a00010000000016"
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
                <div className="a00010000000014">
                  <label htmlFor="otherComplaintType" className="a00010000000015">Specify Complaint Type</label>
                  <input
                    type="text"
                    id="otherComplaintType"
                    value={otherComplaintType}
                    onChange={(e) => setOtherComplaintType(e.target.value)}
                    className="a00010000000017"
                    placeholder="Please specify the complaint type"
                    required
                  />
                </div>
              )}
              
              <div className="a00010000000014">
                <label htmlFor="description" className="a00010000000015">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="a00010000000018"
                  placeholder="Please provide details about your complaint"
                  rows="6"
                  required
                />
                <p className="a00010000000019">Be as specific as possible to help us address your concern</p>
              </div>
              
              <div className="a00010000000020">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="a00010000000021"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="a00010000000022" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                      <span className="a00010000000023">Submitting...</span>
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => navigate(-1)} 
                  className="a00010000000024"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SubmitComplaintPublic;