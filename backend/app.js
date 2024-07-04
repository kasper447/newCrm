var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const app = express();
const cloudinary = require("cloudinary").v2;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
require("dotenv").config();

const connection = require("./dbConnection/dbconnect");
const { scheduler } = require("./schedule/schedule");

connection();

const PORT = process.env.PORT || 4000;

// acss the shows bdf file backend
app.use("/files", express.static("files"));

// custom  Routes import file
const loginRoute = require("./routes/loginRoute");
// const teamRoute = require("./routes/teamsRoute");

const contery = require("./routes/countryRoutes");
const stateRoute = require("./routes/stateRoute");
const cityRoute = require("./routes/cityRoute");
const companyRoute = require("./routes/companyRoute");
const departmentRoute = require("./routes/departmentRoute");
const roleRoute = require("./routes/roleRoute");
const positionRoute = require("./routes/positionRoute");
const employeeRoute = require("./routes//familyRoute");
const familyRoute = require("./routes/employeeRoute");
const workExperienceRoute = require("./routes//workExperienceRoute");
const portalRoute = require("./routes/portalRoute");
const projectRoute = require("./routes/projectRoute");
const salaryRoute = require("./routes/salaryRoute");
const leaveRoute = require("./routes/leaveRoute");
const educationRoute = require("./routes/educationRoute");
const personalInfoRoute = require("./routes/personalInfoRoute");
const { totalLeaveRoute } = require("./routes/totalLeaveRoute");
const { forgotePassRoute } = require("./routes/forgotePassRoute");
const locationRoutes = require("./routes/locationRoutes");
const { taskRoute } = require("./routes/taskRoute");
const { attendanceRoute } = require("./routes/attendanceRoute");
const { type } = require("joi/lib/types/object");
const { Employee } = require("./models/employeeModel");
const { Task } = require("./models/taskModel");

const { fileUploadMiddleware, chackFile } = require("./middleware/multer");
const {
  uplodeImagesCloudinary,
  removeCloudinaryImage
} = require("./cloudinary/cloudinaryFileUpload");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//for request body
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
  })
);
scheduler();
// create a custom  route
app.use("/api", forgotePassRoute);
app.use("/api", contery);
app.use("/api", stateRoute);
app.use("/api", cityRoute);
app.use("/api", companyRoute);
app.use("/api", roleRoute);
app.use("/api", positionRoute);
app.use("/api", departmentRoute);
app.use("/api", employeeRoute);
app.use("/api", familyRoute);
app.use("/api", educationRoute);
app.use("/api", workExperienceRoute);
app.use("/api", projectRoute);
app.use("/api", portalRoute);
app.use("/api", salaryRoute);
app.use("/api", leaveRoute);
app.use("/api", personalInfoRoute);
app.use("/api", loginRoute);
app.use("/api", taskRoute);
app.use("/api", attendanceRoute);
app.use("/api", locationRoutes);
app.use("/api", totalLeaveRoute);

// app.use("/api", teamRoute);

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});

// require("./pdfDetails");
// const { Task } = require("./models/taskModel");
// const { Employee } = require("./models/employeeModel");

const upload = multer({ storage: storage });

app.post("/api/tasks", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const { Taskname } = req.body;
  const { path } = req.file;
  const { description } = req.body;
  const { department } = req.body;
  const { managerEmail } = req.body;
  const { comment } = req.body;
  const { duration } = req.body;
  const { status } = req.body;
  const { startDate } = req.body;
  const { endDate } = req.body;
  const { adminMail } = req.body;
  const dateDifference = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );
  const extradate = dateDifference;
  const newPdf = new Task({
    Taskname: Taskname,
    pdf: path,
    description: description,
    department: department,
    managerEmail: managerEmail,
    comment: "Task Assigned",
    duration: extradate,
    status: "Assigned",
    startDate: startDate,
    endDate: endDate,
    adminMail: adminMail,
    employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
  });
  console.log("newPdf ====", newPdf);

  // console.log(Taskname, path, description, department, managerEmail, comment, duration, status, startDate, endDate);
  try {
    // await PdfSchema.create({ title: title, pdf: fileName });

    await newPdf.save();
    res.status(201).json({
      message: "ok"
    });
    // res.send({ status: "ok", data: newPdf });
  } catch (error) {
    res.status(400).send(error);
    // res.json({ status: error });
  }
});
//////

