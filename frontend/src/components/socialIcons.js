import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import "../components/socialIcons.css";
import { useTranslation } from "react-i18next";

const SocialIcons = () => {
  const { t } = useTranslation();
  return (
    <div className="social-icons">
      <p className="custom-font">
        {t("Find_us_on")}: {""}
        <a
          href="https://switchtohealthy.eu/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faLink} bounce style={{ color: "#f3606f" }} />
        </a>
        <a
          href="https://www.youtube.com/@switchtohealthy6290"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faYoutube}
            bounce
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
            bounce
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
            bounce
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
            bounce
            style={{ color: "#28ffff" }}
          />
        </a>
        {/* <a href="https://switchtohealthy.eu/index.html">
              <img src={logo} className="s2h-logo" alt="logo" />
            </a> */}
      </p>
    </div>
  );
};

export default SocialIcons;
