import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import image from "../images/image6.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      setUser({
        id: response.data._id,
        role: response.data.role,
        name: response.data.name,
        phone: response.data.phone,
        email: response.data.email,
      });
      console.log(user);
      if (response.data.role === "admin") navigate("/admin-home");
      else if (response.data.role === "volunteer") {
        localStorage.setItem("volunteerId", response.data.volunteerId);
        navigate("/volunteer-home");
      } else if (response.data.role === "public") navigate("/public-home");
    } catch (error) {
      setError(error.response ? error.response.data.message : "Login failed");
    }
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="animated-bg">
        <div className="circle c1"></div>
        <div className="circle c2"></div>
        <div className="circle c3"></div>
        <div className="circle c4"></div>
        <div className="circle c5"></div>
      </div>
      
      <div className="login-container">
        {/* Aside Image */}
        <div className="login-image-container">
          <img src={image} alt="Login Illustration" />
          <div className="overlay"></div>
        </div>

        <div className="login-form-container">
          <div className="form-header">
            {/* <h2>Welcome Back</h2>
            <p>Enter your details to access your account</p> */}
          </div>

          {error && (
            <div className="error-message">
              <i className="error-icon">!</i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-forgot">
              <div className="remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">Sign In</button>
          </form>

          <div className="signup-option">
            <p>Don't have an account?</p>
            <button onClick={() => navigate("/signup")} className="signup-button">Create Account</button>
          </div>
        </div>
      </div>

      {/* Internal CSS */}
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.5;
            }
            100% {
              transform: scale(1);
              opacity: 0.7;
            }
          }
          
          .login-page {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
            padding: 20px;
            position: relative;
            overflow: hidden;
          }
          
          .animated-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            pointer-events: none;
          }
          
          .circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
            animation: pulse 6s infinite;
          }
          
          .c1 {
            width: 150px;
            height: 150px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
            animation-duration: 8s;
          }
          
          .c2 {
            width: 300px;
            height: 300px;
            bottom: -50px;
            right: 10%;
            animation-delay: 1s;
            animation-duration: 9s;
          }
          
          .c3 {
            width: 200px;
            height: 200px;
            top: 60%;
            left: 30%;
            animation-delay: 2s;
            animation-duration: 7s;
          }
          
          .c4 {
            width: 100px;
            height: 100px;
            top: 10%;
            right: 20%;
            animation-delay: 3s;
            animation-duration: 10s;
          }
          
          .c5 {
            width: 250px;
            height: 250px;
            bottom: 30%;
            left: 5%;
            animation-delay: 4s;
            animation-duration: 11s;
          }
          
          .login-container {
            display: flex;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 20px;
            overflow: hidden;
            width: 100%;
            max-width: 800px;
            max-height: 470px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 
                        0 10px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            animation: float 6s ease-in-out infinite;
            border: 1px solid rgba(255, 255, 255, 0.18);
            z-index: 10;
          }
          
          .login-image-container {
            flex: 1;
            position: relative;
            overflow: hidden;
          }
          
          .login-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.8s ease;
          }
          
          .login-container:hover .login-image-container img {
            transform: scale(1.05);
          }
          
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
          }
          
          .login-form-container {
            flex: 1;
            padding: 60px 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            z-index: 1;
            background: white;
          }
          
          .form-header {
            margin-bottom: 30px;
            text-align: left;
          }
          
          .form-header h2 {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
          }
          
          .form-header p {
            color: #666;
            font-size: 16px;
          }
          
          .error-message {
            display: flex;
            align-items: center;
            background-color: #fff0f0;
            color: #e74c3c;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            border-left: 4px solid #e74c3c;
            animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
          }
          
          @keyframes shake {
            10%, 90% {
              transform: translate3d(-1px, 0, 0);
            }
            
            20%, 80% {
              transform: translate3d(2px, 0, 0);
            }
          
            30%, 50%, 70% {
              transform: translate3d(-4px, 0, 0);
            }
          
            40%, 60% {
              transform: translate3d(4px, 0, 0);
            }
          }
          
          .error-icon {
            background: #e74c3c;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-style: normal;
            font-weight: bold;
            margin-right: 10px;
          }
          
          .input-group {
            margin-bottom: 20px;
            position: relative;
          }
          
          .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 14px;
            transition: all 0.3s;
          }
          
          input {
            width: 100%;
            padding: 15px;
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s;
            background-color: #f9f9f9;
          }
          
          input:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
            background-color: #fff;
          }
          
          .input-group:focus-within label {
            color: #3498db;
          }
          
          @keyframes highlightField {
            0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
            100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
          }
          
          .input-group:nth-of-type(1) input {
            animation: highlightField 2s ease-out 1s;
          }
          
          .remember-forgot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            font-size: 14px;
          }
          
          .remember {
            display: flex;
            align-items: center;
          }
          
          .remember input {
            width: auto;
            margin-right: 8px;
          }
          
          .forgot-password {
            color: #3498db;
            text-decoration: none;
            transition: color 0.3s;
          }
          
          .forgot-password:hover {
            color: #2980b9;
            text-decoration: underline;
          }
          
          @keyframes buttonPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
            }
          }
          
          .login-button {
            background: linear-gradient(to right, #3498db, #2980b9);
            color: white;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
            animation: buttonPulse 2s infinite;
          }
          
          .login-button:hover {
            background: linear-gradient(to right, #2980b9, #2573a7);
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
          }
          
          .login-button:active {
            transform: translateY(1px);
          }
          
          .signup-option {
            margin-top: 30px;
            text-align: center;
            color: #777;
            font-size: 14px;
          }
          
          .signup-button {
            background: transparent;
            color: #3498db;
            border: 2px solid #3498db;
            padding: 12px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
            margin-top: 12px;
          }
          
          .signup-button:hover {
            background: rgba(52, 152, 219, 0.1);
            color: #2980b9;
            border-color: #2980b9;
          }
          
          @media (max-width: 768px) {
            .login-container {
              flex-direction: column;
              max-width: 90%;
              min-height: auto;
              max-height: none;
              animation: none;
            }
            
            .login-image-container {
              height: 200px;
            }
            
            .login-form-container {
              padding: 40px 20px;
            }
            
            .form-header h2 {
              font-size: 26px;
            }
            
            .circle {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;