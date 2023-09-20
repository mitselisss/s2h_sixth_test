import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/logo/logowhite.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faBars } from "@fortawesome/free-solid-svg-icons";
import jwt_decode from "jwt-decode";
import "./sideBar.css";
import { useTranslation } from "react-i18next";
import Footer2 from "../components/footer2.js";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function SideBar() {
  const { t } = useTranslation();
  const location = useLocation();

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const Logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSidebarOpen(window.innerWidth > 768); // Automatically open the sidebar on larger screens
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="page-container">
      <div className="main-content">
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="logo-container">
            <Link to="/home">
              <img src={logo} style={{ maxWidth: "100%", height: "auto" }} />
            </Link>
          </div>
          <div className="menu-options-container">
            <hr></hr>
            <Link
              to="/home"
              className={`menu-option ${
                location.pathname === "/home" ? "selected" : ""
              }`}
            >
              <label className="custom-font3" style={{ cursor: "pointer" }}>
                {t("Home")}
              </label>
            </Link>
            <hr></hr>
            <Link
              to="/userProfile"
              className={`menu-option ${
                location.pathname === "/userProfile" ? "selected" : ""
              }`}
            >
              <label className="custom-font3" style={{ cursor: "pointer" }}>
                {t("User_Profile")}
              </label>
            </Link>
            <hr></hr>
            {/* <div>
                  <button onClick={toggleVisibility}>User Profile</button>
                </div> */}
            {/* <Link to="/stats" className="menu-option">
              <label className="custom-font3">{t("Charts")}</label>
            </Link> */}
            <div className="dropdown">
              <button
                className="btn btn-link dropdown-toggle"
                type="button"
                id="chartsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <label
                  className="custom-font3"
                  style={{ color: "#fff0ba", cursor: "pointer" }}
                >
                  {t("Charts")}
                </label>
              </button>
              <ul className="dropdown-menu" aria-labelledby="chartsDropdown">
                <li>
                  <Link to="/charts/weight" className="dropdown-item">
                    {t("Weight_History")}
                  </Link>
                </li>
                <li>
                  <Link to="/charts/fruits" className="dropdown-item">
                    {t("Fruits and Vegetables")}
                  </Link>
                </li>
                <li>
                  <Link to="/charts/energy" className="dropdown-item">
                    {t("Energy Intake")}
                  </Link>
                </li>
                <li>
                  <Link to="/charts/micronutrients" className="dropdown-item">
                    {t("Macronutrients")}
                  </Link>
                </li>
              </ul>
            </div>
            <hr></hr>
            <Link
              to="/about"
              className={`menu-option ${
                location.pathname === "/about" ? "selected" : ""
              }`}
            >
              <label className="custom-font3" style={{ cursor: "pointer" }}>
                {t("About")}
              </label>
            </Link>
            <hr></hr>
            {/* <Link to="/" className="menu-option">
                  <label className="custom-font3">Other</label>
                </Link>
                <hr></hr> */}
            <Link
              to="/"
              className={`menu-option ${
                location.pathname === "/" ? "selected" : ""
              }`}
            >
              <div className="sign-out-button">
                <label className="custom-font3" style={{ cursor: "pointer" }}>
                  Logout
                </label>

                {/* <FontAwesomeIcon
                  icon={faDoorOpen}
                  size="1x"
                  onClick={Logout}
                  // onClick={() => alert("Signing out...")}
                /> */}
              </div>
            </Link>

            <hr></hr>
          </div>
          <div className="social-icons">
            <p className="custom-font">
              <a
                href="https://switchtohealthy.eu/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faLink}
                  beatFade
                  style={{ color: "#f3606f" }}
                />
              </a>
              <a
                href="https://www.youtube.com/@switchtohealthy6290"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faYoutube}
                  beatFade
                  style={{ color: "#ff0000" }}
                />
              </a>
              <a
                href="https://twitter.com/SWITCHtoHEALTH1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  beatFade
                  style={{ color: "#1DA1F2" }}
                />
              </a>
              <a
                href="https://www.linkedin.com/company/switch-to-healthy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  beatFade
                  style={{ color: "#0077B5" }}
                />
              </a>
              <a
                href="https://www.tiktok.com/@switchtohealthy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faTiktok}
                  className="tiktok-icon"
                  beatFade
                  style={{ color: "#28ffff" }}
                />
              </a>
            </p>
          </div>

          {isMobile && <Footer2 />}
        </div>
        <div
          className={`sidebar-toggle ${isSidebarOpen ? "open" : ""}`}
          onClick={toggleSidebar}
        >
          <div className="expand-sidebar">
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              size="2x"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SideBar;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import logo from "../images/logo/logowhite.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDoorOpen, faBars } from "@fortawesome/free-solid-svg-icons";
// import jwt_decode from "jwt-decode";
// import "./sideBar.css";

