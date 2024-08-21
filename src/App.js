// Imports React hooks. useState is used to manage state, and useEffect is used to perform side effects (e.g., data fetching).
import React, { useEffect, useState } from "react";

//import Route for defining paths and components,Routes for grouping routes, and useNavigate for programmatic navigation.
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Home/Login/Login";
import Register from "./pages/Home/SignIn&SIgnUp/Register.jsx";
// Imports an instance of axios (a library for making HTTP requests) configured with your settings.
import axios from "./axiosConfig.jsx";

//Imports createContext to create a context for state management.
import { createContext } from "react";
// import QuestionAndAnswer from "./pages/QuestionAndAnswer.jsx";
import AskQuestionPage from "./pages/Home/AskQuestion/AskQuestionPage.jsx";
import QuestionAndAnswer from "./pages/Home/Question&Answer/QuestionAndAnswer.jsx";
// import SignUpSignInPage from "./pages/SignUpSignInPage.jsx";
import AboutPage from "./pages/About/AboutPage.jsx";
import Header from "./pages/Header/Header.jsx";
import Footer from "./pages/Footer/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

//provide and consume state throughout the application.
export const AppState = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Initializes state for the user object.
  const [user, setUser] = useState({});
  //Initializes the navigate function
  const navigate = useNavigate();
  //Retrieves the token from local storage, which used for authenticated requests.
  const token = localStorage.getItem("token");

  const login = (credentials) => {
    setIsLoggedIn(true);
    setUser(credentials.username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({});
    localStorage.removeItem("token");
    navigate("/login");
  };
  // to fetch user information.
  async function checkUser() {
    try {
      //Sends a GET request to /user/checkUser with the Authorization header containing the token
      const { data } = await axios.get("/user/checkUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //Updates the user state with the data received from the request.
      setUser(data);
      setIsLoggedIn(true);
      //Catches errors if the request fails. Logs the error response and redirects the user to the login page.
    } catch (error) {
      console.log(error.response);
      navigate("/login");
    }
  }

  //Calls the checkUser function when the component mounts & runs only once after the initial render.
  useEffect(() => {
    checkUser();
  }, [token]);
  return (
    //Provides the user and setUser available throughout the app.
    <AppState.Provider value={{ user, setUser, isLoggedIn, login, logout }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/question" element={<AskQuestionPage />} />
        <Route path="/question/:id" element={<QuestionAndAnswer />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </AppState.Provider>
  );
}

export default App;
