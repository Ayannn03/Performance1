const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
    },
    code: {
        type: String,
        required: [true, "Course code is required."],
    },
    description: {
        type: String,
        required: [true, "Course description is required."],
    },
    units: {
        type: Number,
        required: [true, "Course units are required."],
    },
    tags: {
        type: [String], // Assuming tags is an array of strings
        required: [true, "Tags field cannot be empty."],
    },
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
