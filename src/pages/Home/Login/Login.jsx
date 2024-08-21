import React, { useState, useContext } from "react";
import axios from "../../../axiosConfig";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import About from "../../About/AboutPage";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import { AppState } from "../../../App";

//This Login component handles user login by capturing the email and password input, validating the form, submitting the data to the server, and managing the response. It uses useRef to access form field values, useNavigate to handle navigation, and axios to make HTTP requests. If the login is successful, the user is redirected to the home page; if there is an error, it is displayed to the user.

function Login() {
  //  const [isSignUp, setIsSignUp] = useState(true);
  // const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  // Initializes the navigate function
  const navigate = useNavigate();
  //Creates a reference to the email and Password input field and allowing you to access its value directly.
  const userEmail = useRef();
  const userPassword = useRef();
  const { login } = useContext(AppState);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //handle form submission.
  async function handleSubmit(e) {
    e.preventDefault();
    //Retrieves the current value of the email & Password input field.
    const userEmailValue = userEmail.current.value;
    const userPasswordValue = userPassword.current.value;
    //Checks if either the email or password fields are empty.
    if (!userEmailValue || !userPasswordValue) {
      setError("Please provide all required fields!");
      return; // Stops further execution if validation fails
    }

    try {
      //Sends a POST request to the /user/login endpoint with the email and password. The await keyword pauses execution until the request completes.
      const { data } = await axios.post("/user/login", {
        email: userEmailValue,
        password: userPasswordValue,
      });
      //Stores the token received from the server in local storage for authentication purposes.
      localStorage.setItem("token", data.token);
      // Update the context with login state
      login({ username: userEmailValue });
      //Redirects the user to the home page after a successful login
      navigate("/");

      //to handle any errors that occur during the HTTP request.
    } catch (error) {
      if (error.response) {
        if (
          error.response.data.message ===
          "We can not find an account with this email address"
        ) {
          setError("We can not find an account with this email address");
        } else if (error.response.data.message === "Invalid password") {
          setError("Invalid password!");
        } else {
          setError(error.response.data.msg);
        }
      } else {
        setError("An unexpected error occurred.");
      }
      console.log(error.response?.data?.msg || error.message);
    }
  }

  return (
    <>
      <Header />
      <br />
      <section className={classes.loginContanier}>
        <div className="container px-md-5">
          <div className="row">
            <div className="col-12 col-md-5 shadow auth mx-md-4 ">
              <div className={classes.login_inner}>
                <div className={classes.Carousel_inner}>
                  <div className="carousel-item active">
                    <h5>Login to your account</h5>
                    <div>
                      Don't have an account?
                      <span>
                        <Link to={"/register"}>Create a new account</Link>
                      </span>
                    </div>
                    <br />

                    {error && <p className={classes.error}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                      <div className={classes.from_input}>
                        <input
                          type="Email"
                          placeholder="Email"
                          ref={userEmail}
                        />
                        {/* {error && (
                          <span style={{ color: "red" }}>{error}</span>
                        )} */}
                      </div>
                      <br />
                      <div
                        className={`${classes.from_input} ${classes.password}`}
                      >
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          ref={userPassword}
                        />
                        <span
                          className={classes.password_toggle}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <FiEye />
                          ) : (
                            <FiEyeOff classNAme={classes.passHash} />
                          )}
                        </span>
                        {/* {error && (
                          <span style={{ color: "red" }}>{error}</span>
                        )} */}
                      </div>

                      <div className={classes.forget}>
                        <Link to={"/login"}>Forgot password</Link>
                      </div>
                      <div className={classes.btn}>
                        <button type="submit">Login</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 ">
              <About />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
export default Login;
