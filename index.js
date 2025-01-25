const Joi = require("joi");
const express = require("express");

const app = express();
app.use(express.json());

const courses = [
  {
    id: 1,
    name: "course1",
  },
  {
    id: 2,
    name: "course2",
  },
  {
    id: 3,
    name: "course3",
  },
];


app.get("/", (req, res) => {
  res.send(courses);
});

//Add course
app.post("/api/add/courses/", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

//get course by Id
app.get("/api/getbyidcourses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

// PUT route to update a course
app.put("/api/updatecourses/:id", (req, res) => {
  // Find the course by ID
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  // Validate the request body
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Update the course
  course.name = req.body.name;

  // Send the updated course as the response
  res.send(course);
});

app.delete("/api/deletecourses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("The course with the given ID was not found");
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listing on port ${port}...`));
