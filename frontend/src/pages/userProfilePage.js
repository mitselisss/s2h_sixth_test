import "./userProfilePage.css";
import SideBar from "../components/sideBar.js";
import Footer from "../components/footer.js";
import image from "../images/graphics/STH - LOGO.png";
import backgroundImage from "../images/graphics/about.jpg";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LogoutAfterInactivity from "../components/logoutAfterInactivity";

function UserProfilePage() {
  const [userProfile, setUserProfile] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [BMI, setBMI] = useState("");
  const [BMR, setBMR] = useState("");
  const [PAL, setPAL] = useState("");
  const [energyintake, setEnergyintake] = useState("");
  const [halal, setHalal] = useState(false);
  const [diary, setDiary] = useState(false);
  const [eggs, setEggs] = useState(false);
  const [fish, setFish] = useState(false);
  const [nuts, setNuts] = useState(false);
  const [country, setCountry] = useState("");
  const [spain, setSpain] = useState(false);
  const [turkey, setTurkey] = useState(false);
  const [morocco, setMorocco] = useState(false);
  const [countryLanguageCode, setCountryLanguageCode] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const [loading, setLoading] = useState();
  const { t } = useTranslation();

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

  const globe_languages = [
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

  const languages = {
    en: {
      name: t("English"),
    },
    fr: {
      name: t("French"),
    },
    sp: {
      name: t("Spanish"),
    },
    tr: {
      name: t("Turkish"),
    },
  };

  const navigate = useNavigate();
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

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

  // Calculate the date of the Monday and Sunday
  const monday = new Date(today);
  const sunday = new Date(today);
  const nextMonday = new Date(today);
  monday.setDate(today.getDate() - currentDayOfWeek + 1);
  sunday.setDate(today.getDate() - currentDayOfWeek + 7);
  nextMonday.setDate(today.getDate() - currentDayOfWeek + 8);

  // Format the Monday and Sunday date
  const m_year = monday.getFullYear();
  const m_month = String(monday.getMonth() + 1).padStart(2, "0");
  const m_day = String(monday.getDate()).padStart(2, "0");

  const s_year = monday.getFullYear();
  const s_month = String(sunday.getMonth() + 1).padStart(2, "0");
  const s_day = String(sunday.getDate()).padStart(2, "0");

  const nm_year = nextMonday.getFullYear();
  const nm_month = String(nextMonday.getMonth() + 1).padStart(2, "0");
  const nm_day = String(nextMonday.getDate()).padStart(2, "0");

  const formattedMonday = `${m_year}-${m_month}-${m_day}`;
  const formattedSunday = `${s_year}-${s_month}-${s_day}`;
  const formattedNextMonday = `${nm_year}-${nm_month}-${nm_day}`;

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

  useEffect(() => {
    if (user == null) {
      navigate("/");
    } else {
      (async () => {
        setLoading(true);
        const response = await axios.get("IdUserProfile/" + user.user_id + "/");
        //setUser(response.data.user);
        setUserProfile(response.data);
        setUsername(response.data.user.username);
        setEmail(response.data.user.email);
        setHeight(response.data.height);
        setWeight(response.data.weight);
        setGender(response.data.gender);
        setYearOfBirth(response.data.yob);
        setBMI(response.data.bmi);
        setBMR(response.data.bmr);
        setPAL(response.data.pal);
        setEnergyintake(response.data.energy_intake);
        setHalal(response.data.halal);
        setDiary(response.data.diary);
        setEggs(response.data.eggs);
        setFish(response.data.fish);
        setNuts(response.data.nuts);
        setCountry(response.data.country);
        setCountryLanguageCode(response.data.countryLanguageCode);
        setLoading(false);
      })();
    }
  }, []);

  useEffect(() => {
    handleCuisineLanguage();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Use "smooth" for smooth scrolling behavior
      });
      //console.log(userProfile);

      if (
        userProfile.gender != gender ||
        userProfile.height != height ||
        userProfile.weight != weight ||
        userProfile.yob != yearOfBirth ||
        userProfile.pal != PAL ||
        userProfile.halal != halal ||
        userProfile.diary != diary ||
        userProfile.eggs != eggs ||
        userProfile.fish != fish ||
        userProfile.nuts != nuts ||
        userProfile.country != country
      ) {
        if (window.confirm(t("profile_update_message"))) {
          const response1 = await axios.put(
            "IdUserProfile/" + user.user_id + "/",
            {
              height: height,
              weight: weight,
              gender: gender,
              yob: yearOfBirth,
              pal: PAL,
              halal: halal,
              diary: diary,
              eggs: eggs,
              fish: fish,
              nuts: nuts,
              country: country,
              countryLanguageCode: countryLanguageCode,
            }
          );
          const response2 = await axios.put(
            `${user.user_id}/${formattedMonday}/updateCurrentWeekNPs`
          );

          const response3 = await axios.put(
            `${user.user_id}/${formattedNextMonday}/updateCurrentWeekNPs`
          );

          setLoading(false);
          navigate("/home");
        } else {
          setLoading(false);
          navigate("/userProfile");
        }
      } else {
        const response1 = await axios.put(
          "IdUserProfile/" + user.user_id + "/",
          {
            height: height,
            weight: weight,
            gender: gender,
            yob: yearOfBirth,
            pal: PAL,
            halal: halal,
            diary: diary,
            eggs: eggs,
            fish: fish,
            nuts: nuts,
            country: country,
            countryLanguageCode: countryLanguageCode,
          }
        );
      }
    } catch (error) {
      console.error("Error saving username and password.", error);
    }
  };

  // Function to handle button click
  const handleCuisineLanguage = () => {
    // Perform action based on the selected country
    switch (country) {
      case "Spain":
        // Action for Spain cuisine
        setSpain(true);
        setTurkey(false);
        setMorocco(false);
        break;
      case "Turkey":
        // Action for Turkey cuisine
        setSpain(false);
        setTurkey(true);
        setMorocco(false);
        break;
      case "Morocco":
        // Action for Morocco cuisine
        setSpain(false);
        setTurkey(false);
        setMorocco(true);
        break;
    }
  };

  LogoutAfterInactivity();

  return (
    <div className="rightpart" style={{ height: "150%" }}>
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
          backgroundSize: "cover", // This will resize the image to cover the entire element
          backgroundRepeat: "no-repeat", // This will prevent the image from repeating
          backgroundPosition: "center", // This will position the image at the center of the element
        }}
      >
        <div>
          <div className="page-container">
            <SideBar />
            <div className="user-page">
              <img src={image} style={{ maxWidth: "100%", height: "auto" }} />
              <form onSubmit={handleSubmit}>
                <br></br>
                <br></br>
                <div className="user-profile-grid1">
                  <div>
                    <div className="user-profile-font">
                      {t("Personal_Info")}
                    </div>
                    <br></br>
                    <div className="user-font">
                      <u>{t("Username")}:</u>
                      <p>{username}</p>
                    </div>
                    <br></br>
                    <div className="user-font">
                      <u>{t("Email")}:</u>
                      <p>{email}</p>
                    </div>
                    <br></br>
                  </div>

                  <div>
                    <div className="user-profile-font">
                      {t("Physical_Characteristics")}
                    </div>
                    <br></br>
                    <div>
                      <label className="user-font">{t("Gender")}:</label>
                      <label style={{ display: "block" }}>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={gender === "male"}
                          onChange={(event) => {
                            setGender(event.target.value);
                            setChangesMade(true);
                          }}
                          className="user-font"
                          required
                        />{" "}
                        {t("Male")}
                      </label>
                      <label style={{ display: "block" }}>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={gender === "female"}
                          onChange={(event) => {
                            setGender(event.target.value);
                            setChangesMade(true);
                          }}
                          className="user-font"
                          required
                        />{" "}
                        {t("Female")}
                      </label>
                    </div>
                    <br></br>
                    <div>
                      <label className="user-font">{t("Year of Birth")}</label>
                      <input
                        type="number"
                        name="yearOfBirth"
                        value={yearOfBirth}
                        onChange={(event) => {
                          setYearOfBirth(event.target.value);
                          setChangesMade(true);
                        }}
                        className="upline-field"
                        min="1900"
                        max="2030"
                        required
                      />
                    </div>
                    <div>
                      <label className="user-font">{t("Height_(m)")}</label>
                      <input
                        type="number"
                        name="height"
                        value={height}
                        onChange={(event) => {
                          setHeight(event.target.value);
                          setChangesMade(true);
                        }}
                        className="upline-field"
                        min="0.00"
                        max="3.00"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="user-font">{t("Weight_(kg)")}</label>
                      <input
                        type="number"
                        name="weight"
                        value={weight}
                        onChange={(event) => {
                          setWeight(event.target.value);
                          setChangesMade(true);
                        }}
                        className="upline-field"
                        min="0"
                        max="999"
                        step="0.1"
                        required
                      />
                    </div>
                    <br></br>
                    <div>
                      <div className="user-font">
                        <p>
                          BMI: {BMI} <i>kg/m2</i>
                        </p>
                        <p>
                          BMR: {BMR} <i>kcal</i>
                        </p>
                      </div>
                    </div>
                    <br></br>
                    <div>
                      <label className="user-profile-font">
                        {t("Physical_Activity_Level_(PAL)")}:
                      </label>
                      <label style={{ display: "block" }}>
                        <input
                          type="radio"
                          name="PAL"
                          value="Sedentary"
                          checked={PAL === "Sedentary"}
                          onChange={(event) => {
                            setPAL(event.target.value);
                            setChangesMade(true);
                          }}
                          className="user-font"
                          required
                        />{" "}
                        {t("Sedentary")}
                      </label>
                      <label style={{ display: "block" }}>
                        <input
                          type="radio"
                          name="PAL"
                          value="Low active"
                          checked={PAL === "Low active"}
                          onChange={(event) => {
                            setPAL(event.target.value);
                            setChangesMade(true);
                          }}
                          className="user-font"
                          required
                        />{" "}
                        {t("Low_Active")}
                      </label>
                      <label style={{ display: "block" }}>
                        <input
                          type="radio"
                          name="PAL"
                          value="Active"
                          checked={PAL === "Active"}
                          onChange={(event) => {
                            setPAL(event.target.value);
                            setChangesMade(true);
                          }}
                          className="user-font"
                          required
                        />{" "}
                        {t("Active")}
                      </label>
                      <label style={{ display: "block" }}>
                        <input
                          type="radio"
                          name="PAL"
                          value="Very active"
                          checked={PAL === "Very active"}
                          onChange={(event) => {
                            setPAL(event.target.value);
                            setChangesMade(true);
                          }}
                          className="user-font"
                          required
                        />{" "}
                        {t("Very_Active_(Athlete)")}
                      </label>
                    </div>
                    <br></br>
                    <div className="user-font">
                      <p>
                        {t("Daily_Energy_Recuirements")}: {energyintake}{" "}
                        <i>{t("kcal")}</i>
                      </p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <label className="user-profile-font">
                          {t("Allergies")}
                        </label>
                      </div>
                      <br></br>
                      <div className="allergies-section">
                        <div className="checkbox-options">
                          <div>
                            <label>
                              <input
                                type="checkbox"
                                checked={diary}
                                onChange={(event) => {
                                  setDiary(!diary);
                                  setChangesMade(true);
                                }}
                              />{" "}
                              {t("Diary")}
                            </label>
                          </div>
                          <div>
                            <label>
                              <input
                                type="checkbox"
                                checked={eggs}
                                onChange={(event) => {
                                  setEggs(!eggs);
                                  setChangesMade(true);
                                }}
                              />{" "}
                              {t("Eggs")}
                            </label>
                          </div>
                          <div>
                            <label>
                              <input
                                type="checkbox"
                                checked={fish}
                                onChange={(event) => {
                                  setFish(!fish);
                                  setChangesMade(true);
                                }}
                              />{" "}
                              {t("Fish/Seafood")}
                            </label>
                          </div>
                          <div>
                            <label>
                              <input
                                type="checkbox"
                                checked={nuts}
                                onChange={(event) => {
                                  setNuts(!nuts);
                                  setChangesMade(true);
                                }}
                              />{" "}
                              {t("Nuts")}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br></br>
                    <div>
                      <label className="user-profile-font">
                        {t("Dietary_Choices")}
                      </label>
                    </div>
                    <br></br>
                    <div className="allergies-section">
                      <div className="checkbox-options">
                        <label>
                          <input
                            type="checkbox"
                            checked={halal}
                            onChange={(event) => {
                              setHalal(!halal);
                              setChangesMade(true);
                            }}
                          />{" "}
                          {t("Halal")}
                        </label>
                      </div>
                    </div>
                    <br></br>
                    <div>
                      <label className="user-profile-font">
                        {t("Choose_national_cuisine")}:
                      </label>
                    </div>
                    <label style={{ display: "block" }}>
                      <input
                        type="radio"
                        name="country"
                        value="Spain"
                        checked={country === "Spain"}
                        onChange={(event) => {
                          setCountry(event.target.value);
                          setChangesMade(true);
                        }}
                        onClick={handleCuisineLanguage}
                        className="user-font"
                        required
                      />{" "}
                      {t("Spain")}
                    </label>
                    <label style={{ display: "block" }}>
                      <input
                        type="radio"
                        name="country"
                        value="Turkey"
                        checked={country === "Turkey"}
                        onChange={(event) => {
                          setCountry(event.target.value);
                          setChangesMade(true);
                        }}
                        onClick={handleCuisineLanguage}
                        className="user-font"
                        required
                      />{" "}
                      {t("Turkey")}
                    </label>
                    <label style={{ display: "block" }}>
                      <input
                        type="radio"
                        name="country"
                        value="Morocco"
                        checked={country === "Morocco"}
                        onChange={(event) => {
                          setCountry(event.target.value);
                          setChangesMade(true);
                        }}
                        onClick={handleCuisineLanguage}
                        className="user-font"
                        disabled
                      />{" "}
                      {t("Morocco")}
                    </label>
                    <br></br>
                    <div>
                      <label className="user-profile-font">
                        {t("daily_plans")}:
                      </label>
                      {country && (
                        <div>
                          {spain && (
                            <label style={{ display: "block" }}>
                              <input
                                type="radio"
                                name="countryLanguage"
                                value="sp"
                                checked={countryLanguageCode === "sp"}
                                onChange={(event) => {
                                  setCountryLanguageCode(event.target.value);
                                  setChangesMade(true);
                                }}
                                className="user-font"
                                required
                              />{" "}
                              {languages["sp"]?.name || ""}
                            </label>
                          )}
                          {turkey && (
                            <label style={{ display: "block" }}>
                              <input
                                type="radio"
                                name="countryLanguage"
                                value="tr"
                                checked={countryLanguageCode === "tr"}
                                onChange={(event) => {
                                  setCountryLanguageCode(event.target.value);
                                  setChangesMade(true);
                                }}
                                className="user-font"
                                required
                              />{" "}
                              {languages["tr"]?.name || ""}
                            </label>
                          )}
                          {morocco && (
                            <label style={{ display: "block" }}>
                              <input
                                type="radio"
                                name="countryLanguage"
                                value="fr"
                                checked={countryLanguageCode === "fr"}
                                onChange={(event) => {
                                  setCountryLanguageCode(event.target.value);
                                  setChangesMade(true);
                                }}
                                className="user-font"
                                required
                              />{" "}
                              {languages["fr"]?.name || ""}
                            </label>
                          )}
                          <label style={{ display: "block" }}>
                            <input
                              type="radio"
                              name="countryLanguage"
                              value="en"
                              checked={countryLanguageCode === "en"}
                              onChange={(event) => {
                                setCountryLanguageCode(event.target.value);
                                setChangesMade(true);
                              }}
                              className="user-font"
                              required
                            />{" "}
                            {t("English")}
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <br></br>
                <br></br>
                <div>
                  <Link
                    to="/home"
                    value="Cancel"
                    className="button"
                    style={{ float: "left", textDecoration: "none" }}
                  >
                    {t("Cancel")}
                  </Link>
                  <input
                    type="submit"
                    value={t("Update")}
                    className={`button ${
                      !changesMade ? "inactive-button" : ""
                    }`}
                    style={{ float: "right" }}
                    disabled={!changesMade}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {!isMobile && <Footer />}{" "}
    </div>
  );
}

export default UserProfilePage;
