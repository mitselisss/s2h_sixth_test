import React, { useState, useEffect } from "react";
import "./aboutPage.css";
import SideBar from "../components/sideBar.js";
import Footer from "../components/footer.js";
import image from "../images/graphics/STH - LOGO.png";
import backgroundImage from "../images/graphics/about2.jpg";
import LogoutAfterInactivity from "../components/logoutAfterInactivity";
import { useTranslation } from "react-i18next";

function AboutPage() {
  const { t } = useTranslation();
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
  LogoutAfterInactivity();

  return (
    <div className="rightpart">
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover", // This will resize the image to cover the entire element
          backgroundRepeat: "no-repeat", // This will prevent the image from repeating
          backgroundPosition: "center", // This will position the image at the center of the element
        }}
      >
        <div className="parent-container">
          <div className="page-container">
            <SideBar />
            <div className="about-page">
              <img src={image} style={{ maxWidth: "100%", height: "auto" }} />

              <br></br>
              <br></br>
              <br></br>
              <p className="about-font">
                <p>{t("about_1")}</p>
                <p>{t("about_2")}</p>
                <p>{t("about_3")}</p>
                <p>{t("about_4")}</p>
                <p>{t("about_5")}</p>
                <p>
                  {t("about_6")}
                  <a href="http://switchtohealthy.eu/">
                    {""} http://switchtohealthy.eu/
                  </a>
                  .
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>
      {!isMobile && <Footer />}{" "}
    </div>
  );
}

export default AboutPage;

{
  /* <div class="row gx-5 align-items-center">
                    <div class="col-lg-6">
                        <img class="img-fluid rounded mb-5 mb-lg-0" src="images/resource-01.PNG" alt="vegetables" width="694" height="423">
                    </div>
                    <div class="col-lg-6">
                        <h2 class="fw-bolder">Welcome to SWITCHtoHEALTHY</h2>
                        <p>In the Mediterranean countries profound changes in diet are taking place, largely due to cultural and socio-economic changes in lifestyle, which are leading to the erosion of the Mediterranean food cultures. The diet modernization process is noticeable; it has generated not only a modification of food choices in the direction of unhealthy foods, but also the habit of sedentary behaviours leading to an imbalance between energy intake and consumption. All of this has negative health impacts, as shown by the ever-increasing prevalence of overweight and obesity, as well as the rise of chronic diet-related diseases. The SWITCHtoHEALTHY project aims to generate an overall change of approach to the modern problem of eating behaviours, by strengthening the role of families towards the promotion of the sustainable Mediterranean food model. The main goal is to generate an actual switch to healthier dietary models, that are more consistent with the Mediterranean Diet.</p>
                    </div>
                </div> */
}
