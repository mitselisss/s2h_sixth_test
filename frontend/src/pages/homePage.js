import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import SideBar from "../components/sideBar";
import Footer from "../components/footer.js";
import "bootstrap/dist/css/bootstrap.css";
import "./homePage.css";
import "../components/sideBar.css";
import "../components/calendar.css";
import backgroundImage from "../images/homePage/food-4k-1vrcb0mw76zcg4qf.jpg";
import { useTranslation } from "react-i18next";
import LogoutAfterInactivity from "../components/logoutAfterInactivity";

function HomePage() {
  const [NPs, setNPs] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedDish, setSelectedDish] = useState(null);
  const [weekList, setWeekList] = useState([]);
  const [weekCount, setWeekCount] = useState();
  const [loading, setLoading] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const [week, setWeek] = useState();
  const [startDate, setStartDate] = useState();
  const [formattedStartDate, setFormattedStartDate] = useState();
  const [formattedEndDate, setFormattedEndDate] = useState();
  const [successMessage, setSuccessMessage] = useState("");
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
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  const days = [1, 2, 3, 4, 5, 6, 7];

  const dayMap = {
    1: t("Monday"),
    2: t("Tuesday"),
    3: t("Wednesday"),
    4: t("Thursday"),
    5: t("Friday"),
    6: t("Saturday"),
    7: t("Sunday"),
  };

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

  // Calculate the date of the Monday and Sunday
  const monday = new Date(today);
  const sunday = new Date(today);
  const nextMonday = new Date(today);
  const nextSunday = new Date(today);
  monday.setDate(today.getDate() - currentDayOfWeek + 1);
  sunday.setDate(today.getDate() - currentDayOfWeek + 7);
  nextMonday.setDate(today.getDate() - currentDayOfWeek + 8);
  nextSunday.setDate(today.getDate() - currentDayOfWeek + 14);

  // Format the Monday and Sunday date
  const m_year = monday.getFullYear();
  const m_month = String(monday.getMonth() + 1).padStart(2, "0");
  const m_day = String(monday.getDate()).padStart(2, "0");

  const s_year = sunday.getFullYear();
  const s_month = String(sunday.getMonth() + 1).padStart(2, "0");
  const s_day = String(sunday.getDate()).padStart(2, "0");

  const nm_year = nextMonday.getFullYear();
  const nm_month = String(nextMonday.getMonth() + 1).padStart(2, "0");
  const nm_day = String(nextMonday.getDate()).padStart(2, "0");

  const ns_year = nextSunday.getFullYear();
  const ns_month = String(nextSunday.getMonth() + 1).padStart(2, "0");
  const ns_day = String(nextSunday.getDate()).padStart(2, "0");

  const formattedMonday = `${m_year}-${m_month}-${m_day}`;
  const formattedSunday = `${s_year}-${s_month}-${s_day}`;
  const formattedNextMonday = `${nm_year}-${nm_month}-${nm_day}`;
  const formattedNextSunday = `${ns_year}-${ns_month}-${ns_day}`;

  // const formattedMonday = "2023-08-18";

  //console.log(formattedDate); // Output: "2023-06-12" (for example)
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

  useEffect(() => {
    const fetchData = async () => {
      if (user == null) {
        navigate("/");
      } else {
        if (location.state && location.state.successMessage) {
          setSuccessMessage(location.state.successMessage);
          setTimeout(() => {
            setSuccessMessage("");
          }, 10000); // Hide the success message after 10 seconds
        }
        setSelectedDay(currentDayOfWeek === 0 ? 7 : currentDayOfWeek);

        setLoading(true);
        try {
          const response = await axios.get(
            `${user.user_id}/${formattedMonday}/getCurrentWeekNPs`
          );
          //console.log(response.data);
          if (response.data.length === 0) {
            try {
              const createResponse = await axios.get(
                `${user.user_id}/${formattedMonday}/${formattedSunday}/createNPs`
              );
              setNPs(createResponse.data);
              setWeek(createResponse.data[0].week);
              var mondayParts = response.data[0].start_date
                .substring(0, 10)
                .split("-");
              var monday_year = mondayParts[0];
              var monday_month = mondayParts[1];
              var monday_day = mondayParts[2];
              setFormattedStartDate(
                monday_day + "/" + monday_month + "/" + monday_year
              );
              var sundayParts = response.data[0].end_date
                .substring(0, 10)
                .split("-");
              var sunday_year = sundayParts[0];
              var sunday_month = sundayParts[1];
              var sunday_day = sundayParts[2];
              setFormattedEndDate(
                sunday_day + "/" + sunday_month + "/" + sunday_year
              );
            } catch (error) {
              console.error(error);
            }
          } else {
            setNPs(response.data);
            setWeek(response.data[0].week);
            var mondayParts = response.data[0].start_date
              .substring(0, 10)
              .split("-");
            var monday_year = mondayParts[0];
            var monday_month = mondayParts[1];
            var monday_day = mondayParts[2];
            setFormattedStartDate(
              monday_day + "/" + monday_month + "/" + monday_year
            );
            var sundayParts = response.data[0].end_date
              .substring(0, 10)
              .split("-");
            var sunday_year = sundayParts[0];
            var sunday_month = sundayParts[1];
            var sunday_day = sundayParts[2];
            setFormattedEndDate(
              sunday_day + "/" + sunday_month + "/" + sunday_year
            );
          }
        } catch (error) {
          console.error(error);
        }

        try {
          const nextMondayresponse = await axios.get(
            `${user.user_id}/${formattedNextMonday}/getCurrentWeekNPs`
          );
          if (nextMondayresponse.data.length === 0) {
            try {
              const createNextMondayResponse = await axios.get(
                `${user.user_id}/${formattedNextMonday}/${formattedNextSunday}/createNPs`
              );
            } catch (error) {
              console.error(error);
            }
          } else {
          }
        } catch (error) {
          console.error(error);
        }

        try {
          const getWeeksresponse = await axios.get(`${user.user_id}/getWeeks`);
          //console.log(getWeeksresponse.data.week_list);
          //console.log(getWeeksresponse.data.week_count);
          setWeekList(getWeeksresponse.data.week_list);
          setWeekCount(getWeeksresponse.data.week_count);
        } catch (error) {
          console.error(error);
        }

        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getNextWeekNPs = async (userId, week) => {
    try {
      setLoading(true);
      const response = await axios.get(`${userId}/${week}/getNextWeekNPs`);
      setNPs(response.data);
      setWeek(response.data[0].week);
      var mondayParts = response.data[0].start_date.substring(0, 10).split("-");
      var monday_year = mondayParts[0];
      var monday_month = mondayParts[1];
      var monday_day = mondayParts[2];
      setFormattedStartDate(
        monday_day + "/" + monday_month + "/" + monday_year
      );
      var sundayParts = response.data[0].end_date.substring(0, 10).split("-");
      var sunday_year = sundayParts[0];
      var sunday_month = sundayParts[1];
      var sunday_day = sundayParts[2];
      setFormattedEndDate(sunday_day + "/" + sunday_month + "/" + sunday_year);

      if (response.data.length === 0) {
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextWeek = () => {
    //console.log(week);
    getNextWeekNPs(user.user_id, week);
  };

  const getPreviousWeekNPs = async (userId, week) => {
    try {
      setLoading(true);
      const response = await axios.get(`${userId}/${week}/getPreviousWeekNPs`);
      setNPs(response.data);
      setWeek(response.data[0].week);
      var mondayParts = response.data[0].start_date.substring(0, 10).split("-");
      var monday_year = mondayParts[0];
      var monday_month = mondayParts[1];
      var monday_day = mondayParts[2];
      setFormattedStartDate(
        monday_day + "/" + monday_month + "/" + monday_year
      );
      var sundayParts = response.data[0].end_date.substring(0, 10).split("-");
      var sunday_year = sundayParts[0];
      var sunday_month = sundayParts[1];
      var sunday_day = sundayParts[2];
      setFormattedEndDate(sunday_day + "/" + sunday_month + "/" + sunday_year);

      if (response.data.length === 0) {
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePreviousWeek = () => {
    //console.log(week);
    getPreviousWeekNPs(user.user_id, week);
  };

  const handleDishClick = (dish) => {
    setSelectedDish(dish);

    if (isMobile) {
      // Scroll to the meal-grid-right section
      window.scrollTo({
        top: document.querySelector(".meal-grid-right").offsetTop,
        behavior: "smooth",
      });
    }
  };

  // const handleDishClick = (dish) => {
  //   setSelectedDish(dish);
  //   window.scrollTo({
  //     top: document.querySelector(".meal-grid-right").offsetTop,
  //     behavior: "smooth",
  //   });
  // };

  LogoutAfterInactivity();

  return (
    <div className="parent-container">
      <div className="page-container">
        <SideBar />

        <div className="rightpart">
          {loading && (
            <div class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">{t("Loading")}...</span>
              </div>
            </div>
          )}
          <div
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}
            </div>
            <div className="calendar">
              <div className="container">
                <div className="row justify-content-md-center">
                  <div className="controls">
                    <div className="col-md-auto ">
                      <button
                        className="previousweek"
                        onClick={handlePreviousWeek}
                        disabled={week === 1}
                      ></button>
                    </div>
                    <div className="col-md-auto">
                      <div className="formatted-day">
                        <h1 className="formatted-days-font">
                          {formattedStartDate} - {formattedEndDate}
                        </h1>
                      </div>
                    </div>
                    <div className="col-md-auto">
                      <button
                        className="nextweek"
                        onClick={handleNextWeek}
                      ></button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="days">
                {days.map((day) => (
                  <div
                    className={`day ${selectedDay === day ? "selected" : ""}`}
                    key={day}
                    onClick={() => setSelectedDay(day)}
                  >
                    <h1
                      className={`custom-font ${
                        window.innerWidth <= 768 ? "mobile-day" : ""
                      }`}
                    >
                      {window.innerWidth <= 768 ? dayMap[day][0] : dayMap[day]}
                    </h1>
                  </div>
                ))}
                {/* {days.map((day) => (
                  <div
                    className={`day ${selectedDay === day ? "selected" : ""}`}
                    key={day}
                    onClick={() => setSelectedDay(day)}
                  >
                    <h1 className="custom-font">{dayMap[day][0]}</h1>{" "}
                  </div>
                ))} */}

                {/* {days.map((day) => (
                  <div
                    className={`day ${selectedDay === day ? "selected" : ""}`}
                    key={day}
                    onClick={() => setSelectedDay(day)}
                  >
                    <h1 className="custom-font">{dayMap[day]}</h1>
                  </div>
                ))} */}
              </div>
            </div>
            <br></br>

            <div className="meal-grid">
              <div className="meal-grid-left">
                {NPs.map((np) => {
                  //console.log("np.day:", np.day);
                  //console.log("day:", selectedDay);

                  if (np.day === selectedDay) {
                    //console.log("Condition is satisfied for np:", np);

                    return np.meals.map((meal) => {
                      //console.log("meal.id", meal.id);
                      //console.log("meal.type", meal.type);

                      return (
                        <div key={`${np.day}-${np.id}-${meal.id}`}>
                          <p className="meal-type-font">{t(`${meal.type}`)}</p>
                          {meal.dish_1 && (
                            <p
                              onClick={() => handleDishClick(meal.dish_1)}
                              className="dish-font-grid"
                            >
                              <div
                                className={`sth ${
                                  selectedDish === meal.dish_1 ? "selected" : ""
                                }`}
                              >
                                {meal.dish_1.dish_language_info[0].name}
                                <span style={{ float: "right" }}>
                                  {t("kcal")}: {meal.dish_1.kcal},{" "}
                                  {t("protein")}: {meal.dish_1.protein} g,{" "}
                                  {t("fat")}: {meal.dish_1.fat} g, {t("carbs")}:{" "}
                                  {meal.dish_1.carbohydrates} g
                                </span>
                              </div>
                            </p>
                          )}
                          {meal.dish_2 && (
                            <p
                              onClick={() => handleDishClick(meal.dish_2)}
                              className="dish-font-grid"
                            >
                              <div
                                className={`sth ${
                                  selectedDish === meal.dish_2 ? "selected" : ""
                                }`}
                              >
                                {meal.dish_2.dish_language_info[0].name}
                                <span style={{ float: "right" }}>
                                  {t("kcal")}: {meal.dish_2.kcal},{" "}
                                  {t("protein")}: {meal.dish_2.protein} g,{" "}
                                  {t("fat")}: {meal.dish_2.fat} g, {t("carbs")}:{" "}
                                  {meal.dish_2.carbohydrates} g
                                </span>
                              </div>
                            </p>
                          )}
                          {meal.dish_3 && (
                            <p
                              onClick={() => handleDishClick(meal.dish_3)}
                              className="dish-font-grid"
                            >
                              <div
                                className={`sth ${
                                  selectedDish === meal.dish_3 ? "selected" : ""
                                }`}
                              >
                                {meal.dish_3.dish_language_info[0].name}
                                <span style={{ float: "right" }}>
                                  {t("kcal")}: {meal.dish_3.kcal},{" "}
                                  {t("protein")}: {meal.dish_3.protein} g,{" "}
                                  {t("fat")}: {meal.dish_3.fat} g, {t("carbs")}:{" "}
                                  {meal.dish_3.carbohydrates} g
                                </span>
                              </div>
                            </p>
                          )}
                          {meal.dish_4 && (
                            <p
                              onClick={() => handleDishClick(meal.dish_4)}
                              className="dish-font-grid"
                            >
                              <div
                                className={`sth ${
                                  selectedDish === meal.dish_4 ? "selected" : ""
                                }`}
                              >
                                {meal.dish_4.dish_language_info[0].name}
                                <span style={{ float: "right" }}>
                                  {t("kcal")}: {meal.dish_4.kcal},{" "}
                                  {t("protein")}: {meal.dish_4.protein} g,{" "}
                                  {t("fat")}: {meal.dish_4.fat} g, {t("carbs")}:{" "}
                                  {meal.dish_4.carbohydrates} g
                                </span>
                              </div>
                            </p>
                          )}
                          {meal.dish_5 && (
                            <p
                              onClick={() => handleDishClick(meal.dish_5)}
                              className="dish-font-grid"
                            >
                              <div
                                className={`sth ${
                                  selectedDish === meal.dish_5 ? "selected" : ""
                                }`}
                              >
                                {meal.dish_5.dish_language_info[0].name}
                                <span style={{ float: "right" }}>
                                  {t("kcal")}: {meal.dish_5.kcal},{" "}
                                  {t("protein")}: {meal.dish_5.protein} g,{" "}
                                  {t("fat")}: {meal.dish_5.fat} g, {t("carbs")}:{" "}
                                  {meal.dish_5.carbohydrates} g
                                </span>
                              </div>
                            </p>
                          )}
                        </div>
                      );
                    });
                  } // else {
                  //   console.log("Condition is not satisfied for np:", np);
                  // }
                })}
              </div>
              <div className="meal-grid-right">
                {selectedDish && (
                  <>
                    <p className="dish-name-font">
                      {selectedDish.dish_language_info[0].name}
                    </p>
                    <br></br>
                    <div>
                      {selectedDish.dish_language_info[0].ingredients_adult && (
                        <div>
                          <p className="custom-font2">
                            {t("Ingredients_for_an_adult")}:
                          </p>
                          <ul>
                            {selectedDish.dish_language_info[0].ingredients_adult
                              .split(";")
                              .filter((item) => item.trim() !== "") // Filter out empty strings
                              .map((item, index) => {
                                const [ingredient, quantity, measure] = item
                                  .split(",")
                                  .map((part) => part.trim());
                                return (
                                  <li className="custom-font" key={index}>
                                    {ingredient}, {quantity} {measure}
                                    {/* Renders each item with space */}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      )}
                    </div>
                    <br></br>
                    <div>
                      {selectedDish.dish_language_info[0].recipe !== "nan" && (
                        <div>
                          <p className="custom-font2">{t("Recipe")}:</p>
                          <p className="custom-font">
                            {selectedDish.dish_language_info[0].recipe}
                          </p>
                        </div>
                      )}
                    </div>
                    <br></br>
                    <div>
                      {selectedDish.dish_language_info[0].tip !== "nan" && (
                        <div>
                          <p className="custom-font2">{t("Recipe")}:</p>
                          <p className="custom-font">
                            {selectedDish.dish_language_info[0].tip}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <br></br>
          </div>
          {!isMobile && <Footer />}{" "}
          {/* Render Footer only if isMobile is false */}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
