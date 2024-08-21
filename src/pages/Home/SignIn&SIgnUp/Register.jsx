//to make HTTP requests with the base URL from axiosConfig.js
import axios from "../../../axiosConfig";
//to create components.
import React, { useState } from "react";
//Imports the useRef hook, which is used to access DOM elements directly.
import { useRef } from "react";
//Imports Link for navigation between routes and useNavigate to programmatically navigate to different routes.
import { Link, useNavigate } from "react-router-dom";
import About from "../../About/AboutPage";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import classes from "./Register.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

//In summary, this code defines a registration form component that captures user input, validates it, and submits it to a server. If the registration is successful, it redirects the user to the login page.

function SignINSignUP() {
  const [showPassword, setShowPassword] = useState(false);
  // missing fields error handle
  const [errorFields, setErrorFields] = useState({
    email: false,
    firstName: false,
    lastName: false,
    username: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState(""); // Update the state name
  const [successMessage, setSuccessMessage] = useState("");
  const [misfield, setMisfield] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Initializes the navigate function to redirecting users to the login page after successful registration
  const navigate = useNavigate();

  // Creates references for the email, first name, last name, username, and password input fields and to directly access the DOM element's value.
  const userEmail = useRef(null);
  const userFirstName = useRef(null);
  const userLastName = useRef(null);
  const userName = useRef(null);
  const userPassword = useRef(null);

  //to handle form submission.
  async function handleSubmit(e) {
    //Prevents the default form submission behavior to validating input or sending data to a server
    e.preventDefault();
    //Retrieves the current value of the email,FirstName,LastName,userName &Password input field.
    const userEmailValue = userEmail.current.value;
    const userFirstNameValue = userFirstName.current.value;
    const userLastNameValue = userLastName.current.value;
    const userNameValue = userName.current.value;
    const userPasswordValue = userPassword.current.value;

    // Validate fields and set error state
    setErrorFields({
      email: !userEmailValue,
      firstName: !userFirstNameValue,
      lastName: !userLastNameValue,
      username: !userNameValue,
      password: !userPasswordValue,
    });

    //Checks if any of the form fields are empty
    if (
      !userEmailValue ||
      !userFirstNameValue ||
      !userLastNameValue ||
      !userNameValue ||
      !userPasswordValue
    ) {
      setMisfield("Please provide all required fields!");
      return; //Stops further execution if validation fails
    }
    // try to submit data to the server and handle any errors that occur during the request
    try {
      //Sends a POST request to the /user/register endpoint with the form data.
      await axios.post("/user/register", {
        email: userEmailValue,
        first_name: userFirstNameValue,
        last_name: userLastNameValue,
        username: userNameValue,
        password: userPasswordValue,
      });
      setSuccessMessage("Register successful! Redirecting...");
      setErrorMessage(); //clear any error message
      setMisfield(); // clear any misfield error

      setTimeout(() => navigate("/login"), 2000); // Redirects after 2 seconds

      // // Redirects the user to the login page.
      // navigate("/login");

      //to handle errors if the request fails.
    } catch (error) {
      if (error.response) {
        // Check if the error is due to existing user or short password
        if (error.response.data.message === "User already existed") {
          setErrorMessage("User already existed!");
          setMisfield(""); //  clear pervious error messag
        } else if (
          error.response.data.message ===
          "Password must be at least 8 characters"
        ) {
          setErrorMessage("Password must be at least 8 characters!");
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.log(error.response); //Logs the error response from the server.
      console.log(error.message);
    }
  }

  return (
    <>
      <Header />
      <section className={classes.register_contanier}>
        <div className="container px-md-5">
          <div className="row">
            <div className="col-12 col-md-5 shadow auth mx-md-4 ">
              <div className={classes.login_inner}>
                <div className={classes.Carousel_inner}>
                  <div className="carousel-item active">
                    <h5>Join the network</h5>
                    <div>
                      Already have an account?
                      <span>
                        <Link to={"/login"}>Sign in</Link>
                      </span>
                    </div>
                    <br />
                    {/* missing fields controller */}
                    {misfield && <p className={classes.misfield}>{misfield}</p>}
                    {/* existing user or password error handler */}
                    {errorMessage && (
                      <p className={classes.errorMessage}>{errorMessage}</p>
                    )}{" "}
                    {/* Display error messages */}
                    <form onSubmit={handleSubmit}>
                      <div className={classes.from_input}>
                        <input
                          type="Email"
                          placeholder="Email"
                          ref={userEmail}
                          style={{
                            backgroundColor: errorFields.email ? "#FEE6E6" : "",
                          }}
                        />
                      </div>
                      <br />
                      <div className={classes.fNlN}>
                        <div className={classes.from_input}>
                          <input
                            type="text"
                            placeholder="Firstname"
                            ref={userFirstName}
                            style={{
                              backgroundColor: errorFields.firstName
                                ? "#FEE6E6"
                                : "",
                            }}
                          />
                        </div>
                        <br />
                        <div className={classes.from_input}>
                          <input
                            type="text"
                            placeholder="lastname"
                            ref={userLastName}
                            style={{
                              backgroundColor: errorFields.lastName
                                ? "#FEE6E6"
                                : "",
                            }}
                          />
                        </div>
                      </div>
                      <br />
                      <div className={classes.from_input}>
                        <input
                          type="text"
                          placeholder="username"
                          ref={userName}
                          style={{
                            backgroundColor: errorFields.username
                              ? "#FEE6E6"
                              : "",
                          }}
                        />
                      </div>
                      <br />
                      <div
                        className={`${classes.from_input} ${classes.password}`}
                      >
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          ref={userPassword}
                          style={{
                            backgroundColor: errorFields.password
                              ? "#FEE6E6"
                              : "",
                          }}
                        />
                        <span
                          className={classes.password_toggle}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FiEye /> : <FiEyeOff />}
                        </span>
                        {/* {error && (
                          <span style={{ color: "red" }}>{error}</span>
                        )} */}
                      </div>
                      <div className={classes.agreement}>
                        <p>
                          <span>
                            I agree to the <Link>Privacy Policy</Link>
                            and <Link>terms and service</Link>
                          </span>
                        </p>
                      </div>
                      <div className={classes.btn}>
                        <button type="submit">Agree and Join</button>
                      </div>
                    </form>
                    {/* sucess message handlers */}
                    {successMessage && (
                      <p className={classes.successMessage}>{successMessage}</p>
                    )}
                    <span>
                      <Link to={"/login"}>Already have an account ?</Link>
                    </span>
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

export default SignINSignUP;
