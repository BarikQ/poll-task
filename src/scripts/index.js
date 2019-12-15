const range = document.querySelector(".answer-range");
const answer = document.querySelector(".answer-value");
const NEXT_BUTTON = document.querySelector("#button-next");
const IMAGE_SRC = document.querySelector(".question-image");
const QUESTION_TEST = document.querySelector(".question-text");
const NUMBER = document.querySelector(".question-number");
const START_BUTTON = document.querySelector("#button-start");
const ANSWER_BUTTON = document.querySelector("#button-answer");
const PREVIEW = document.querySelector("#preview");
const GAME = document.querySelector("#game");
const COMPARE = document.querySelector("#compare");
const RIGHT_ANSWER = document.querySelector("#right-answer");
const USER_ANSWER = document.querySelector("#user-answer");
const RANGE_CONTAINER = document.querySelector("#range-container");
const POST_CONTAINER = document.querySelector("#post-container");
const POST_TEXT = document.querySelector("#post-text");
const FINAL = document.querySelector("#final");
const FINAL_TEXT = document.querySelector("#final-text");
const RESTART = document.querySelector("#restart");

const PREMISSIBLE_VALUE = 5;

const JSON_PATH = "./questions.JSON";
let questionsData = null;

class App {
  constructor() {
    this.current = 0;
    this.rightAnswers = 0;
    this.wrongAnswers = 0;
  }

  start() {
    range.addEventListener("input", this.drawValue);
    ANSWER_BUTTON.addEventListener("click", () => this.answerQuestion());
    NEXT_BUTTON.addEventListener("click", () => this.generateQuestion());
    START_BUTTON.addEventListener("click", () => this.startQuiz());
    RESTART.addEventListener("click", () => this.restart());

    range.value = 50;
    NEXT_BUTTON.classList.add("display-false");
    this.drawValue();
    this.writeSlider();
  }

  drawValue() {
    answer.innerHTML = `${range.value}%`;
  }

  answerQuestion() {
    USER_ANSWER.innerHTML = `${range.value}%`;
    if (
      parseInt(range.value) <=
        questionsData.questions[this.current].answer + PREMISSIBLE_VALUE &&
      parseInt(range.value) >=
        questionsData.questions[this.current].answer - PREMISSIBLE_VALUE
    ) {
      this.rightAnswer();
    } else this.wrongAnswer();

    RANGE_CONTAINER.classList.add("display-false");
    ANSWER_BUTTON.classList.add("display-false");
    NEXT_BUTTON.classList.remove("display-false");
    this.current += 1;
  }

  generateQuestion() {
    if (this.current >= questionsData.questions.length) {
      GAME.classList.add("display-false");
      FINAL.classList.remove("display-false");
      if (this.rightAnswers > this.wrongAnswers) {
        FINAL_TEXT.innerHTML = `Красава вы чота знаете!`;
      } else FINAL_TEXT.innerHTML = `Да ничо вы не знаете!`;

      return 0;
    }

    range.value = 50;
    NEXT_BUTTON.classList.add("display-false");
    POST_CONTAINER.classList.add("display-false");
    ANSWER_BUTTON.classList.remove("display-false");
    RANGE_CONTAINER.classList.remove("display-false");

    // this.reCreateRange();
    this.writeSlider();
    IMAGE_SRC.src = `${questionsData.questions[this.current].image}`;
    QUESTION_TEST.innerHTML = `${
      questionsData.questions[this.current].question
    }`;
    RIGHT_ANSWER.innerHTML = `${questionsData.questions[this.current].answer}%`;
    POST_TEXT.innerHTML = `${questionsData.questions[this.current].post_text}`;
    NUMBER.innerHTML = `${this.current + 1}/${questionsData.questions.length}`;
  }

  startQuiz() {
    PREVIEW.classList.add("display-false");
    GAME.classList.remove("display-false");

    this.getData();
  }

  getData() {
    fetch(
      "https://raw.githubusercontent.com/BarikQ/poll-task/master/questions.json"
    )
      .then(res => res.json())
      .then(data => {
        IMAGE_SRC.src = `${data.questions[this.current].image}`;
        QUESTION_TEST.innerHTML = `${data.questions[this.current].question}`;
        RIGHT_ANSWER.innerHTML = `${data.questions[this.current].answer}%`;
        POST_TEXT.innerHTML = `${data.questions[this.current].post_text}`;
        questionsData = data;
      })
      .then(
        res =>
          (NUMBER.innerHTML = `${this.current + 1}/${
            questionsData.questions.length
          }`)
      );
  }

  rightAnswer() {
    COMPARE.classList.remove("answer-wrong");
    COMPARE.classList.add("answer-right");
    POST_CONTAINER.classList.remove("display-false");
    POST_TEXT.innerHTML = `${
      questionsData.questions[this.current].right_answer_text
    }`;
    this.rightAnswers += 1;
  }

  wrongAnswer() {
    COMPARE.classList.remove("answer-right");
    COMPARE.classList.add("answer-wrong");
    POST_CONTAINER.classList.remove("display-false");
    POST_TEXT.innerHTML = `${
      questionsData.questions[this.current].wrong_answer_text
    }`;
    this.wrongAnswers += 1;
  }

  writeSlider() {
    function writeStyle(a) {
      var b = inlineStyleContent.map(a => a.id).indexOf(a.id),
        c = "";
      -1 === b ? inlineStyleContent.push(a) : (inlineStyleContent[b] = a);
      for (let a of inlineStyleContent)
        c +=
          "#" +
          a.id +
          "::-webkit-slider-runnable-track{background-size:" +
          a.percent +
          "% 100%} ";
      inlineStyle.textContent = c;
    }
    var inlineStyle = document.createElement("style"),
      rangeSelector = document.querySelectorAll("[type=range]"),
      inlineStyleContent = new Array();
    document.body.appendChild(inlineStyle);
    var eventname = new Event("input");
    for (let a of rangeSelector)
      a.addEventListener(
        "input",
        function() {
          let a = Number(this.getAttribute("max") - this.getAttribute("min")),
            b =
              ((Number(this.value) + Math.abs(this.getAttribute("min"))) / a) *
              100;
          writeStyle({ id: this.id, percent: b });
        },
        !1
      ),
        a.dispatchEvent(eventname);
  }

  restart() {
    this.current = 0;
    this.rightAnswers = 0;
    this.wrongAnswers = 0;
    FINAL.classList.add("display-false");
    GAME.classList.remove("display-false");
    this.generateQuestion();
  }
}

let app = new App();

app.start();
