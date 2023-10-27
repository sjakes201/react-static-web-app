import React, { useContext, useState } from "react";
import "../CSS/CompLogin.css";
import { GameContext } from "../../GameContainer";
import { useWebSocket } from "../../WebSocketContext";

/*
A popup that can appear anywhere
Press account button and it appears
If not loginLogged in, contains register and login
If loginLogged in, contains loginLog out 

*/

function Complogin() {
  const { waitForServerResponse } = useWebSocket();
  const { setLoginBox } = useContext(GameContext)
  // type is login or register
  const [screenType, setScreenType] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const [info, setInfo] = useState({
    Username: "",
    Password: "",
    Email: "",
  });

  // stores error message associated with registration to show user if exists
  const [log, setLog] = useState("");

  const handleInputChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const [resetEmail, setResetEmail] = useState("");

  const forgotLogin = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("forgotPassEmail", {
        email: resetEmail,
      });
      let data = response.body;
      setLog(data.message);
    }
  };

  const login = async (profile) => {
    let data;
    let response;
    if (waitForServerResponse) {
      response = await waitForServerResponse("userLogin", profile);
      console.log(response);
      data = response.body;
    }

    if (data.auth) {
      localStorage.setItem("token", data.token);
      console.log("Login success");
      window.location.reload(false);
    } else {
      console.log("Login failed");
    }

    switch (data?.status) {
      case 200:
        setLog("login successful");
        setInfo({
          Username: "",
          Password: "",
          Email: "",
        });
        break;
      case 400:
        setLog("Invalid username or password characters");
        break;
      case 401:
        setLog("Invalid username and password combination");
        break;
      case 403:
        setLog("Invalid account, contact me");
        break;
      case 500:
        setLog("Server connection failed");
        break;
      default:
        setLog("Uncaught error occured");
        break;
    }
  };

  const createUser = async (profile) => {
    let data;
    let response;
    if (waitForServerResponse) {
      response = await waitForServerResponse("userRegister", profile);
      data = response.body;
    }
    if (window.gtag) {
      window.gtag('event', 'user_register', {
        'event_category': 'Accounts',
        'event_label': 'User Register'
      })
    }

    if (data.auth) {
      localStorage.setItem("token", data.token);
      console.log("Login success");
      window.location.reload(false);
    } else {
      console.log("Login failed");
    }

    switch (data?.status) {
      case 200:
        setLog("Account creation success");
        setInfo({
          Username: "",
          Password: "",
          Email: "",
        });
        break;
      case 400:
        setLog("Invalid username or password characters");
        break;
      case 409:
        if (data.message.includes("EMAIL")) {
          setLog("Email already associated with an account");
        } else {
          setLog("Username not available");
        }
        break;
      case 500:
        setLog("Internal server error, try again");
        break;
      default:
        setLog("Uncaught internal server error, try again");
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // pass 'loginInfo' from state to server. It will check if valid account creation (Username unique)
    if (screenType === "Login") {
      let success = await login({
        Username: info.Username,
        Password: info.Password,
      });
    } else if (screenType === "Register") {
      let success = await createUser({
        Username: info.Username,
        Password: info.Password,
        Email: info.Email,
      });
    } else if (screenType === "Forgot") {
      let success = await forgotLogin();
    }
  };

  const getLogin = () => {
    return (
      <div className="loginBoxPagePos">
        <div className="xClose" onClick={() => setLoginBox(false)}>
          X
        </div>
        <div className="login-gui">
          <div className="login-title-bar">
            <hr className="deco-bar-top bar-left" />
            <p>Login</p>
            <hr className="deco-bar-top bar-right" />
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="credentials-input">
              <label className="underline">Username: </label>
              <input
                name="Username"
                type="text"
                pattern="[A-Za-z0-9_.]{4,24}"
                value={info.Username}
                title="4 to 24 characters in length: letters, numbers, _ and . allowed"
                onChange={(e) => handleInputChange(e)}
                required
              ></input>
              <label className="underline">Password: </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <input
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  pattern="[A-Za-z0-9!@#$%^&*_\-\.]{4,32}"
                  value={info.Password}
                  title="4 to 32 characters in length: letters, numbers, and special characters allowed"
                  onChange={(e) => handleInputChange(e)}
                  required
                ></input>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/reveal.png`}
                  style={{
                    width: "32px",
                    height: "32px",
                    position: "absolute",
                    right: "-32px",
                    borderRadius: "20%",
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1vw" }}>{log}</p>
              <input
                type="submit"
                value="Login"
                style={{ padding: ".5% 3%", marginTop: "2.5%" }}
              />
            </div>
          </form>

          <small
            className="forgot-link"
            onClick={() => setScreenType("Forgot")}
          >
            Forgot password?
          </small>

          <div className="login-title-bar" id="bottom-title-bar">
            <hr className="deco-bar-bottom bar-left" />
            <p>New User?</p>
            <hr className="deco-bar-bottom bar-right" />
          </div>
          <div>
            <button
              onClick={() => {
                setScreenType("Register");
                setLog("");
              }}
              type="button"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getForgot = () => {
    return (
      <div className="loginBoxPagePos">
        <div className="xClose" onClick={() => setLoginBox(false)}>
          X
        </div>
        <div className="login-gui">
          <div className="login-title-bar">
            <hr className="deco-bar-top bar-left" />
            <p>Forgot password</p>
            <hr className="deco-bar-top bar-right" />
          </div>
          <div className="forgot-gui">
            <form className="forgot-form" onSubmit={handleSubmit}>
              <label className="underline">Email:</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <input id="send-email" type="submit" value="Send" />
              <p>{log}</p>
            </form>
          </div>
          <hr id="forgot-hr" />
          <div className="forgot-bottom-buttons">
            <button
              onClick={() => {
                setScreenType("Register");
                setLog("");
              }}
              type="button"
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setScreenType("Login");
                setLog("");
              }}
              type="button"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getRegister = () => {
    return (
      <div className="loginBoxPagePos">
        <span
          style={{
            position: "absolute",
            bottom: "6%",
            right: "5%",
            color: "gray",
            fontSize: ".7vw",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>*Email optional and exclusively</span>
          <span>for 'forgot password'</span>
        </span>
        <div className="xClose" onClick={() => setLoginBox(false)}>
          X
        </div>
        <div id="register" className="login-gui">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            <hr
              style={{
                width: "25%",
                height: "3px",
                marginLeft: "5%",
                backgroundColor: "var(--menu_dark)",
              }}
            />
            <p>Create Account</p>
            <hr
              style={{
                width: "25%",
                height: "3px",
                marginRight: "5%",
                backgroundColor: "var(--menu_dark)",
              }}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <label style={{ textDecoration: "underline" }}>Username:</label>
            <input
              name="Username"
              type="text"
              pattern="[A-Za-z0-9_.]{4,16}"
              value={info.Username}
              title="4 to 16 characters in length: letters, numbers, _ and . allowed"
              onChange={(e) => handleInputChange(e)}
              required
            ></input>
            <label style={{ textDecoration: "underline" }}>Password:</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                position: "relative",
              }}
            >
              <input
                name="Password"
                type={showPassword ? "text" : "password"}
                pattern="[A-Za-z0-9!@#$%^&*_\-\.]{4,32}"
                value={info.Password}
                title="4 to 32 characters in length: letters, numbers, and special characters allowed"
                onChange={(e) => handleInputChange(e)}
                style={{ position: "relative" }}
                required
              ></input>
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/reveal.png`}
                style={{
                  width: "32px",
                  height: "32px",
                  position: "absolute",
                  right: "-32px",
                  borderRadius: "20%",
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            <label>
              *<span style={{ textDecoration: "underline" }}>Email:</span>
            </label>
            <input
              name="Email"
              type="email"
              value={info.Email}
              onChange={(e) => handleInputChange(e)}
            ></input>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1vw" }}>{log}</p>
              <input
                type="submit"
                value="Create Account"
                style={{ padding: "1% 3%", marginTop: "6%" }}
              />
            </div>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              textAlign: "center",
              marginTop: "2.5%",
            }}
          >
            <hr
              style={{
                width: "35%",
                height: "3px",
                marginLeft: "5%",
                backgroundColor: "var(--menu_dark)",
              }}
            />
            <p>Login?</p>
            <hr
              style={{
                width: "35%",
                height: "3px",
                marginRight: "5%",
                backgroundColor: "var(--menu_dark)",
              }}
            />
          </div>
          <div>
            <button
              onClick={() => {
                setScreenType("Login");
                setLog("");
              }}
              type="button"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (screenType === "Login") {
    return getLogin();
  } else if (screenType === "Forgot") {
    return getForgot();
  } else {
    return getRegister();
  }
}

export default Complogin;
