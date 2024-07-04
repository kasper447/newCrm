

const express = require('express');
const departmentRoute = express.Router();

// const cityController = require('../controllers/cityController');
const {verifyHR, verifyAdminHR} = require('../middleware/authMiddleware');

const { getAllDepartment, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/DepartmentController');

// GET: Retrieve all countries
// verifyHR
departmentRoute.get("/department", verifyAdminHR,  getAllDepartment);

// POST: Create a new city
departmentRoute.post("/department", verifyAdminHR,  createDepartment);

// PUT: Update an existing city
departmentRoute.put("/department/:id", verifyAdminHR,  updateDepartment);

// DELETE: Delete a city
departmentRoute.delete("/department/:id", verifyAdminHR,  deleteDepartment);

module.exports = departmentRoute;