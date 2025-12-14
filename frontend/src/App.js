import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import Threads from "./pages/Threads";
import Questions from "./pages/Questions";
import Register from "./pages/Register";

function App() { return ( < BrowserRouter > < Routes > < Route path = "/login"
            element = { < Login / > }
            /> <Route path="/register
            " element={<Register />} /> <Route path=" / " element={<Courses />} /> <Route path=" / threads /: courseId " element={<Threads />} /> <Route path=" / questions /: threadId " element={<Questions />} /> </Routes> </BrowserRouter> ); } export default App;