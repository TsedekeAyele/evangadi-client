import React, { useRef, useContext, useState } from "react";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { AppState } from "../../../App";
import axios from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import classes from "./AskQuestionPage.module.css";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";

function AskQuestionPage() {
  const { user } = useContext(AppState);
  const userid = user.userid;
  // console.log(userid);
  const navigate = useNavigate();
  const titleDom = useRef();
  const detailDom = useRef();

  // error and success handling states
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handle(e) {
    e.preventDefault();
    const titleValue = titleDom?.current?.value;
    const detailValue = detailDom?.current?.value;

    // Reset messages
    setErrorMessage("");
    setSuccessMessage("");

    if (!titleValue || !detailValue) {
      setErrorMessage("Please provide all required fields!");
      return;
    }

    if (titleValue.length > 50) {
      setErrorMessage("The title can not exceed 50 characters!");
      return;
    }

    if (detailValue.length > 200) {
      setErrorMessage("The description can not exceed 200 characters!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.post(
        "/question",
        { userid: userid, title: titleValue, description: detailValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Question posted successfully! Redirecting...");
      setTimeout(() => navigate("/"), 2000); // Redirects after 2 seconds
      // navigate("/");
    } catch (error) {
      alert("Something went wrong");
      console.error(error.response ? error.response.data : error.message);
    }
  }

  return (
    <>
      <Header />
      <section className={classes.back}>
        <div>
          <h3 className={classes.step}>Steps To Write A Good Question</h3>
        </div>
        <div className={classes.points}>
          <p>
            <BsArrowRightCircleFill className={classes.icon} />
            Summarize your problems in a one-line title.
          </p>
          <p>
            <BsArrowRightCircleFill className={classes.icon} />
            Describe your problem in more detail
          </p>
          <p>
            <BsArrowRightCircleFill className={classes.icon} />
            Describe what you tried and what you expected to happen.
          </p>
          <p>
            <BsArrowRightCircleFill className={classes.icon} />
            Review your question and post it here.
          </p>
          <div className={classes.question_container}>
            <h3 className={classes.post}>Ask a public question</h3>
            <div className={classes.span}>
              <span>Go to Question page</span>
            </div>
            <form onSubmit={handle} className="detali-txt">
              <input
                type="text"
                placeholder="Question title"
                ref={titleDom}
                className={classes.title}
              />
              <br />
              <input
                type="text"
                placeholder="Question detail..."
                ref={detailDom}
                className={classes.detail}
              />
              <div className={classes.buttonContainer}>
                <button className={classes.sub}>Post Your Question</button>
              </div>
              {errorMessage && (
                <p className={classes.error_message}>{errorMessage}</p>
              )}
              {successMessage && (
                <p className={classes.success_message}>{successMessage}</p>
              )}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default AskQuestionPage;