// import { faTwitter } from "@fortawesome/free-brands-svg-icons";
// import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
// import { faTiktok } from "@fortawesome/free-brands-svg-icons";

// function SideBar() {
//   const [authTokens, setAuthTokens] = useState(() =>
//     localStorage.getItem("authTokens")
//       ? JSON.parse(localStorage.getItem("authTokens"))
//       : null
//   );
//   const [user, setUser] = useState(() =>
//     localStorage.getItem("authTokens")
//       ? jwt_decode(localStorage.getItem("authTokens"))
//       : null
//   );

//   const Logout = () => {
//     setAuthTokens(null);
//     setUser(null);
//     localStorage.removeItem("authTokens");
//   };

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsSidebarOpen(true);
//       } else {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div className="page-container">
//       <div className="main-content">
//         <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
//           <div className="logo-container">
//             <Link to="/home">
//               <img src={logo} style={{ maxWidth: "100%", height: "auto" }} />
//             </Link>
//           </div>
//           <div className="menu-options-container">
//             <hr></hr>
//             <Link to="/home" className="menu-option">
//               <label className="custom-font3">Home</label>
//             </Link>
//             <hr></hr>
//             <Link to="/userProfile" className="menu-option">
//               <label className="custom-font3">User Profile</label>
//             </Link>
//             <hr></hr>
//             {/* <div>
//                   <button onClick={toggleVisibility}>User Profile</button>
//                 </div> */}
//             <Link to="/stats" className="menu-option">
//               <label className="custom-font3">Charts</label>
//             </Link>
//             <hr></hr>
//             <Link to="/about" className="menu-option">
//               <label className="custom-font3">About</label>
//             </Link>
//             <hr></hr>
//             {/* <Link to="/" className="menu-option">
//                   <label className="custom-font3">Other</label>
//                 </Link>
//                 <hr></hr> */}
//             <Link to="/" className="menu-option">
//               <div className="sign-out-button">
//                 <FontAwesomeIcon
//                   icon={faDoorOpen}
//                   size="2x"
//                   onClick={Logout}
//                   // onClick={() => alert("Signing out...")}
//                 />
//               </div>
//             </Link>

//             <hr></hr>
//           </div>
//           <div className="social-icons">
//             <p className="custom-font">
//               <a
//                 href="https://twitter.com/SWITCHtoHEALTH1"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FontAwesomeIcon
//                   icon={faTwitter}
//                   style={{ color: "#1DA1F2" }}
//                 />
//               </a>
//               <a
//                 href="https://www.linkedin.com/company/switch-to-healthy/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FontAwesomeIcon
//                   icon={faLinkedin}
//                   style={{ color: "#0077B5" }}
//                 />
//               </a>
//               <a
//                 href="https://www.tiktok.com/@switchtohealthy"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FontAwesomeIcon
//                   icon={faTiktok}
//                   className="tiktok-icon"
//                   style={{ color: "#28ffff" }}
//                 />
//               </a>
//             </p>
//           </div>
//         </div>
//         <div className="sidebar-toggle" onClick={toggleSidebar}>
//           <FontAwesomeIcon icon={faBars} size="2x" />
//         </div>
//       </div>
//     </div>
//   );
// }
// export default SideBar;
