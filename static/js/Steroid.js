document.querySelector('#startbutton').addEventListener('click', startGame);

function startGame() {
  if (blackJackGame['startGame'] === true) {
    document.querySelector('.container-4').style.display = 'none';
    document.querySelector('.container-5').style.display = 'block';
  }
}

/*function playerLogic() {
  let logic;
  if (player.value === "Single-Player") {
    logic = singlePlayer();
  } else if (player.value === 'Multi-Player') {
    logic = multiPlayer();
  }
  return logic;
}*/




function multiPlayer() {
  if (blackJackGame['single'] === false) {
    blackJackGame['startGame'] = true;
    blackJackGame['multi'] = true;
    if (blackJackGame['IsHit'] === true) {
      blackJackGame['IsStands'] = true;

      let card = randomCards();
      showCard(card, DEALER);
      updateScore(card, DEALER);
      showScore(DEALER);

      if (DEALER['score'] >= 19) {
        blackJackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);
        blackJackGame['IsHit'] = false;
      }
    }
  }
}
async function singlePlayer() {
  if (blackJackGame['multi'] === false) {
    // body...
    blackJackGame['startGame'] = true;
    blackJackGame['single'] = true;
    if (blackJackGame['IsHit'] === true) {
      blackJackGame['IsStands'] = true;
      while (DEALER['score'] < 16 && blackJackGame['IsStands'] === true) {
        let card = randomCards();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
      }

      blackJackGame['turnsOver'] = true;
      let winner = computeWinner();
      showResult(winner);
      blackJackGame['IsHit'] = false;
    }
  }
}


let blackJackGame = {
  "you": {
    "scorespan": "#your-blackjack-result",
    "div": "#your-box",
    "score": 0
  },
  "dealer": {
    "scorespan": "#dealer-blackjack-result",
    "div": "#dealer-box",
    "score": 0
  },
  "cards": ['2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'K',
    'Q',
    'J',
    'A'],
  "cardsMap": {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'K': 10,
    'J': 10,
    'Q': 10,
    'A': [1,
      11]
  },
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'IsHit': false,
  'IsStands': false,
  'turnsOver': false,
  'single': false,
  'multi': false,
  'startGame': false,
};


const YOU = blackJackGame['you'];
const DEALER = blackJackGame['dealer'];
//console.log(YOU.div);
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

document.querySelector("#blackjack-hit-button"). addEventListener('click', blackjackHit);

document.querySelector("#blackjack-stand-button"). addEventListener('click', dealerLogic);

document.querySelector("#blackjack-deal-button"). addEventListener('click', blackjackDeal);

function blackjackHit() {
  if (blackJackGame['IsStands'] === false) {
    let card = randomCards();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    blackJackGame['IsHit'] = true;
  }
}

function randomCards() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackJackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackDeal() {
  if (blackJackGame['turnsOver'] === true) {
    blackJackGame['IsStands'] = false;

    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

    //hitSound.play();
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (let i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }
    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#your-blackjack-result').style.color = '#ffffff';

    document.querySelector('#dealer-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

    document.querySelector('#blackjack-result').textContent = "Let's Play";
    document.querySelector('#blackjack-result').style.color = "black";

    blackJackGame['turnsOver'] = true;
  }
}

function updateScore(card, activePlayer) {
  if (card === 'A') {
    if (activePlayer['score'] + blackJackGame['cardsMap'][card][1] <= 21) {
      activePlayer['score'] += blackJackGame['cardsMap'][card][1];
    } else {
      activePlayer['score'] += blackJackGame['cardsMap'][card][0];
    }
  } else {
    activePlayer['score'] += blackJackGame['cardsMap'][card];
  }
}



function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scorespan']).textContent = 'BURST!';
    document.querySelector(activePlayer['scorespan']).style.color = 'red';
  } else {
    document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function dealerLogic() {
  singlePlayer();
  multiPlayer();
}





//Compute who just won and return it
//Update wins, losses and draws.
function computeWinner() {
  let winner;

  if (YOU['score'] <= 21) {
    if (YOU['score'] > DEALER['score'] || (DEALER['score']) > 21) {
      blackJackGame['wins']++;
      winner = YOU;
    } else if (YOU['score'] < DEALER['score']) {
      blackJackGame['losses']++;
      winner = DEALER
    } else if (YOU['score'] === DEALER['score']) {
      blackJackGame['draws']++;
    }
  } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
    blackJackGame['losses']++;
    winner = DEALER
  } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
    blackJackGame['draws']++;
  }
  return winner;


}


function showResult(winner) {
  let message,
  messageColor;
  if (winner === YOU) {
    document.querySelector('#wins').textContent = blackJackGame['wins'];
    message = 'Player1 won';
    messageColor = 'green';
    winSound.play();
  } else if (winner === DEALER) {
    document.querySelector('#losses').textContent = blackJackGame['losses'];
    message = 'Player2 Won';
    messageColor = 'red';
    winSound.play();
  } else {
    document.querySelector('#draws').textContent = blackJackGame['draws'];
    message = 'Draw';
    messageColor = '#dcc806';
  }

  document.querySelector('#blackjack-result').textContent = message;
  document.querySelector('#blackjack-result').style.color = messageColor;
}


document.querySelector('.endGame').addEventListener('click', endGame);

/*
function endGame() {
  blackJackGame['wins'] = 0;
  blackJackGame['losses'] = 0;
  blackJackGame['draws'] = 0;

  document.querySelector('#losses').textContent = blackJackGame['losses'];
  document.querySelector('#wins').textContent = blackJackGame['wins'];
  document.querySelector('#draws').textContent = blackJackGame['draws'];

  document.querySelector('.container-4').style.display = 'block';
  document.querySelector('.container-5').style.display = 'none';


  let yourImages = document.querySelector('#your-box').querySelectorAll('img');
  let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

  //hitSound.play();
  for (let i = 0; i < yourImages.length; i++) {
    yourImages[i].remove();
  }
  for (let i = 0; i < dealerImages.length; i++) {
    dealerImages[i].remove();
  }

  
  YOU['score'] = 0;
  DEALER['score'] = 0;

  document.querySelector('#your-blackjack-result').textContent = 0;
  document.querySelector('#your-blackjack-result').style.color = '#ffffff';

  document.querySelector('#dealer-blackjack-result').textContent = 0;
  document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

  document.querySelector('#blackjack-result').textContent = "Let's Play";
  document.querySelector('#blackjack-result').style.color = "black";


  blackJackGame['IsStands'] = false;
  blackJackGame['multi'] = false;

}*/