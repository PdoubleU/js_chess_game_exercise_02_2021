import Game from './components/game.js';

const startButtons = document.querySelectorAll('.play')
const controlPanel = document.querySelector('.control_panel');
const startScreen = document.querySelector('.start_screen');
const allIntervals = 150; // this constat is just a estimate of how many moves are possible during one game, usually it is about 50-100
let newGame = null;


// this one is a kind of workaround (ugly, but works fine) to deal if during the game user is pressing new game button, and we have uncleared interval still in the memory:
startButtons.forEach(button => button.addEventListener('click', () => {
    controlPanel.classList.remove('hidden');
    startScreen.classList.add('hidden');
    if (!newGame) return newGame = new Game(300);
    // otherwise we need to clear all possible intervals (they're causing wrong countdown if we restart game)
    for (let i = 1; i <= allIntervals; i++) {
        clearInterval(i);
    }
    // if game doesnt exists we can create a new one, no worries about any intervals
    return newGame = new Game(300);
    })
)

document.querySelector('.undo').addEventListener('click', () => newGame.undoMove());