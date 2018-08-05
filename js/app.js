//before reading this code, be sure to read the read me.
//test push

/*
 * Create a list that holds all of your cards
 */
const icons = ['fa fa-diamond','fa fa-diamond',"fa fa-paper-plane-o","fa fa-paper-plane-o","fa fa-anchor","fa fa-anchor","fa fa-bolt","fa fa-bolt","fa fa-cube","fa fa-cube","fa fa-leaf","fa fa-leaf","fa fa-bicycle","fa fa-bicycle","fa fa-bomb","fa fa-bomb"];

//array containing the open cards
let openCards = [];
//array containing the matched cards
let matchedCards = [];

/*
// Globals
*/
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let cleanSlate = false;

//card container
const cardContainer = document.querySelector('.deck');
//restart button
const restartButtn = document.querySelector('.restart');

//shuffle icons
shuffle(icons);

//initialize the game

function init(){
  //build the deck
  for (let i = 0; i < icons.length; i++){
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `<i class="${icons[i]}"></i>`;
    cardContainer.appendChild(card);
    //add click event
    cardClick(card);
  }
}




/*
 * click event
 */

 function cardClick(card){
   card.addEventListener('click', function(){
     if (openCards.length === 1){
       const currentCard = this;
       const previousCard = openCards[0];
       card.classList.add('open','show','disabled');
       openCards.push(this);

       /*
       ** All functions below do the following:
       * compare the 2 cards
       * add a move to the card counter (also updates HTML)
       * check the score to see if a card should be removed
       * check to see if the game is over, if so stop clock and toggle modal
       */
       compare(currentCard,previousCard);
       addMove();
       checkScore();
       gameOver();
     } else if(openCards.length < 1){
       openCards.push(this);
       card.classList.add('open','show','disabled');
     } clockRun();
   });
 }
 /*
 // compare the 2 clicked cards inner html to see if they match, if they do add 'match' class, if not 'close' the cards
 */
 function compare(currentCard,previousCard){
   if(currentCard.innerHTML === openCards[0].innerHTML){
     currentCard.classList.add('match');
     previousCard.classList.add('match');
     matchedCards.push(openCards);
     openCards = [];
   } else { setTimeout(function() {
     currentCard.classList.remove('open','show','disabled');
     previousCard.classList.remove('open','show','disabled');
     openCards = [];
   }, 1000);
   }
 }

//add a move for ever two cards flipped
function addMove(){
  moves++;
  const movesText = document.querySelector('.moves');
  if(moves === 1){
    movesText.innerHTML = moves + ' Move';
  } else {
    movesText.innerHTML = moves + ' Moves';
  }
}

//check the score 'hideStar' if moves === 16 || 24
function checkScore(){
  if (moves === 16 || moves === 24){
    hideStar();
  }
}
//this function hides a star and is called in the checkScore function after 16 & 24 moves
function hideStar(){
  const starList = document.querySelectorAll('.stars li');
  for(star of starList){
    if(star.style.display !== 'none'){
      star.style.display = 'none';
      break;
    }
  }
}



/*
//Timer functions that start, stop, and display the time
*/
//clock fucntion that starts the time
function startClock(){
  clockId = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}
//check to see if the clock is running, if not start it after the first click
function clockRun(){
  if(clockOff === true){
    clockOff = false;
    startClock();
  }
}
//stop the Timer
function clockStop(){
  clearInterval(clockId);
}
//display the time in html
function displayTime(){
  const clock = document.querySelector('.clock');
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if(seconds < 10){
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

//check to see if the game is over(if matched cards =8), if so, toggle modal and stop the clock
function gameOver(){
  if(matchedCards.length === 8){
    clockStop();
    toggleModal();
  }
}

/*
//modal functions
*/


function toggleModal(){
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
  modalStats();
}

//grabs the stats from the game and add them to the modal(moves, stars, time)
function modalStats(){
  const timeStat = document.querySelector('.modal_time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starsStat = document.querySelector('.modal_stars');
  const stars = getStars();
  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML =  `Stars = ${stars}`;
}


//this bad boy looks to see how many stars don't have the class of 'none' and returns them
function getStars(){
  stars = document.querySelectorAll('.stars li');
  starCounter = 0;
  for(star of stars){
    if(star.style.display !== 'none'){
      starCounter++;
    }
  }
  return starCounter;
}

//cancel button that only toggles the modal, possibly a future share button
document.querySelector('.modal_cancel').addEventListener('click', function(){
  toggleModal();
});
document.querySelector('.modal_close').addEventListener('click', function(){
  toggleModal();
});
//replay button basically resets the game (clears cards, timer, and reshuffles)
document.querySelector('.modal_replay').addEventListener('click', function(){
  restartGame();
  toggleModal();
  cardContainer.innerHTML = [];
  init();
  matchedCards = [];
});


//restart button
restartButtn.addEventListener('click', function(){
  //delete all the cards
  cardContainer.innerHTML = [];
  //initialize the game again and shuffle the cards
  init();
  shuffle(icons);
  //clear matched cards array and reset all other ...attributes? i can't think of the word...it runs the restartGame function
  matchedCards = [];
  restartGame();
});


/*
// Reset game functions
*/
//restart game function call all functions that 'reset' the scores
function restartGame(){
  clearClock();
  clearMoves();
  clearStars();
  shuffle(icons);
}
function clearClock(){
  clockStop();
  time = 0;
  clockOff = true;
  displayTime();
}

function clearMoves(){
  moves = 0;
  const starList = document.querySelector('.moves').innerHTML = moves;
}
function clearStars(){
  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for(star of starList){
    star.style.display = 'inline';
  }
}
init();












/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
