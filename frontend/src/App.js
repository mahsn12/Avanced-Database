import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "./pages/Login";
import Register from "./pages/Register";

/* STUDENT */
import Home from "./pages/Home";
import Threads from "./pages/Threads";
import Questions from "./pages/Questions";

/* INSTRUCTOR */
import InstructorHome from "./pages/InstructorHome";
import CreateThread from "./pages/CreateThread";
import InstructorQuestions from "./pages/InstructorQuestions";

/* SHARED */
import Announcements from "./pages/Announcements";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";

/* ADMIN */
import AdminHome from "./pages/AdminHome";

function App() {
    return ( <
        BrowserRouter >
        <
        Routes > { /* ================= AUTH ================= */ } <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/register"
        element = { < Register / > }
        />

        { /* ================= STUDENT ================= */ } <
        Route path = "/"
        element = { < Home / > }
        /> <
        Route path = "/home"
        element = { < Home / > }
        />

        { /* ================= THREADS & QUESTIONS ================= */ } <
        Route path = "/threads"
        element = { < Threads / > }
        /> <
        Route path = "/threads/:courseId"
        element = { < Threads / > }
        />

        <
        Route path = "/questions"
        element = { < Questions / > }
        /> <
        Route path = "/questions/:threadId"
        element = { < Questions / > }
        />

        { /* ================= INSTRUCTOR ================= */ } <
        Route path = "/instructor/home"
        element = { < InstructorHome / > }
        /> <
        Route path = "/instructor/create-thread"
        element = { < CreateThread / > }
        /> <
        Route path = "/questions/course/:courseId"
        element = { < InstructorQuestions / > }
        />

        { /* ================= ANNOUNCEMENTS ================= */ } <
        Route path = "/announcements"
        element = { < Announcements / > }
        />

        { /* ================= REPORTS ================= */ } <
        Route path = "/reports"
        element = { < Reports / > }
        />

        { /* ================= NOTIFICATIONS ================= */ } <
        Route path = "/notifications"
        element = { < Notifications / > }
        /> { /* ================= ADMIN ================= */ } <
        Route path = "/admin/dashboard"
        element = { < AdminHome / > }
        />

        { /* ================= FALLBACK ================= */ } <
        Route path = "*"
        element = { < Navigate to = "/login"
            replace / > }
        /> <
        /Routes> <
        /BrowserRouter>
    );
}

export default App;