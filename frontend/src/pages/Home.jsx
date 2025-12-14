// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

useEffect(() => {
  const courses = async () => {
    const res = await fetch("http://localhost:5200/api/courses");
    const data = await res.json();

    console.log("API RESPONSE:", data); // 🔥 IMPORTANT

    setCourses(data);
  };

  courses();
}, []);


const filteredCourses = courses.filter(course =>
  course.title?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <>
      <Navbar />

      <div className="home-container">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <div className="courses-grid">
          {filteredCourses.map(course => (
            <CourseCard key={course.code} course={course} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
