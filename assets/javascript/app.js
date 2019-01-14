
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
               $(".dialog").html(`<h1>You ran out of time! The correct Answer was:${this.answers[this.correctAnswer]}</h1>`);
          else
               $(".dialog").html(`<h1>The correct Answer was:${this.answers[this.correctAnswer]}</h1>`);
     }
     display_html() {
          $(".question").html(`<h1 class='jumbotron'>${this.question}</h1>`);
          $(".answers").html(this.answers.map((answer, answerNumber) => {
               return `<h1 class="jumbotron answers" id="${answerNumber}">${answer}</h1>`;
          }));
     }
}
function allowNewGame() {
     console.log("new game stsate");
     $(".question").empty();
     $(".answers").empty();
     $(".dialog").empty();
     $("#timer").empty();
     $("#preGame").show();
     timeouts = 0;
     rightAnswers = 0;
     wrongAnswers = 0;
     qNum = 0;
}
function endOfGame() {
     clearInterval(theInterval);
     $(".dialog").html(`<h1>Final Report,  Right:${rightAnswers} Wrong:${wrongAnswers} Timeouts: ${timeouts}`);
     setTimeout(allowNewGame, 5000);
}
function score(evalAnswer) {
     var doDelay = false;
     clearInterval(theInterval);
     if (evalAnswer === 'timeout') {
          timeouts++;
          questionList[qNum].show_correctanswer(evalAnswer);
          doDelay = true;
     }
     if (evalAnswer === true) {
          rightAnswers++;
          doDelay = false;
     }
     if (evalAnswer === false) {
          wrongAnswers++;
          questionList[qNum].show_correctanswer(evalAnswer);
          doDelay = true;
     }

     if (questionList.length === qNum + 1) // just hit last question number
     {
          console.log("call end of game");
          endOfGame();
     }
     console.log("score dodelay=" + doDelay);
     return doDelay;
}

function countDown(i, callback) {
     theInterval = setInterval(function () {
          $("#timer").html("Seconds Remaining: " + i);
          if ((i--) === 0) {
               score("timeout");
               clearInterval(theInterval);
               console.log(qNum + "is qunum ");
               if (questionList.length === qNum + 1) // just hit last question number
                    endOfGame();
               else
                    setTimeout(nextQuestion, 5000);
               console.log("stuck");
          }
     }, 1000);
}

function nextQuestion(doPause) {
     console.log("begin nextquertion function");
     $(".dialog").empty();
     //if game has ended show the results and allow user to play again
     if (qNum == questionList.length - 1) {
          endOfGame();
     }
     else {
          qNum++;
          questionList[qNum].display_html();
          countDown(10, score);
     }
}


questionList.push(new quizelement("0are nickels made out of wood?", ["yes", "no"], 1));
questionList.push(new quizelement("1 are trees made out of wood?", ["yes", "no"], 0));
questionList.push(new quizelement("2 cents made out of wood?", ["yes", "no"], 1));
questionList.push(new quizelement("3 nickels made out of wood?", ["yes", "no"], 1));

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
          console.log("nextQuestion, delay=" + (doDelay ? 5000 : 0));
          setTimeout(nextQuestion, doDelay ? 5000 : 0);
     }
     else {
          console.log("finished");
     }
     /* return false;  /stack overflow said to add this line. Event was happening twice and I am unsure why this is needed... (*/
});