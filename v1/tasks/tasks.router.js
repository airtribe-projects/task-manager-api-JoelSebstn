const express = require("express");
const tasksController = require("./tasks.controller");

const router = express.Router();

router.post("/tasks", tasksController.createTask);
router.get("/tasks", tasksController.getAllTasks);
router.get("/tasks/priority/:level", tasksController.getTasksByPriority);
router.get("/tasks/:id", tasksController.getTaskById);
router.put("/tasks/:id", tasksController.updateTask);
router.delete("/tasks/:id", tasksController.deleteTask);

module.exports = router;
