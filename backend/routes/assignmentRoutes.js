const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");

router.get("/", assignmentController.getAssignments);
router.get("/:id", assignmentController.getAssignmentById);
router.post("/", assignmentController.addAssignment);
router.put("/:id", assignmentController.updateAssignment);
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;
