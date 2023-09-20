import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import SideBar from "../../components/sideBar";
import Footer from "../../components/footer.js";
import "../../components/sideBar.css";
import "../../components/footer.css";
import "./statistics.css";
import { useTranslation } from "react-i18next";
import "chartjs-plugin-annotation";
import LogoutAfterInactivity from "../../components/logoutAfterInactivity";
import { Line, Bar, PolarArea, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  plugins,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function Energy() {
  const [userHistory, setUserHistory] = useState();
  const [weeklyNPs, setWeeklyNPs] = useState([]);
  const [maxKcal, setMaxKcal] = useState();
  const [minKcal, setMinKcal] = useState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const [selectedDayNumber, setSelectedDayNumber] = useState(0); // State to store the selected number
  const [selectedDay, setSelectedDay] = useState();
  const { t } = useTranslation();

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
  // console.log(currentDayOfWeek);

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

  const formattedMonday = `${m_year}-${m_month}-${m_day}`;

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
    let max = 0;
    let min = 0;

    setSelectedDayNumber(currentDayOfWeek);
    setSelectedDay(dayMap[currentDayOfWeek]);

    const fetchData = async () => {
      if (user == null) {
        navigate("/");
      } else {
        setLoading(true);

        try {
          const responseUser = await axios.get(
            `${user.user_id}/getUserHistory`
          );
          setUserHistory(responseUser.data);
          //console.log(responseUser.data);
        } catch (error) {
          console.error(error);
        }

        try {
          const responseWeeklyNPs = await axios.get(
            `${user.user_id}/${formattedMonday}/getWeeklyNPs`
          );
          setWeeklyNPs(responseWeeklyNPs.data);

          max = Math.max(
            ...Object.entries(responseWeeklyNPs.data)?.map(
              ([key, value]) => value.kcal
            )
          );
          min = Math.min(
            ...Object.entries(responseWeeklyNPs.data)?.map(
              ([key, value]) => value.kcal
            )
          );
          setMaxKcal(max);
          setMinKcal(min);
        } catch (error) {
          console.error(error);
        }

        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dayMap = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
  };

  const handleDaySelection = (day) => {
    // Map the selected day to a number
    let number = 0;
    switch (day) {
      case "Monday":
        number = 1;
        day = "Monday";
        break;
      case "Tuesday":
        number = 2;
        day = "Tuesday";
        break;
      case "Wednesday":
        number = 3;
        day = "Wednesday";
        break;
      case "Thursday":
        number = 4;
        day = "Thursday";
        break;
      case "Friday":
        number = 5;
        day = "Friday";
        break;
      case "Saturday":
        number = 6;
        day = "Saturday";
        break;
      case "Sunday":
        number = 7;
        day = "Sunday";
        break;
      default:
        number = 0;
    }

    setSelectedDayNumber(number);
    setSelectedDay(day);
  };

  const data2 = {
    labels: Object.entries(weeklyNPs)?.map(([key, value]) => `NP ${key}`),
    datasets: [
      {
        label: "Energy of Nutritional Plan (kcal)",
        data: Object.entries(weeklyNPs)?.map(([key, value]) => value.kcal),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
      {
        type: "line",
        label: "Energy requirements of the user (kcal)",
        data: [
          Object.entries(weeklyNPs)?.map(([key, value]) => value.energy_intake),
          Object.entries(weeklyNPs)?.map(([key, value]) => value.energy_intake),
          Object.entries(weeklyNPs)?.map(([key, value]) => value.energy_intake),
          Object.entries(weeklyNPs)?.map(([key, value]) => value.energy_intake),
          Object.entries(weeklyNPs)?.map(([key, value]) => value.energy_intake),
          Object.entries(weeklyNPs)?.map(([key, value]) => value.energy_intake),
          Object.entries(weeklyNPs)?.map(([key, value]) => value.energy_intake),
        ],
        fill: false,
        borderColor: "rgb(54, 162, 235)",
      },
    ],
  };

  const config2 = {
    options: {
      scales: {
        y: {
          max: Math.round(maxKcal + 10),
          min: Math.round(minKcal - 100),
        },
      },
    },
    plugins: {
      tooltip: {
        position: "average",
      },
    },
  };

  LogoutAfterInactivity();

  return (
    <div>
      <SideBar />
      <div style={{ width: "87%", float: "right" }}>
        <br></br>
        <br></br>
        <div>
          <div style={{ textAlign: "center" }}>
            <h2>Energy Intake for the Week</h2>
          </div>
          <br></br>
          <br></br>
          <div className="custom-container">
            <br></br>
            <Bar data={data2} config={config2} options={config2.options} />
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        {!isMobile && <Footer />}{" "}
      </div>
    </div>
  );
}

export default Energy;
