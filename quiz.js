let currentQuestionIndex = 0;
let userResponses = [];
let quizData;

const quizTitleSelect = document.getElementById("quizTitle");
const quizContainer = document.getElementById("quizContainer");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
const loadButton = document.getElementById("loadButton");
const scoreContainer = document.getElementById("scoreContainer");
const quiz1 = document.getElementsByClassName("quiz1");

// Load quiz titles from localStorage
const quizTitles = Object.keys(localStorage).filter((title) =>
  isValidQuizData(localStorage.getItem(title))
);
quizTitles.forEach((title) => {
  const option = document.createElement("option");
  option.value = title;
  option.textContent = title;
  quizTitleSelect.appendChild(option);
});

function isValidQuizData(data) {
  try {
    const parsedData = JSON.parse(data);
    return (
      parsedData && parsedData.title && Array.isArray(parsedData.questions)
    );
  } catch (error) {
    return false;
  }
}
function loadQuiz() {
  const selectedTitle = quizTitleSelect.value;

  // Check if the selected title exists in localStorage
  if (!localStorage.getItem(selectedTitle)) {
    alert("Selected quiz title does not exist.");
    return;
  }

  // Reset variables for a new quiz
  currentQuestionIndex = 0;
  userResponses = [];

  // Retrieve quiz data from localStorage based on the selected title
  const jsonData = localStorage.getItem(selectedTitle);
  quizData = JSON.parse(jsonData);
  scoreContainer.style.display = "none";

  const quizContainer = document.querySelector(".quizContainer");
  const quiz1 = document.querySelector(".quiz1");
  quizContainer.classList.add("active");
  quiz1.classList.add("active");

  // Display quiz questions
  showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
  var a = 0;
  var b = 0;
  quizContainer.innerHTML = `<h1>${quizData.title}</h1>
                    <legend>Question ${index + 1}</legend>
                    <h2 class="question-text">${
                      quizData.questions[index].text
                    }</h2>
                    <div class="option-list">
                        ${quizData.questions[index].choices
                          .map(
                            (choice) =>
                              `<div class="option"><input type="radio" id="radio${a++}" name="q${index}" value="${choice}"><label for="radio${b++}"> ${choice} </label></div>`
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
  showQuestion(currentQuestionIndex);
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
    if (userResponses[i] === quizData.questions[i].correctAnswer) {
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
  console.log(EndValue);

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
