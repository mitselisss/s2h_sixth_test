import React from "react";
import "./footer2.css";
import eu from "../images/footer/europe.png";
import prima from "../images/footer/prima-logo.jpg";
import { useTranslation } from "react-i18next";

const Footer2 = () => {
  const { t } = useTranslation();
  return (
    <div className="footer2">
      <div className="images-container2">
        <img src={eu} className="Footer-eu" alt="foot" />
        <img src={prima} className="Footer-pr" alt="foot" />
        <div className="text-container2">
          {t(
            "This project is part of the PRIMA programme supported by the European Union"
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer2;
