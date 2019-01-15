//1047 pm
var theInterval;
var questionList = [];
var qNum = 0; // question number
var rightAnswers = 0;
var wrongAnswers = 0;
var timeouts = 0;
var scratch = document.getElementById("myScratch");
class quizelement {
     constructor(question, answers, correctanswer) {
          this.question = question;
          this.answers = answers;
          this.correctAnswer = correctanswer;
     }
     isCorrect(theiranswer) {
          return this.correctAnswer == theiranswer;
     }
     show_correctanswer(isTimeout) {
          scratch.play();
          if (isTimeout == "timeout")
               $(".dialog").html(`<h1>You ran out of time! The correct answer is: ${this.answers[this.correctAnswer]}</h1>`);
          else
               $(".dialog").html(`<h1>The correct answer is: ${this.answers[this.correctAnswer]}</h1>`);
     }
     display_html() {
          $(".question").html(`<h1 class='jumbotron'>${this.question}</h1>`);
          $(".answers").html(this.answers.map((answer, answerNumber) => {
               return `<h1 class="jumbotron answers" id="${answerNumber}">${answer}</h1>`;
          }));
     }
}
function allowNewGame() {  // resetstuff and show button to run again if youse wishes
     clearInterval(theInterval);
     $(".question").empty();
     $(".answers").empty();
     $(".dialog").empty();
     $("#preGame").show();
     timeouts = 0;
     rightAnswers = 0;
     wrongAnswers = 0;
     qNum = 0;
}
function endOfGame() {
     clearInterval(theInterval);
     $("#timer").empty();
     $(".dialog").html(`<h1>Final Report,  Right:${rightAnswers} Wrong:${wrongAnswers} Timeouts: ${timeouts}`);
     setTimeout(allowNewGame, 3000);
}
function score(evalAnswer) {
     var doDelay = false;
     clearInterval(theInterval);
     if (evalAnswer === 'timeout') {
          timeouts++;
          doDelay = true;
          questionList[qNum].show_correctanswer(evalAnswer);
     }
     if (evalAnswer === true) {
          rightAnswers++;
          doDelay = false;
     }
     if (evalAnswer === false) {
          wrongAnswers++;
          doDelay = true;
          questionList[qNum].show_correctanswer(evalAnswer);
     }
     if (questionList.length === qNum + 1) // just hit last question number
     {
         
          questionList[qNum].show_correctanswer(evalAnswer);
          setTimeout(endOfGame,doDelay ? 3000 : 0,"score");
     } 
     return doDelay;
}

function countDown(i, callback) {
          clearInterval(theInterval);
          theInterval = setInterval(function () {
          $("#timer").html("Seconds Remaining: " + i);
          if ((i--) === 0) {
               score("timeout");
               setTimeout(nextQuestion, 3000);
          }
     }, 1000);
}

function nextQuestion(doPause) {
     clearInterval(theInterval);
     $(".dialog").empty();
     //if game has ended show the results and allow user to play again
     if (qNum != questionList.length - 1) {
          qNum++;
          questionList[qNum].display_html();
          countDown(20, score);
     }
}

questionList.push(new quizelement("Which continent ironically does not have any ants?",
     ["A. South America", "B. Asia","C. Europe","D. Antarctica" ], 3));
questionList.push(new quizelement("Are nickels made out of wood?", ["yes", "no"], 1));
questionList.push(new quizelement("Are trees made out of wood?", ["yes", "no"], 0));
questionList.push(new quizelement("Are pennies made out of wood?", ["yes", "no"], 1));

$("#playGame").click(function () {
     $("#preGame").hide();
     qNum = 0;
     questionList[qNum].display_html();
     countDown(20, score);

});

$(".answers").click(function (event) {
     clearInterval(theInterval);
     doDelay = score(questionList[qNum].isCorrect(event.target.id));
     if (qNum < questionList.length - 1) {
          setTimeout(nextQuestion, doDelay ? 3000 : 0);
     }
     return false;  //stack overflow said to add this line. Event was happening twice and I am unsure why this is needed... (*/
});