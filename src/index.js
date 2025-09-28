const Game = require('./Game.js');
const Battleship = require('./Battleship.js');
const gamePrelim = require('./gameprelim.js');
require('./style.css');

document.getElementsByTagName('h1')[0].addEventListener('click', e => {
  if (document.body.style.backgroundColor === 'rgb(255, 87, 34)') {
    document.body.style.backgroundColor = '#FFF';
    document.body.style.color = '#000';
    document.querySelector('.pass-screen').style.background = 'radial-gradient(circle at center, lightgreen, lightgreen, #67ef67, #49ef49)';

    document.querySelector('.selection').style.backgroundColor = ''
    document.querySelector('.selection').style.padding = '';
    document.querySelectorAll('ol > label').forEach(label => {
      label.style.backgroundColor = ''
      label.style.color = ''
      label.parentNode.style.borderColor = '';
    });
    e.target.classList.remove('dark-logo');
    e.target.classList.add('light-logo');
  } else {
    document.body.style.backgroundColor = 'rgb(255, 87, 34)';
    document.body.style.color = '#FFF';
    document.querySelector('div.pass-screen').style.background = 'radial-gradient(circle at center, lightslategrey, darkslategrey, black, black, black, black, black)';

    document.querySelector('.selection').style.backgroundColor = '#ff764b'
    document.querySelector('.selection').style.padding = '0 20px';
    document.querySelector('.selection').style.borderRadius = '10px';
    
    document.querySelectorAll('ol > label').forEach(label => {
      label.style.backgroundColor = '#ff764b'
      label.style.color = 'white'
      label.parentNode.style.borderColor = 'white';
    });
    e.target.classList.remove('light-logo');
    e.target.classList.add('dark-logo');
  }
});

document.querySelector('#new').addEventListener('click', () => {
  let matchtype = prompt('Do you want to play against the "computer" or "human"?');

  if (matchtype !== 'computer') matchtype = 'human';

  let game = new Game(matchtype);

  if (matchtype === 'human') {
    document.querySelector('h4.name-tag:nth-child(7)').innerText = 'You (Opponent\'s Ships)';
    document.querySelector('h4.name-tag:nth-child(9)').innerText = 'Opponent (Your Ships)';
  }

  if (matchtype === 'computer') {
    game.getFirstPlayer().getBoard().addAllShips(Battleship.generateRandomShips());
  }

  gamePrelim(game);
});

let matchtype = prompt('Do you want to play against the "computer" or "human"?');

if (matchtype !== 'computer') matchtype = 'human';

let game = new Game(matchtype);

if (matchtype === 'human') {
  document.querySelector('h4.name-tag:nth-child(7)').innerText = 'You (Opponent\'s Ships)';
  document.querySelector('h4.name-tag:nth-child(9)').innerText = 'Opponent (Your Ships)';
}

if (matchtype === 'computer') {
  game.getFirstPlayer().getBoard().addAllShips(Battleship.generateRandomShips());
}

gamePrelim(game);