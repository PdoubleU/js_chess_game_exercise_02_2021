import Game from './components/game.js';

let newGame = document.querySelector('.refresh').addEventListener('click', () => new Game(15));