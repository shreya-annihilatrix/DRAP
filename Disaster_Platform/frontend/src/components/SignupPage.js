import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import image from "../images/image7.jpg";
import { motion } from "framer-motion"; // You'll need to install this package

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    age: '',
    role: '',
    skills: '',
    photo: null,
    idProof: null,
    experienceCertificate: null,
  });

  const [errors, setErrors] = useState({});
  const [skillsList, setSkillsList] = useState([]);
  const [fileNames, setFileNames] = useState({
    photo: '',
    idProof: '',
    experienceCertificate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // document.getElementById("myForm").reset();
    axios.get("http://localhost:5000/api/skills")
      .then(response => setSkillsList(response.data))
      .catch(error => console.error("Error fetching skills:", error));
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) 
          error = 'Password must contain uppercase, lowercase, and number';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Invalid phone number (10 digits required)';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        break;
      case 'age':
        if (!value) error = 'Age is required';
        else if (value < 18) error = 'Must be 18 or older';
        else if (value > 100) error = 'Invalid age';
        break;
      case 'role':
        if (!value) error = 'Role is required';
        break;
      case 'skills':
        if (formData.role === 'volunteer' && value) error = 'Skill is required for volunteers';
        break;
      case 'photo':
        if (!value) error = 'Profile photo is required';
        break;
      case 'idProof':
        if (formData.role === 'volunteer' && !value) error = 'ID Proof is required for volunteers';
        break;
      default:
        break;
    }
    return error;
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      // Skip validation for experienceCertificate as it's optional
      if (field === 'experienceCertificate') return;
      
      // Skip skills and idProof validation for non-volunteers
      if ((field === 'skills' || field === 'idProof') && formData.role !== 'volunteer') return;
      
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files[0]) {
      const file = files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev, 
          [name]: 'File size must be less than 5MB'
        }));
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev, 
          [name]: 'Invalid file type. Please upload JPEG, PNG, GIF, or PDF'
        }));
        return;
      }

      // Clear previous errors
      setErrors(prev => {
        const { [name]: removedError, ...rest } = prev;
        return rest;
      });

      setFormData(prev => ({ ...prev, [name]: file }));
      setFileNames(prev => ({ ...prev, [name]: file.name }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateAllFields();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-field');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post("http://localhost:5000/api/users/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsLoading(false);
      // Show success message
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      
      // Handle specific errors from backend
      if (error.response?.status === 409) {
        setErrors(prev => ({ ...prev, email: "Email already exists" }));
        // Scroll to email field
        document.querySelector('input[name="email"]').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert("Signup failed: " + (error.response?.data?.error || "Unknown error"));
      }
    }
  };

  const renderFileUpload = (name, label, isRequired = true) => {
    return (
      <div className={`file-upload ${errors[name] ? 'error-field' : ''}`}>
        <input 
          type="file" 
          name={name} 
          id={name}
          onChange={handleFileChange} 
          accept=".jpg,.jpeg,.png,.gif,.pdf"
        />
        <label htmlFor={name} className="file-label">
          <span className="file-icon">📁</span>
          {fileNames[name] || label}
          {isRequired && <span className="required-mark">*</span>}
        </label>
        {errors[name] && <span className="error-message">{errors[name]}</span>}
      </div>
    );
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="signup-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="signup-card"
      >
        {/* Aside Image */}
        <div className="signup-image">
          <img src={image} alt="Signup Illustration" />
          <div className="image-overlay">
            <h2>Disaster Relief Assistance Platform</h2>
            <p>Make a difference by volunteering or seeking assistance</p>
          </div>
        </div>

        <div className="signup-form">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="form-title"
          >
            SIGN UP
          </motion.h1>
          
          <form onSubmit={handleSignup} encType="multipart/form-data">
            <div className="form-grid">
              <div className={`form-group ${errors.name ? 'error-field' : ''}`}>
                <label htmlFor="name">Full Name <span className="required-mark">*</span></label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className={`form-group ${errors.email ? 'error-field' : ''}`}>
                <label htmlFor="email">Email Address <span className="required-mark">*</span></label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  placeholder="Enter your email" 
                  defaultValue=""
                  value={formData.email} 
                  onChange={handleChange} 
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'error-field' : ''}`}>
                <label htmlFor="password">Password <span className="required-mark">*</span></label>
                <div className="password-input">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password" 
                    placeholder="Create a password" 
                    defaultValue=""
                    value={formData.password} 
                    onChange={handleChange} 
                  />
                  <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className={`form-group ${errors.confirmPassword ? 'error-field' : ''}`}>
                <label htmlFor="confirmPassword">Confirm Password <span className="required-mark">*</span></label>
                <div className="password-input">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword" 
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                  />
                  <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className={`form-group ${errors.phone ? 'error-field' : ''}`}>
                <label htmlFor="phone">Phone Number <span className="required-mark">*</span></label>
                <input 
                  type="text" 
                  id="phone"
                  name="phone" 
                  placeholder="10-digit phone number" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className={`form-group ${errors.age ? 'error-field' : ''}`}>
                <label htmlFor="age">Age <span className="required-mark">*</span></label>
                <input 
                  type="number" 
                  id="age"
                  name="age" 
                  placeholder="Your age" 
                  value={formData.age} 
                  onChange={handleChange} 
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>

              <div className={`form-group span-2 ${errors.address ? 'error-field' : ''}`}>
                <label htmlFor="address">Address <span className="required-mark">*</span></label>
                <input 
                  type="text" 
                  id="address"
                  name="address" 
                  placeholder="Your full address" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className={`form-group ${errors.role ? 'error-field' : ''}`}>
                <label htmlFor="role">Role <span className="required-mark">*</span></label>
                <select 
                  id="role"
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Role</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="public">Public</option>
                </select>
                {errors.role && <span className="error-message">{errors.role}</span>}
              </div>

              <div className={`form-group ${errors.photo ? 'error-field' : ''}`}>
                {renderFileUpload('photo', 'Upload Photo')}
              </div>
            </div>

            {formData.role === "volunteer" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="volunteer-section"
              >
                <h3 className="section-title">Volunteer Information</h3>
                
                <div className={`form-group ${errors.skills ? 'error-field' : ''}`}>
                  <label htmlFor="skills">Skills <span className="required-mark">*</span></label>
                  <select 
                    id="skills"
                    name="skills" 
                    value={formData.skills} 
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select Skill</option>
                    {skillsList.map((skill) => (
                      <option key={skill._id} value={skill.name}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                  {errors.skills && <span className="error-message">{errors.skills}</span>}
                </div>

                <div className="file-uploads-grid">
                  <div className={`form-group ${errors.idProof ? 'error-field' : ''}`}>
                    {renderFileUpload('idProof', 'Upload ID Proof')}
                  </div>
                  <div className="form-group">
                    {renderFileUpload('experienceCertificate', 'Upload Experience Certificate', false)}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="buttons-container">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : 'Create Account'}
              </motion.button>
              
              <p className="login-text">
                Already have an account?
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  onClick={() => navigate("/login")} 
                  className="login-btn"
                >
                  Login
                </motion.button>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Enhanced CSS */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .signup-container {
          display: flex;
background: linear-gradient(135deg, #374350, #827ac1de, #2a333d);
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .signup-card {
          display: flex;
          background: #fff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          overflow: hidden;
          max-width: 1100px;
          width: 100%;
          animation: fadeIn 0.5s ease-out;
        }
        
        .signup-image {
          flex: 1;
          position: relative;
        }
        
        .signup-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .signup-card:hover .signup-image img {
          transform: scale(1.05);
        }
        
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          color: #fff;
        }
        
        .image-overlay h2 {
          font-size: 24px;
          margin-bottom: 10px;
          font-weight: 600;
        }
        
        .signup-form {
          flex: 1.2;
          padding: 40px;
          overflow-y: auto;
          max-height: 90vh;
        }
        
        .form-title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 30px;
          position: relative;
        }
        
        .form-title:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(to right, #1a2a6c, #b21f1f);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .span-2 {
          grid-column: span 2;
        }
        
        label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #555;
        }
        
        .required-mark {
          color: #e74c3c;
          margin-left: 2px;
        }
        
        input, select {
          padding: 12px 16px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          transition: all 0.3s;
          background: #f9f9f9;
        }
        
        input:focus, select:focus {
          border-color: #1a2a6c;
          box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.2);
          outline: none;
          background: #fff;
        }
        
        .error-field input, 
        .error-field select, 
        .error-field .file-label {
          border-color: #e74c3c;
          background: #fff0f0;
        }
        
        .error-message {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
          font-weight: 500;
        }
        
        .volunteer-section {
          background: #f5f8ff;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 25px;
          border-left: 4px solid #1a2a6c;
        }
        
        .section-title {
          font-size: 18px;
          margin-bottom: 20px;
          color: #1a2a6c;
        }
        
        .file-uploads-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .file-upload {
          position: relative;
          margin-bottom: 5px;
        }
        
        .file-upload input[type="file"] {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .file-label {
          display: flex;
          align-items: center;
          background: #f0f4ff;
          color: #333;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.3s;
          border: 1px dashed #1a2a6c;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .file-icon {
          margin-right: 10px;
          font-size: 18px;
        }
        
        .file-label:hover {
          background: #e0e8ff;
        }
        
        .buttons-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }
        
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #2f8dcb, #827ac1de, #2daefd);
          color: #fff;
          padding: 14px 20px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(26, 42, 108, 0.3);
        }
        
        .submit-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }
        
        .submit-btn:hover:before {
          left: 100%;
        }
        
        .submit-btn:hover {
          background: linear-gradient(135deg, #827ac1de,#2f8dcb, #2daefd);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26, 42, 108, 0.4);
        }
        
        .submit-btn.loading {
          background: #777;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .login-text {
          margin-top: 20px;
          text-align: center;
          font-size: 15px;
          color: #666;
        }
        
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #2f8dcb, #827ac1de, #2daefd);
          color: #fff;
          padding: 14px 20px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(26, 42, 108, 0.3);
        }
        
        .login-btn:hover {
           background: linear-gradient(135deg, #827ac1de,#2f8dcb, #2daefd);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26, 42, 108, 0.4);
        }
        
        .password-input {
          position: relative;
        }
        
        .toggle-password {
          position: absolute;
              width: fit-content;

          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #666;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 900px) {
          .signup-card {
            flex-direction: column;
            max-width: 600px;
          }
          
          .signup-image {
            height: 200px;
          }
          
          .form-grid,
          .file-uploads-grid {
            grid-template-columns: 1fr;
          }
          
          .span-2 {
            grid-column: span 1;
          }
          
          .signup-form {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;