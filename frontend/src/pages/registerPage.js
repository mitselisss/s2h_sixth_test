import React, { useState, useEffect } from "react";
import logo from "../images/logo/logo2.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Footer from "../components/footer.js";
import Footer2 from "../components/footer2.js";
import SocialIcons from "../components/socialIcons.js";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const GlobeIcon = ({ width = 24, height = 24 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      className="bi bi-globe-europe-africa"
      viewBox="0 0 16 16"
    >
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM3.668 2.501l-.288.646a.847.847 0 0 0 1.479.815l.245-.368a.809.809 0 0 1 1.034-.275.809.809 0 0 0 .724 0l.261-.13a1 1 0 0 1 .775-.05l.984.34c.078.028.16.044.243.054.784.093.855.377.694.801-.155.41-.616.617-1.035.487l-.01-.003C8.274 4.663 7.748 4.5 6 4.5 4.8 4.5 3.5 5.62 3.5 7c0 1.96.826 2.166 1.696 2.382.46.115.935.233 1.304.618.449.467.393 1.181.339 1.877C6.755 12.96 6.674 14 8.5 14c1.75 0 3-3.5 3-4.5 0-.262.208-.468.444-.7.396-.392.87-.86.556-1.8-.097-.291-.396-.568-.641-.756-.174-.133-.207-.396-.052-.551a.333.333 0 0 1 .42-.042l1.085.724c.11.072.255.058.348-.035.15-.15.415-.083.489.117.16.43.445 1.05.849 1.357L15 8A7 7 0 1 1 3.668 2.501Z" />
    </svg>
  );

  const languages = [
    {
      code: "en",
      name: "English",
      country_code: "gb",
    },

    {
      code: "fr",
      name: "Français",
      country_code: "fr",
    },
    {
      code: "es",
      name: "Español",
      country_code: "es",
    },

    {
      code: "tr",
      name: "Türkçe",
      country_code: "tr",
    },
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios
        .post("register", {
          username,
          email,
          password,
          password2,
        })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("authTokens", JSON.stringify(res.data));
            navigate("/rUserProfile", {
              state: {
                infoMessage: t("register_message"),
              },
            });
          }
        });
    } catch (error) {
      if (error.response.data.error === "Username already exist") {
        setErrorMessage(t("register_error_1"));
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Use "smooth" for smooth scrolling behavior
        });
      }
      if (error.response.data.error === "Email already exist") {
        setErrorMessage(t("register_error_4"));
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Use "smooth" for smooth scrolling behavior
        });
      }
      if (
        error.response.data.error ===
        "Passowrd and comfirm password do not match"
      ) {
        setErrorMessage(t("register_error_2"));
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Use "smooth" for smooth scrolling behavior
        });
      }
      if (
        error.response.data.error ===
        "Invalid password. Please check for the password validations"
      ) {
        setErrorMessage(t("register_error_3"));
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Use "smooth" for smooth scrolling behavior
        });
      }
    }

    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <div className="alert-container">
            {errorMessage && (
              <Alert variant="danger" style={{ width: 500 }}>
                {errorMessage}
              </Alert>
            )}
          </div>
          <img src={logo} className="Login-logo" alt="logo" />
          <div className="dropdown">
            <button
              className="btn btn-link dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <GlobeIcon />
            </button>
            <ul className="dropdown-menu">
              {languages.map(({ code, name, country_code }) => (
                <li key={country_code}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      i18next.changeLanguage(code);
                    }}
                  >
                    <span
                      className={`flag-icon flag-icon-${country_code} mx-2`}
                    ></span>

                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <br></br>
          <br></br>

          <h1 className="custom-font">{t("Hi!_Welcome")}</h1>
          <p className="custom-font">{t("Let's_create_an_account")}</p>

          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={t("Enter_your_username")}
                className="line-field"
                required
              />
            </div>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="line-field"
                required
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t("Enter_your_password")}
                className="line-field"
                required
              />
            </div>
            <small>
              <ul>
                <li>
                  <i>{t("password_message_1")}</i>
                </li>
                <li>
                  <i> {t("password_message_2")}</i>
                </li>
                <li>
                  <i> {t("password_message_3")}</i>
                </li>
                <li>
                  <i> {t("password_message_4")}</i>
                </li>
              </ul>
            </small>
            <div className="input-container">
              <input
                type="password"
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
                placeholder={t("Confirm_your_password")}
                className="line-field"
                required
              />
            </div>

            <div className="button-container">
              <input type="submit" value={t("Sign_Up")} className="button" />
            </div>

            <p className="custom-font">{t("Already_have_an_account?")}</p>
            <Link
              to="/"
              className="button-container"
              style={{ textDecoration: "none" }}
            >
              {t("Sign_In")}{" "}
            </Link>
          </form>
        </header>
        <SocialIcons />
      </div>
      {isMobile ? <Footer2 /> : <Footer />}
    </div>
  );
}

export default RegisterPage;
