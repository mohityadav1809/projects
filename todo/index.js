const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

// Create a database connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Mohit@98",
  database: "mohit",
});

let taskList = [];
function addTasks(taskItem, taskList) {
  taskList.push(taskItem);
}
function taskDone(taskItem, taskList, cb) {
  let newlist = taskList.filter((element) => element != taskItem);
  if (taskList.length == newlist.length) return "This task is not present";
  return newlist;
}

app.get("/home", (req, res) => {
  res.send("Welcome to your Todo App!");
});

app.post("/addTasks", (req, res) => {
  const { task } = req.body;
  const customObj = { name: task };
  addTasks(task, taskList);
  insertTasksDb(customObj);
  res.status(200).send(taskList);
});

app.post("/deleteTasks", (req, res) => {
  const { task } = req.body;
  deleteTasksDb(task);
  res.status(200).send(taskDone(task, taskList, res));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function insertTasksDb(taskObj) {
  // Correct SQL query for inserting data
  pool.query(
    "INSERT INTO tasks SET ?", // Correct syntax for inserting using an object in MySQL with node.js
    taskObj, // Directly pass the object if its properties match the column names
    (error, results, fields) => {
      if (error) {
        console.error("Error inserting data: ", error);
        return;
      }
      console.log("Data inserted successfully", results);
    }
  );

  // Handle connection errors
  pool.on("error", (err) => {
    console.error("Database pool error: ", err);
  });
}

function deleteTasksDb(taskObj) {
  // Correct SQL query for inserting data
  pool.query(
    "DELETE FROM tasks WHERE name = ?", // Correct syntax for inserting using an object in MySQL with node.js
    taskObj, // Directly pass the object if its properties match the column names
    (error, results, fields) => {
      if (error) {
        console.error("Error inserting data: ", error);
        return;
      }
      console.log("Data deleted successfully from db", results);
    }
  );

  // Handle connection errors
  pool.on("error", (err) => {
    console.error("Database pool error: ", err);
  });
}

// Perform database operation
pool.query("SELECT * FROM tasks", (error, results, fields) => {
  if (error) {
    console.error("Error fetching data: ", error);
    return;
  }
  console.log("Data fetched successfully: ", results);
});

// Handle connection errors
pool.on("error", (err) => {
  console.error("Database pool error: ", err);
});

//below code for adding rollback mechanism
// pool.rollback(function() {
//   throw new Error('Something failed!');
// });
