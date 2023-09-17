import React, { useState, useEffect } from "react";
// date
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import arabic from "react-date-object/calendars/arabic"
import arabic_ar from "react-date-object/locales/arabic_ar"
// router
import { useOutletContext } from "react-router-dom";
// redux
import { useSelector } from "react-redux";
import { themeDetail } from "../../../../../redux/itemStore/theme";

const CalendarD = () => {
  const { lan } = useOutletContext();
  const theme = useSelector(themeDetail);

  const calculateNumberOfMonths = () => {
    if (window.innerWidth < 768) {
      return 1;
    } else if (window.innerWidth < 1200) {
      return 2;
    } else {
      return 3;
    }
  };

  const [numberOfMonths, setNumberOfMonths] = useState(calculateNumberOfMonths);

  const handleResize = () => {
    setNumberOfMonths(calculateNumberOfMonths);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);




  return (
    <Calendar
      numberOfMonths={numberOfMonths}
      className={theme ? "date-bg" : ""}
      calendar={lan === "fa" ? persian : lan === "ar" ? arabic : ""}
      locale={lan === "fa" ? persian_fa : lan === "ar" ? arabic_ar : ""}
    />
  );
};

export default CalendarD;
