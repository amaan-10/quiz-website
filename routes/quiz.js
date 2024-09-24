const express = require("express");
const { createQuiz, getQuizzes } = require("../controllers/quizController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", createQuiz);
router.get("/get", getQuizzes);

module.exports = router;
