import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

// Bulletproof: attach token from localStorage on EVERY outgoing request
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  // Auth State
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const isAuthenticated = !!token;

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Response interceptor: auto-refresh on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== backendUrl + "/api/auth/login" && originalRequest.url !== backendUrl + "/api/auth/register") {
          originalRequest._retry = true;
          try {
            const { data } = await axios.post(backendUrl + "/api/auth/refresh");
            if (data.success) {
              setToken(data.accessToken);
              localStorage.setItem("token", data.accessToken);
              originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/login", { email, password });
      if (data.success) {
        localStorage.setItem("token", data.accessToken);
        setToken(data.accessToken);
        setUserData(data);
        setIsEducator(data.role === "educator" || data.role === "admin");
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/register", { name, email, password });
      if (data.success) {
        localStorage.setItem("token", data.accessToken);
        setToken(data.accessToken);
        setUserData(data);
        setIsEducator(data.role === "educator" || data.role === "admin");
        toast.success("Registered successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(backendUrl + "/api/auth/logout");
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
    setIsEducator(false);
    navigate("/login");
  };

  // Fetch All Courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch UserData
  const fetchUserData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/me");

      if (data.success) {
        setUserData(data.user);
        setIsEducator(data.user.role === "educator" || data.user.role === "admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    }
  };

  // Function to calculate average rating of course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // Function to Calculate Course Chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to Calculate Course Duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to Calculate No of Lectures in the course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(backendUrl + "/api/user/enrolled-courses");

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [token]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    fetchAllCourses,
    token,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
