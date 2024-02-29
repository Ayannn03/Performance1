const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const courses = require('./courses.json');
const Course = require("./Course");


app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve all BSIS courses
app.get('/api/courses/bsis', (req, res) => {
  try {
    const bsisCourses = courses.map(year => year['1st Year'].concat(year['2nd Year'], year['3rd Year'], year['4th Year']))
      .flat()
      .filter(course => course.tags.includes('BSIS'));
    res.json(bsisCourses);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve all BSIT courses
app.get('/api/courses/bsit', (req, res) => {
  try {
    const bsitCourses = courses.map(year => year['1st Year'].concat(year['2nd Year'], year['3rd Year'], year['4th Year']))
      .flat()
      .filter(course => course.tags.includes('BSIT'));
    res.json(bsitCourses);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//retrieve all the backend course alphabetically
app.get('/api/backend-courses', async (req, res) => {
  try {

    const filteredCourses = courses.filter(year => {
      return Object.values(year).some(courseList => {
        return courseList.some(course => isBackendCourse(course));
      });
    });

    let allCourses = [];
    filteredCourses.forEach(year => {
      Object.values(year).forEach(courseList => {
        allCourses = allCourses.concat(courseList.filter(course => isBackendCourse(course)));
      });
    });
    allCourses.sort((a, b) => a.name.localeCompare(b.name));

    res.json(allCourses);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to check if a course belongs to a backend course based on its tags
function isBackendCourse(course) {
  const backendTags = ['Database', 'System', 'Software', 'Enterprise', 'Web', 'Information'];
  return course.tags.some(tag => backendTags.includes(tag));
}


// Function to extract name and specialization of each course
const extractCourseDetails = () => {
  const courseDetails = [];

  courses.forEach(year => {
    Object.values(year).forEach(courseList => {
      courseList.forEach(course => {
        // Extract name and specialization and add to courseDetails array
        const { name, tags } = course;
        const Name = name;
        const specialization = tags[1] || 'None';  
        courseDetails.push({ Name, specialization });
      });
    });
  });

  return courseDetails;
};

// Call the function to get the extracted details
const extractedDetails = extractCourseDetails();

// Log the extracted details
console.log(extractedDetails);

// Define the endpoint name and specialization
app.get('/api/course-details', (req, res) => {
  try {
    // Call the function to extract course details
    const extractedDetails = extractCourseDetails();
    res.json(extractedDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mongo-test')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Connection failed...', err));

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
