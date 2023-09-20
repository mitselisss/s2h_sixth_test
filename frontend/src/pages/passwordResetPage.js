import React from "react";
import logo from "../images/logo/logo2.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer.js";
import Footer2 from "../components/footer2.js";
import SocialIcons from "../components/socialIcons.js";
import { useTranslation } from "react-i18next";

function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email");
    } else {
      // send password reset link
      setErrorMessage("");
    }
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { t } = useTranslation();

  return (
    <div classname="App">
      <header className="App-header">
        <form>
          <img src={logo} className="Forgot-logo" alt="logo" />
          <div className="password-reset-page">
            <h1 className="custom-font">{t("Oh_no,_I_forgot!")}</h1>
            <p className="custom-font">
              {t(
                "Enter_your_email_and_we’ll_send_you_a_link_to_set_a_new_password"
              )}{" "}
            </p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleFormSubmit}>
              <input
                type="email"
                name="uname"
                required
                value={email}
                onChange={handleInputChange}
                placeholder={t("Enter_your_email")}
                className="line-field"
              />
              <Link to="/" className="button-container">
                <div className="button-container">
                  <input
                    type="submit"
                    value={t("Reset_password")}
                    class="button"
                  />
                </div>
              </Link>

              <h2 className="custom-font">{t("Don't_have_an_account?")}</h2>
            </form>
          </div>
        </form>
        <Link to="/register" className="button-container">
          {t("Sign_Up")}
        </Link>
      </header>
      <SocialIcons />
      <br></br>
      <br></br>
      {isMobile ? <Footer2 /> : <Footer />}
    </div>
  );
}

export default PasswordResetPage;
