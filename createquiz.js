let currentQuestion = 0;
const startBtn = document.getElementById("gnrt-btn");
const saveBtn = document.getElementById("save-btn");
const nextBtn = document.getElementById("next-btn");
const quizForm = document.getElementById("quizForm1");

function generateQuiz() {
  const numQuestions = parseInt(
    document.getElementById("numQuestions").value,
    10
  );
  const questionsContainer = document.getElementById("questionsContainer");
  const quizTitle = document.getElementById("quizTitle").value;

  // Save quiz title to localStorage
  localStorage.setItem("currentQuizTitle", quizTitle);

  questionsContainer.innerHTML = "";

  for (let i = 1; i <= numQuestions; i++) {
    questionsContainer.innerHTML += `
                    <div id="question${i}" class="quiz-question" style="display: none;">
                        <h1>Question ${i}</h1>
                        <label for="questionText${i}">Question:</label>
                        <input type="text" id="questionText${i}" required>

                        <label for="choices${i}">Choices (comma-separated):</label>
                        <input type="text" id="choices${i}" required>

                        <label for="correctAnswer${i}">Correct Answer:</label>
                        <input type="text" id="correctAnswer${i}" required>
                    </div>`;
  }

  showQuestion(1);
}

function showQuestion(questionNumber) {
  // Hide the current question

  if (currentQuestion > 0) {
    document.getElementById(`question${currentQuestion}`).style.display =
      "none";
  }

  // Show the new question
  document.getElementById(`question${questionNumber}`).style.display = "flex";

  currentQuestion = questionNumber;
  questionsContainer.classList.add("active");
  startBtn.style.display = "none";
  nextBtn.style.display = "block";
  saveBtn.style.display = "block";
  quizForm.style.display = "none";
}

function nextQuestion() {
  const numQuestions = parseInt(
    document.getElementById("numQuestions").value,
    10
  );

  // Move to the next question or show the results if on the last question
  if (currentQuestion < numQuestions) {
    showQuestion(currentQuestion + 1);
  } else {
    alert("This is the last question. Save your quiz or submit it.");
  }
}

function saveQuiz() {
  const quizTitle = document.getElementById("quizTitle").value;
  const numQuestions = parseInt(
    document.getElementById("numQuestions").value,
    10
  );
  const quizData = {
    title: quizTitle,
    questions: [],
  };

  for (let i = 1; i <= numQuestions; i++) {
    const questionText = document.getElementById(`questionText${i}`).value;
    const choices = document.getElementById(`choices${i}`).value.split(",");
    const correctAnswer = document
      .getElementById(`correctAnswer${i}`)
      .value.trim();

    const question = {
      text: questionText,
      choices: choices.map((choice) => choice.trim()),
      correctAnswer: correctAnswer,
    };

    quizData.questions.push(question);
  }

  const jsonData = JSON.stringify(quizData);

  // Save JSON data to localStorage with the quiz title as the key
  localStorage.setItem(quizTitle, jsonData);

  alert("Quiz saved successfully!");
}
