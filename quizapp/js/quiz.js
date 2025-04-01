import { ButtonOption } from "../components/ButtonOption.js";
import { ButtonSubmit } from "../components/ButtonSubmit.js";
import { questionsByCategory, quizProgress } from "./main.js";

let optionButtons = []; // 存储选项按钮，避免重复创建
let nextButton = null; // 存储 Next 按钮，避免重复创建
let flag = 0;
let questionData;
const optionIds = ["A", "B", "C", "D"];
const questionContainer = document.getElementById("question");
const questionOptions = document.getElementById("question-options");
const questionText = document.getElementById("question-text");
const questionIndex = document.getElementById("question-index");
const quizCompletedText = document.getElementById("quizCompleted");
const quizResult = document.getElementById("quiz-results");
const score = document.getElementById("score");
const category = document.getElementById("category");
const icon = document.getElementById("icon");

function initializeQuestionButton() {
  optionIds.forEach((id, index) => {
    const button = new ButtonOption(
      id,
      questionData.options[index],
      "var(--Grey50)",
      handleSelection
    );
    button.attachTo("#" + id);
    optionButtons.push(button);
    handleSelection;
  });
}

function showResult(icons) {
  // **显示结果**
  quizCompletedText.style.display = "block";
  quizResult.style.display = "flex";
  questionContainer.style.display = "none";
  questionOptions.style.display = "none";
  score.textContent = quizProgress.correctAnswers;
  category.textContent = quizProgress.currentCategory;
  icon.innerHTML = icons[quizProgress.currentCategory];

  const playAgainButton = new ButtonSubmit(
    "Play Again",
    "var(--Purple600)",
    playAgain
  );
  playAgainButton.attachTo("#quiz-results");
}

function playAgain() {
  localStorage.removeItem("quizProgress");
  quizResult.style.display = "none";
  quizCompletedText.style.display = "none";
  window.location.reload();
}

// **下一题按钮逻辑**
function nextQuestion() {
  flag = 0;
  quizProgress.currentQuestionIndex++;
  localStorage.setItem("quizProgress", JSON.stringify(quizProgress));
  startquiz(questionsByCategory, quizProgress);
}

function handleSelection(event) {
  const options = document.querySelectorAll("#question-options button"); // 获取所有选项按钮

  // 移除其他选项的 btn-selected 类
  options.forEach((option) => {
    option.classList.remove("btn-selected");
  });

  event.currentTarget.classList.add("btn-selected");
}

function handleOptionClick(event) {
  const spans = event.target.querySelectorAll("span");
  if (spans[1] && flag === 0) {
    console.log(flag);
    console.log("选择了:", spans[1].textContent);
    let selectedOption = spans[1].textContent; // 获取第二个 <span> 的文本内容
    let correctOption = questionData.answer;
    console.log("正确答案:", correctOption);

    if (selectedOption === correctOption) {
      quizProgress.correctAnswers++;
      localStorage.setItem("quizProgress", JSON.stringify(quizProgress));
    } else {
      event.target.classList.add("btn-wrong");
    }
  }
  flag = 1;
}

export function startquiz(questionsByCategory, quizProgress, icons) {
  const questions = questionsByCategory.questions;
  if (quizProgress.currentQuestionIndex >= questions.length) {
    showResult(icons);
    return;
  }

  // update question data

  questionData = questions[quizProgress.currentQuestionIndex];
  questionText.textContent = questionData.question;
  questionIndex.textContent = `Question ${
    quizProgress.currentQuestionIndex + 1
  } of ${questions.length}`;

  // initialize question buttons or update text
  if (optionButtons.length === 0) {
    initializeQuestionButton();
  } else {
    optionButtons.forEach((button, index) => {
      const spans = button.element.querySelectorAll("span");
      if (spans.length > 1) {
        spans[1].textContent = questionData.options[index]; // 修改第二个 span 的文本
      }
    });
  }

  if (!nextButton) {
    nextButton = new ButtonSubmit(
      "Next Question",
      "var(--Purple600)",
      nextQuestion
    );
    nextButton.attachTo("#question-options");
  }
}
