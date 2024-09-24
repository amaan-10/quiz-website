const Quiz = require("../models/quiz");

exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const quiz = new Quiz({ title, questions });
    await quiz.save();
    res.status(201).send("Quiz created successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};
