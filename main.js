//select element
let countspan = document.querySelector(".count span")
let bullets = document.querySelector(".bullets")
let bullesSpanContainer= document.querySelector(".bullets .spans")
let quizarea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area")
let submitButton = document.querySelector(".submit-button")
let resultContainer = document.querySelector(".results")
let countdownelemet= document.querySelector(".countdown")
//set options
let currentIndex = 0
let rightanswers = 0
let countdownInterval
function getquestion(){
    //ajax request
    let myrequest = new XMLHttpRequest()

myrequest.onreadystatechange= function(){
    if (this.readyState=== 4 && this.status === 200){
        let questionObject = JSON.parse(this.responseText)
        let qCount= questionObject.length
   //creat bullets + set question count
   creatbullets(qCount)
   //add question data
   addQuestionData(questionObject[currentIndex],qCount)

   //countdown
   countdown(5, qCount)

   //click on submit
   submitButton.onclick = () =>{
//get right answer
let therightanswer= questionObject[currentIndex].right_answer
// console.log(therightanswer)

//increase curent index
currentIndex++

//check the answer
chackAnswer(therightanswer, qCount)

//remove old question
quizarea.innerHTML=""
answersArea.innerHTML= ""

   //add question data
   addQuestionData(questionObject[currentIndex],qCount)

   //handle bullets class
   handleBullets()

//start countdown
clearInterval(countdownInterval)
countdown(5, qCount)

//show result
showResults(qCount)

   }
    }
}

    myrequest.open("GET","html_question.json",true)
    myrequest.send()
}
getquestion()
//show questions count + questions category
function creatbullets(num){
    countspan.innerHTML=num
//creat spans
for(let i=0; i<num; i++){
    //creat span
    let thebullets = document.createElement("span")
    
    //check if its first span
if(i===0){
thebullets.className="on"
}

//append the bullets to main container
bullesSpanContainer.appendChild(thebullets)
}
}
function addQuestionData(obj, count){
    if(currentIndex<count){
  //creat h2 question title
  let questionTitle = document.createElement("h2")

  //creat question text
  let qusetiontext = document.createTextNode(obj["title"])
  
  //append text to h2
  questionTitle.appendChild(qusetiontext)
  
  //append the h2 to the quiz area
  quizarea.appendChild(questionTitle)
  
  //creat the answers
  for(let i= 1; i<=4; i++){
  //creat main answer div
  let mainDiv = document.createElement("div")
  
  //add class to the main div
  mainDiv.className="answer"
  
  //creat radio input
  let radioinput = document.createElement("input")
  
  //add type + name+id +data-attribute
  radioinput.name= "Question"
  radioinput.type= "radio"
  radioinput.id= `answer_${i}`
  radioinput.dataset.answer = obj[`answer_${i}`]
  
  //make first one checked
  if(i===1){
      radioinput.checked=true
  }
  
  //creat label
  let thelabel = document.createElement("label")
  
  //add for attribute
  thelabel.htmlFor = `answer_${i}`
  
  //creat label text
  let thelabletext = document.createTextNode( obj[`answer_${i}`])
  
  //add the text to lable
  thelabel.appendChild(thelabletext)
  
  //add input + label to the main div
  mainDiv.appendChild(radioinput)
  mainDiv.appendChild(thelabel)
  
  //append all divs to answers area
  answersArea.appendChild(mainDiv)
  
  }
    }
}

function chackAnswer(ranswer, count){
let answers = document.getElementsByName("Question")
let thechoosenanswer
for(let i = 0; i<answers.length; i++){
if(answers[i].checked){
    thechoosenanswer= answers[i].dataset.answer
}
}
// console.log(`right answer ${ranswer}`)
// console.log(`choosen answer ${thechoosenanswer }`)
if(ranswer === thechoosenanswer){
rightanswers++
console.log("good answer")
}
}
function handleBullets(){
    let bullespans = document.querySelectorAll(".bullets .spans span")
    let arrayofspans = Array.from(bullespans)
    arrayofspans.forEach((span, index ) => {
if(currentIndex ===index){
span.className= "on"
}
    })
}
function showResults(count){
    let theResults
    if(currentIndex === count){
quizarea.remove()
answersArea.remove()
submitButton.remove()
bullets.remove()

if(rightanswers > (count / 2) && rightanswers <count){
    theResults=`<span class="good">good</span>, ${rightanswers} from ${count}  `
}else if(rightanswers === count ){
    theResults=`<span class="perfect">perfect</span>, all answers id good `
}else{
    theResults=`<span class="bad">bad</span>, ${rightanswers} from ${count}  `
}

resultContainer.innerHTML= theResults
resultContainer.style.padding="10px"
resultContainer.style.backgroundColor="white"
resultContainer.style.margin.Top="10px"
    }
}
//timer
function countdown(duration, count){
    if(currentIndex<count){
  let minutes, seconds
countdownInterval= setInterval(function (){
    minutes= parseInt(duration/ 60)
    seconds = parseInt(duration % 60)

    minutes= minutes < 10?`0${minutes}`: minutes
    seconds= seconds < 10?`0${seconds}`: seconds


    countdownelemet.innerHTML = `${minutes} : ${seconds}`
if(--duration < 0){
clearInterval(countdownInterval)
submitButton.click()
}



},1000)

    }
}