app.get("/api/getTask", async (req, res) => {
  console.log;
  try {
    Task.find({}).then((data) => {
      res.send({ status: "ok........", data: data });
    });
  } catch (error) {}
});

app.post("/api/tasks/:taskId/employees", async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const employeesArray = req.body.employees;

    if (!Array.isArray(employeesArray)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const newEmployees = [];

    for (const employeeData of employeesArray) {
      const { empname, empemail, empdesignation, emptaskStatus } = employeeData;

      // Check if empemail already exists in the task's employees array
      const existingEmployee = task.employees.find(
        (employee) => employee.empemail === empemail
      );

      if (existingEmployee) {
        console.log("Employee with email already exists:", empemail);
        // If the employee already exists, throw an error or handle it accordingly
        throw new Error(`Duplicate empemail: ${empemail}`);
      } else {
        console.log("Creating new employee:", empemail);
        // Create a new employee object and add it to the array
        const newEmployee = {
          empname,
          empemail,
          empdesignation,
          emptaskStatus
        };
        newEmployees.push(newEmployee);
      }
    }

    // Add the new employees to the task's employees array
    task.employees.push(...newEmployees);

    // Save the updated task
    await task.save();

    // Respond with the updated task
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);

    // Check if the error is due to a duplicate empemail
    if (error.message.includes("Duplicate empemail")) {
      return res
        .status(400)
        .json({ error: "Duplicate empemail found in the request" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});
const users = {};
io.on("connection", (socket) => {
  console.log("server================", socket.id);
  //abhay:- here user is connecting and we are storing socket id and Mail
  socket.on("userConnected", (userData) => {
    users[socket.id] = { email: userData.email, socketId: socket.id };
    console.log("heelloo", users);
  });
  //abhay:- when browser get closed or user get offline than this is automatically get trigger no need to trigger it manually
  socket.on("disconnect", () => {
    const disconnectedUser = users[socket.id];
    if (disconnectedUser) {
      delete users[socket.id];
    }
  });

  //abhay:-admin want to send  notice to every employee
  app.post("/api/notice", upload.single("file"), async (req, res) => {
    const { noticeId } = req.body;
    const { notice } = req.body;
    const { path } = req.file;
    const data = {
      noticeId,
      notice,
      attachments: path
    };

    // console.log(Taskname, path, description, department, managerEmail, comment, duration, status, startDate, endDate);
    try {
      // await PdfSchema.create({ title: title, pdf: fileName });

      await Employee.updateMany(
        {},
        {
          $push: {
            Notice: {
              notice: notice,
              noticeId,
              attachments: path
            }
          }
        },
        { new: true }
      );
      io.emit("notice", data);
      // await newPdf.save();
      res.status(201).json({
        message: "ok"
      });
      // res.send({ status: "ok", data: newPdf });
    } catch (error) {
      res.status(400).send(error);
      // res.json({ status: error });
    }
  });
  //abhay:-admin want to delete notice from every employee dashboard

  app.post("/api/noticeDelete", async (req, res) => {
    const { noticeId } = req.body;

    // console.log(Taskname, path, description, department, managerEmail, comment, duration, status, startDate, endDate);
    try {
      // await PdfSchema.create({ title: title, pdf: fileName });

      await Employee.updateMany(
        {},
        {
          $pull: {
            Notice: {
              noticeId: { $eq: noticeId } // Specify the noticeId you want to remove
            }
          }
        },
        { new: true }
      );
      io.emit("noticeDelete", true);
      // await newPdf.save();
      res.status(201).json({
        message: "ok"
      });
      // res.send({ status: "ok", data: newPdf });
    } catch (error) {
      res.status(400).send(error);
      // res.json({ status: error });
    }
  });
  //abhay:- task is assigned to manager by Admin
  socket.on("managerTaskNotification", async (data) => {
    try {
      const { managerEmail } = data;
      const employee = await Employee.findOne({ Email: managerEmail });

      let targetUser = Object.values(users).find(
        (user) => user.email === managerEmail
      );
      if (employee && targetUser) {
        const {
          taskId,
          taskName,
          senderMail,
          status,
          path,
          message,
          messageBy,
          profile
        } = data;
        console.log(managerEmail);

        employee.Notification.unshift({
          path,
          taskId,
          taskName,
          senderMail,
          status,
          managerEmail,
          message,
          messageBy,
          profile
        });

        await employee.save();
        io.to(targetUser.socketId).emit("taskNotificationReceived", data);
      } else if (employee) {
        const {
          taskId,
          taskName,
          senderMail,
          status,
          path,
          message,
          messageBy,
          profile
        } = data;
        console.log(users);

        employee.Notification.unshift({
          path,
          message,
          taskId,
          taskName,
          senderMail,
          status,
          managerEmail,
          messageBy,
          profile
        });

        await employee.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  //abhay:- task is assigned to employee by manager
  socket.on("employeeTaskNotification", async (data) => {
    try {
      data.employeesEmail.forEach(async (val) => {
        const employee = await Employee.findOne({ Email: val });
        let targetUser = Object.values(users).find(
          (user) => user.email === val
        );
        console.log(employee);
        if (employee && targetUser) {
          const {
            senderMail,
            taskId,
            taskName,
            message,
            status,
            path,
            messageBy,
            profile
          } = data;
          employee.Notification.unshift({
            path,
            taskId,
            message,
            taskName,
            status,
            senderMail,
            EmployeeMail: val,
            messageBy,
            profile
          });

          await employee.save();
          io.to(targetUser.socketId).emit("taskNotificationReceived", data);
        } else if (employee) {
          const {
            senderMail,
            taskId,
            taskName,
            status,
            message,
            path,
            messageBy,
            profile
          } = data;
          employee.Notification.unshift({
            path,
            taskId,
            message,
            taskName,
            status,
            senderMail,
            EmployeeMail: val,
            messageBy,
            profile
          });

          await employee.save();
        }
      });

      //   console.log(employee)

      //   if (employee) {
      //     const { taskId, taskName, senderMail,  status,} = data;
      //     employee.Notification.unshift({taskId, taskName, senderMail,  status,managerEmail});

      //     await employee.save();
      //       console.log(socket.id)
      //   }

      // socket.broadcast.emit("taskNotificationReceived", data);
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  //abhay:- when manager accept the task admin will get notification
  socket.on("adminTaskNotification", async (data) => {
    try {
      const { adminMail } = data;

      const employee = await Employee.findOne({ Email: adminMail });
      let targetUser = Object.values(users).find(
        (user) => user.email === adminMail
      );
      if (employee && targetUser) {
        const {
          senderMail,
          taskName,
          Account,
          status,
          adminMail,
          taskId,
          path,
          taskStatus,
          message,
          messageBy,
          profile
        } = data;

        employee.Notification.unshift({
          senderMail,
          taskName,
          Account,
          status,
          adminMail,
          taskId,
          path,
          taskStatus,
          message,
          messageBy,
          profile
        });

        await employee.save();
        io.to(targetUser.socketId).emit("taskNotificationReceived", data);
      } else if (employee) {
        const {
          senderMail,
          taskName,
          Account,
          status,
          adminMail,
          taskId,
          path,
          taskStatus,
          message,
          messageBy,
          profile
        } = data;
        // console.log(users);

        employee.Notification.unshift({
          senderMail,
          taskName,
          Account,
          status,
          adminMail,
          taskId,
          path,
          taskStatus,
          message,
          messageBy,
          profile
        });

        await employee.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  //abhay:-when employee apply leave
  socket.on("leaveNotification", async (data) => {
    try {
      //  console.log(data)
      const { managerEmail, hrEmail } = data;
      const manager = await Employee.findOne({ Email: managerEmail });
      const hr = await Employee.findOne({ Email: hrEmail });
      let targetManager = Object.values(users).find(
        (user) => user.email === managerEmail
      );
      let targetHr = Object.values(users).find(
        (user) => user.email === hrEmail
      );
      if (manager && targetManager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        console.log(data);

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile
        });

        await manager.save();
        io.to(targetManager.socketId).emit("leaveNotificationReceived", data);
      } else if (manager) {
        const { message, status, path, taskId, messageBy, profile } = data;
        // console.log(users);

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile
        });

        await manager.save();
      }
      if (hr && targetHr) {
        const { message, status, path, taskId, messageBy, profile } = data;

        hr.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile
        });

        await hr.save();
        io.to(targetHr.socketId).emit("leaveNotificationReceived", data);
      } else if (hr) {
        const { message, status, path, taskId, messageBy, profile } = data;
        // console.log(users);

        hr.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile
        });

        await hr.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("leaveManagerStatusNotification", async (data) => {
    try {
      //  console.log(data)
      const { employeeEmail, hrEmail } = data;
      const employee = await Employee.findOne({ Email: employeeEmail });
      const hr = await Employee.findOne({ Email: hrEmail });
      let targetEmployee = Object.values(users).find(
        (user) => user.email === employeeEmail
      );
      let targetHr = Object.values(users).find(
        (user) => user.email === hrEmail
      );
      if (employee && targetEmployee) {
        const { message, status, path, taskId, messageBy, profile } = data;

        employee.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          messageBy,
          profile
        });

        await employee.save();
        io.to(targetEmployee.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (employee) {
        const { message, status, path, taskId, messageBy, profile } = data;
        // console.log(users);

        employee.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          messageBy,
          profile
        });

        await employee.save();
      }
      if (hr && targetHr) {
        const { message, status, path, taskId, messageBy, profile } = data;

        hr.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          messageBy,
          profile
        });

        await hr.save();
        io.to(targetHr.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (hr) {
        const { message, status, path, taskId, messageBy, profile } = data;
        // console.log(users);

        hr.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          profile,
          messageBy
        });

        await hr.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("leaveHrStatusNotification", async (data) => {
    try {
      //  console.log(data)
      const { employeeEmail, managerEmail } = data;
      const employee = await Employee.findOne({ Email: employeeEmail });
      const manager = await Employee.findOne({ Email: managerEmail });
      let targetEmployee = Object.values(users).find(
        (user) => user.email === employeeEmail
      );
      let targetManager = Object.values(users).find(
        (user) => user.email === managerEmail
      );
      if (employee && targetEmployee) {
        const { message, status, path, taskId, messageBy, profile } = data;

        employee.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          managerEmail,
          messageBy,
          profile
        });

        await employee.save();
        io.to(targetEmployee.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (employee) {
        const { message, status, path, taskId, profile, messageBy } = data;
        // console.log(users);

        employee.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          managerEmail,
          profile,
          messageBy
        });

        await employee.save();
      }
      if (manager && targetManager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          managerEmail,
          messageBy,
          profile
        });

        await manager.save();
        io.to(targetManager.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (manager) {
        const { message, status, path, taskId, messageBy, profile } = data;
        // console.log(users);

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          managerEmail,
          messageBy,
          profile
        });

        await manager.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  //abhay:- when employee accept the task manager and his team will get update
  socket.on("employeeTaskUpdateNotification", async (data) => {
    try {
      data.employeesEmail.forEach(async (val) => {
        const employee = await Employee.findOne({ Email: val });
        let targetUser = Object.values(users).find(
          (user) => user.email === val
        );

        if (employee && targetUser) {
          const {
            senderMail,
            taskId,
            taskName,
            status,
            path,
            taskStatus,
            Account,
            message,
            profile,
            messageBy
          } = data;
          employee.Notification.unshift({
            path,
            taskId,
            taskName,
            taskStatus,
            Account,
            message,
            messageBy,
            status,
            senderMail,
            EmployeeMail: val,
            profile
          });

          await employee.save();
          io.to(targetUser.socketId).emit("taskNotificationReceived", data);
        } else if (employee) {
          const {
            senderMail,
            taskId,
            taskName,
            status,
            path,
            Account,
            messageBy,
            taskStatus,
            message,
            profile
          } = data;
          employee.Notification.unshift({
            path,
            taskId,
            taskName,
            Account,
            taskStatus,
            messageBy,
            message,
            status,
            senderMail,
            EmployeeMail: val,
            profile
          });

          await employee.save();
        }
      });

      //   console.log(employee)

      //   if (employee) {
      //     const { taskId, taskName, senderMail,  status,} = data;
      //     employee.Notification.unshift({taskId, taskName, senderMail,  status,managerEmail});

      //     await employee.save();
      //       console.log(socket.id)
      //   }

      // socket.broadcast.emit("taskNotificationReceived", data);
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("notificationPageUpdate", (data) => {
    socket.emit("notificationPageUpdate", data);
  });
  socket.on("loginUser", async (data) => {
    try {
      const { manager, user } = data;
      console.log("manager", manager, user);
      let currentTime = new Date().toLocaleTimeString();
      let data1 = {
        message: `${user} login at ${currentTime}`
      };
      let targetUser = Object.values(users).find(
        (user) => user.email === manager
      );
      console.log("user", targetUser);
      if (targetUser) {
        io.to(targetUser.socketId).emit("userLogin", data1);
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("logoutUser", async (data) => {
    try {
      const { manager, user } = data;
      console.log(manager, user);
      let currentTime = new Date().toLocaleTimeString();
      let data1 = {
        message: `${user} logout at ${currentTime}`
      };
      let targetUser = Object.values(users).find(
        (user) => user.email === manager
      );
      console.log("user", targetUser);
      if (targetUser) {
        io.to(targetUser.socketId).emit("userLogout", data1);
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
});

// documents crud

const documentSchema = new mongoose.Schema({
  title: String,
  number: String,
  email: String,
  files: [String]
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;

// app.post("/upload", upload.array("files"), async (req, res) => {
//   try {
//     const { title, number } = req.body;

//     // Upload files to Cloudinary
//     const uploadedFiles = await Promise.all(
//       req.files.map(async (file) => {
//         const result = await cloudinary.uploader.upload(file.path);
//         return result.secure_url; // Return the secure URL of the uploaded file
//       })
//     );

//     // Create a new document instance with the Cloudinary URLs
//     const newDocument = new Document({
//       title,
//       number,
//       files: uploadedFiles
//     });

//     // Save the document to MongoDB
//     await newDocument.save();

//     // Respond with success message
//     res.status(201).send("Document uploaded successfully.");
//   } catch (error) {
//     console.error("Error uploading document:", error);
//     res.status(500).send("Error uploading document.");
//   }
// });

app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const { title, number, email } = req.body;

    // Upload files to Cloudinary
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url; // Return the secure URL of the uploaded file
      })
    );

    // Create a new document instance with the Cloudinary URLs
    const newDocument = new Document({
      title,
      number,
      email,
      files: uploadedFiles
    });

    // Save the document to MongoDB
    await newDocument.save();

    // Respond with success message
    res.status(201).send("Document uploaded successfully.");
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).send("Error uploading document.");
  }
});

app.post("/documents", async (req, res) => {
  try {
    const {email} = req.body;
  
    // Fetch all documents from MongoDB
    const documents = await Document.find({email});

    // Respond with the fetched documents

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).send("Error fetching documents.");
  }
});

app.delete("/delete-document/:id", async (req, res) => {
  try {
    const documentId = req.params.id;

    // Find the document by its ID
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).send("Document not found.");
    }

    // Delete the document from MongoDB
    await Document.findByIdAndDelete(documentId);

    // Respond with success message
    res.status(200).send("Document deleted successfully.");
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).send("Error deleting document.");
  }
});

//  create a server
// var port = process.env.PORT;
// // console.log("ip========", port && process.env.IP);
// if (port & process.env.IP) {
//   server.listen(port, process.env.IP, () => {
//     console.log("started");
//   });
// } else
server.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);
