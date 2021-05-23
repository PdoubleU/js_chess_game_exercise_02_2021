import Game from './components/game.js';

let newGame;

document.querySelector('.refresh').addEventListener('click', () => newGame = new Game(300));

document.querySelector('.undo').addEventListener('click', () => newGame.undoMove());