class Game {
    constructor(gameTime) {
        this.gameTime = gameTime;
        this.whiteSetOfPieces = [];
        this.blackSetOfPieces = [];
        this.whiteTime = null;
        this.blackTime = null;
        this.turn = 'white';
        this.capturedWhite = [];
        this.capturedBlack = [];
        this.currentBoard = new Board;
        this.root = document.querySelector('#root');
        this.renderedBoard =  this.renderBoard();
        this.gameHistory = [];
        this.choosenPice = null;
        this.listOfSquares = document.querySelectorAll('.square');

        this.movePiece();
        this.makeSetOfPieces = this.makeSetOfPieces.bind(this);

    }
    switchTimer() {
        //to do
    }
    addBoardStateToHistory(){

    }
    movePiece() {
        this.listOfSquares.forEach(square => square.addEventListener('click', e => {
            if (this.choosenPiece === e.target.id) {
                this.choosenPiece = null;
                return;
            }
            else if (this.choosenPiece != e.target.id && this.choosenPiece != null) {
                let currSquare = document.querySelector(`#${this.choosenPiece}`),
                moveOnSquare = document.querySelector(`#${e.target.id}`),
                currSquareClass = currSquare.classList[2];

                moveOnSquare.classList.remove(e.target.classList[2]);
                currSquare.classList.remove(currSquareClass);
                currSquare.classList.add('null');
                moveOnSquare.classList.add(currSquareClass);
                this.choosenPiece = null;
                // switch turns depends on the current this.turn value:
                this.turn = this.turn === 'white' ? 'black' : 'white';
                // switch timer:
                    // to do
                return;
            }
            else {
                this.choosenPiece = e.target.id;
            }
        }
        ));
    }
    renderBoard() {
        this.root.append(this.currentBoard.printBoard())
    }
    makeSetOfPieces() {
        console.log('pik');
        for (let elem in this.currentBoard.board) {
            for (let i = 0; i < this.currentBoard.board[elem].length; i++) {
                console.log(this.currentBoard.board[elem][i])
            }
        }
    }

}

class Board {
    constructor(){
        // below define rows and  first column name represented as integer 97 which is refering to lower case letter 'a' in asci:
        this.rows = 8;
        this.firstColumn = 97;
        // property board represents the newly created board thanks to method createBoard()
        this.board = this.createBoard();
        //call method to populate already created board with uppercase or lowercase letters all refering particular piece. Uppercase for White pieces.
        //P,p: pawns; R,r: rooks; N,n: knights; B,b: bishops; Q,q: queen; K,k: king:
        this.populateWithPieces();
    }
    createBoard() {
        let board = {};
            for (let i = 97; i < 105; i++) {
                board[String.fromCharCode(i)] = [];
                for (let j = 1; j <= this.rows; j++) {
                    board[String.fromCharCode(i)].push([j, null]);
                }
            }
        return board;
    }
    populateWithPieces() {
        // if piece appears multiple times in on colour then class name has additional appendix to differ between pieces:
        for (let i = 97; i < 105; i++){
            // pawns:
            this.board[String.fromCharCode(i)][1][1] = `P-${String.fromCharCode(i)}`;
            this.board[String.fromCharCode(i)][6][1] = `p-${String.fromCharCode(i)}`;
        }
        for (let i = 97; i < 105; i += 7){
            // rooks:
            this.board[String.fromCharCode(i)][0][1] = `R-${String.fromCharCode(i)}`;
            this.board[String.fromCharCode(i)][7][1] = `r-${String.fromCharCode(i)}`;
        }
        for (let i = 98; i < 104; i += 5){
            // knights:
            this.board[String.fromCharCode(i)][0][1] = `N-${String.fromCharCode(i)}`;
            this.board[String.fromCharCode(i)][7][1] = `n-${String.fromCharCode(i)}`;
        }
        for (let i = 99; i < 103; i += 3){
            // bishops:
            this.board[String.fromCharCode(i)][0][1] = `B-${String.fromCharCode(i)}`;
            this.board[String.fromCharCode(i)][7][1] = `b-${String.fromCharCode(i)}`;
        }
        // kings and qeens:
        this.board[String.fromCharCode(100)][0][1] = 'Q';
        this.board[String.fromCharCode(100)][7][1] = 'q';
        this.board[String.fromCharCode(101)][0][1] = 'K';
        this.board[String.fromCharCode(101)][7][1] = 'k';
    }
    // method called just after creating the board. This method returns html tags with elements referencing to all squares on chessboard with their proper id's:
    printBoard(){
        let color = 'b';
        let container = document.createElement('div');
        container.classList.add('board_container')
        for (let elem in this.board) {
            let column = document.createElement('div');
            column.classList.add('column', `${elem}`);
            container.append(column);
            for (let i = 0; i < this.board[elem].length; i++) {
                let square = document.createElement('div');
                square.classList.add('square', `${color}`, `${this.board[elem][i][1]}`);
                square.id = `${elem}${this.board[elem][i][0]}`;
                square.textContent = `${elem}${this.board[elem][i][0]}`;
                container.lastChild.prepend(square);
                if (i === this.board[elem].length - 1)  {
                    color = color;
                } else {
                    color = color === 'b' ? 'w' : 'b';
                }
            }
        }
        return container;
    }
}

class Pawn {
    constructor(coordinates, color){
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}


let newGame = new Game(15);
newGame.makeSetOfPieces();




