import Course from "../Models/Course.js";

/* =========================
   GET ALL COURSES
========================= */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course
      .find()
      .populate("instructorIDs", "name email role");

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET COURSE BY ID
========================= */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course
      .findById(req.params.id)
      .populate("instructorIDs", "name email role");

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CREATE COURSE
========================= */
export const createCourse = async (req, res) => {
  try {
    const { title, code, description } = req.body;

    if (!title || !code)
      return res.status(400).json({ message: "Title and code are required" });

    const exists = await Course.findOne({ code });
    if (exists)
      return res.status(409).json({ message: "Course code already exists" });

    const course = await Course.create({
      title,
      code,
      description,
      instructorIDs: []
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE COURSE
========================= */
export const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    if (title) course.title = title;
    if (description) course.description = description;

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE COURSE
========================= */
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ADD INSTRUCTOR TO COURSE
========================= */
export const addInstructor = async (req, res) => {
  try {
    const { instructorId } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    if (course.instructorIDs.includes(instructorId))
      return res.status(409).json({ message: "Instructor already assigned" });

    course.instructorIDs.push(instructorId);
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   REMOVE INSTRUCTOR
========================= */
export const removeInstructor = async (req, res) => {
  try {
    const { instructorId } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    course.instructorIDs = course.instructorIDs.filter(
      id => id.toString() !== instructorId
    );

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
