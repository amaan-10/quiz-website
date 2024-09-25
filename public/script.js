const createQuiz = document.getElementById("create-quiz");
const startQuiz = document.getElementById("start-quiz");
const home = document.getElementById("quiz-home");

let currentQuestion = 0;
const startBtn = document.getElementById("gnrt-btn");
const saveBtn = document.getElementById("save-btn");
const nextBtn = document.getElementById("next-btn");
const quizForm = document.getElementById("quizForm1");

let currentQuestionIndex = 0;
let userResponses = [];
let quizData;

const quizContainer = document.getElementById("quizContainer");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
const loadButton = document.getElementById("loadButton");
const scoreContainer = document.getElementById("scoreContainer");
const quiz1 = document.getElementsByClassName("quiz1");

function showQuiz() {
  startQuiz.style.display = "block";
  home.style.display = "none";
}

function showCreateQuiz() {
  createQuiz.style.display = "block";
  home.style.display = "none";
}

// create quiz------------------------------------------------

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

function nextQuestions() {
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
  // Collect form data
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
      question: questionText,
      options: choices.map((choice) => choice.trim()),
      correctOption: correctAnswer,
    };

    quizData.questions.push(question);
  }

  // Send data to the server using Fetch API
  const response = fetch("https://quiz-website-t7cq.onrender.com/quiz/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizData),
  });

  //console.log(response);
  //alert(result); // Show the response from the server

  alert("Quiz saved successfully! Start Quiz to try it!!");
  setTimeout(function () {
    window.location.href = "index.html";
  }, 1000);
}

// show quiz-----------------------------------------------------
let quiz;
async function fetchQuizData() {
  try {
    const response = await fetch(
      "https://quiz-website-t7cq.onrender.com/quiz/get"
    );
    quiz = await response.json();
    // console.log(quiz);
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

// Call the function to fetch and display quiz data
async function displayGlobalValue() {
  await fetchQuizData(); // Ensure the global variable is updated
  //console.log("Now using globalValue:", quiz); // Should log the value
}
displayGlobalValue();
const quizTitleSelect = document.getElementById("quizTitles");
setTimeout(() => {
  //console.log("Global apiResponse after timeout:", quiz); // This may still log undefined if called too early

  // console.log(quiz);

  // Load quiz titles from localStorage
  function isValidQuizData(data) {
    // Implement your validation logic here
    return data !== null && typeof data === "object"; // Example condition
  }

  // Filter valid quizzes
  const quizTitles = quiz
    .filter((quizItem) => isValidQuizData(quizItem.questions)) // Check if the data is valid
    .map((quizItem) => quizItem.title);
  //console.log(quizTitles);

  quizTitles.forEach((title) => {
    const option = document.createElement("option");
    option.value = title;
    option.textContent = title;
    quizTitleSelect.appendChild(option);
    //console.log(option);
  });
}, 1000);
// function isValidQuizData(data) {
//   try {
//     const parsedData = JSON.parse(data);
//     return (
//       parsedData && parsedData.title && Array.isArray(parsedData.questions)
//     );
//   } catch (error) {
//     return false;
//   }
// }
function loadQuiz() {
  const selectedTitle = quizTitleSelect.value;
  //console.log(quizTitleSelect);
  // Check if the selected title exists in localStorage
  if (!quiz.find((quizItem) => quizItem.title === selectedTitle)) {
    alert("Selected quiz title does not exist.");
    return;
  }

  // Reset variables for a new quiz
  currentQuestionIndex = 0;
  userResponses = [];

  // Retrieve quiz data from localStorage based on the selected title
  quizData = quiz.find((quizItem) => quizItem.title === selectedTitle);
  //console.log(quizData);

  scoreContainer.style.display = "none";

  const quizContainer = document.querySelector(".quizContainer");
  const quiz1 = document.querySelector(".quiz1");
  quizContainer.classList.add("active");
  quiz1.classList.add("active");

  // Display quiz questions
  showQuestions(currentQuestionIndex);
}

function showQuestions(index) {
  var a = 0;
  var b = 0;
  quizContainer.innerHTML = `<h1>${quizData.title}</h1>
                    <legend>Question ${index + 1}</legend>
                    <h2 class="question-text">${
                      quizData.questions[index].question
                    }</h2>
                    <div class="option-list">
                        ${quizData.questions[index].options
                          .map(
                            (option) =>
                              `<div class="option"><input type="radio" id="radio${a++}" name="q${index}" value="${option}"><label for="radio${b++}"> ${option} </label></div>`
                          )
                          .join("")}
                    </div>`;

  // Show/hide navigation buttons
  if (index < quizData.questions.length - 1) {
    nextButton.style.display = "block";
    submitButton.style.display = "none";
  } else {
    nextButton.style.display = "none";
    submitButton.style.display = "block";
  }
}

function nextQuestion() {
  const selectedOption = document.querySelector(
    `input[name="q${currentQuestionIndex}"]:checked`
  );
  if (!selectedOption) {
    alert("Please select an answer before proceeding.");
    return;
  }

  userResponses[currentQuestionIndex] = selectedOption.value;
  currentQuestionIndex++;
  showQuestions(currentQuestionIndex);
}

function submitQuiz() {
  const selectedOption = document.querySelector(
    `input[name="q${currentQuestionIndex}"]:checked`
  );
  if (selectedOption) {
    userResponses[currentQuestionIndex] = selectedOption.value;
  }

  // Evaluate answers and display results (replace with your own logic)
  const score = calculateScore();
  displayScore(score);
}

function calculateScore() {
  let score = 0;
  for (let i = 0; i < quizData.questions.length; i++) {
    if (userResponses[i] === quizData.questions[i].correctOption) {
      score++;
    }
  }
  return score;
}

function displayScore(score) {
  scoreContainer.innerHTML = `<h2>Quiz Score</h2>
            <div class="percentageContainer">
                <div class="piechart">
                    <span class="value">0%</span>
                </div>
                <span class="score">Your score: ${score} out of ${quizData.questions.length}</span>
            </div>
            <div class="buttons">
                <button class="tryAgain-btn" onclick="window.location.reload();">Try Again</button>
                <button class="goHome-btn" onclick="location.href='index.html'">Go Home</button>
            </div>`;

  const pieChart = document.querySelector(".piechart");
  const value = document.querySelector(".value");
  let StartValue = -1;
  let EndValue = (score / quizData.questions.length) * 100;
  let speed = 20.0;
  //console.log(EndValue);

  let progress = setInterval(() => {
    StartValue++;
    //console.log(StartValue);
    value.textContent = `${StartValue}%`;
    pieChart.style.background = `conic-gradient(#b300ff ${
      StartValue * 3.6
    }deg, rgba(255,255,255, .1) 0deg)`;
    if (StartValue >= EndValue) {
      clearInterval(progress);
    }
  }, speed);

  scoreContainer.style.display = "flex";
  // Hide navigation buttons
  quizContainer.style.display = "none";
  nextButton.style.display = "none";
  submitButton.style.display = "none";
}
