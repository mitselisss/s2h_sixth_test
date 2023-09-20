import React from "react";
import "./footer.css";
import eu from "../images/footer/europe.png";
import prima from "../images/footer/prima-logo.jpg";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="footer">
      <div className="images-container">
        <img src={eu} className="Footer-eu" alt="foot" />
        <div className="text-container">
          {t("Co-funded_by_the_European_Union")}
        </div>
      </div>
      <div className="images-container">
        <img src={prima} className="Footer-pr" alt="foot" />
        <div className="text-container">
          {t(
            "This_project_is_part_of_the_PRIMA_programme_supported_by_the_European_Union"
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
