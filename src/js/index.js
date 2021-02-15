class Board {
    constructor(){
        // below define rows and columns, as well as first column name represents as integer 97 which is refering to lower case letter a in asci
        this.rows = 8;
        this.firstColumn = 97;
        // property board represents the newly created board thanks to method createBoard()
        this.board = this.createBoard();

        //call set of methods to populate already created board with uppercase or lowercase letters all refering particular piece. Uppercase for White pieces.
        //P,p: pawns; R,r: rooks; N,n: knights; B,b: bishops; Q,q: queen; K,k: king:
        this.populatePawns();
        this.populateRooks();
        this.populateKnights();
        this.populateBishops();
        this.populateQueens();
        this.populateKings();
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
    populatePawns() {
        for (let i = 97; i < 105; i++){
            this.board[String.fromCharCode(i)][1][1] = 'P';
            this.board[String.fromCharCode(i)][6][1] = 'p';
        }
    }
    populateRooks() {
        for (let i = 97; i < 105; i += 7){
            this.board[String.fromCharCode(i)][0][1] = 'R';
            this.board[String.fromCharCode(i)][7][1] = 'r';
        }
    }
    populateKnights() {
        for (let i = 98; i < 104; i += 5){
            this.board[String.fromCharCode(i)][0][1] = 'N';
            this.board[String.fromCharCode(i)][7][1] = 'n';
        }
    }
    populateBishops() {
        for (let i = 99; i < 103; i += 3){
            this.board[String.fromCharCode(i)][0][1] = 'B';
            this.board[String.fromCharCode(i)][7][1] = 'b';
        }
    }
    populateQueens() {
        this.board[String.fromCharCode(100)][0][1] = 'Q';
        this.board[String.fromCharCode(100)][7][1] = 'q';
    }
    populateKings() {
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
                square.classList.add('square', `${this.board[elem][i][1]}`, `${color}`);
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

class Move {
    constructor(id, piece, isFirst) {
        this.id = id;
        this.piece = piece;
        this.isFirst = isFirst;
        this.currentSquare = null;
        this.nextSquare = null;
    }

    firstClick() {
        if (this.isFirst !== null) {
            console.log('false, this is not first click!');
            return false;
        } else {
            this.currentSquare = this.id;
            console.log('first click!');
            return true;
        }
    }
    secondClick() {
        if (this.isFirst === null) {
            console.log('false, this is not second click!');
            return false;
        } else {
            this.nextSquare = this.id;
            console.log('second click!');
            return true;
        }
    }
}


let newGame = new Board();
console.log(newGame.board);

let root = document.querySelector('#root');
root.append(newGame.printBoard())

let isFirst = null;

document.querySelectorAll('.square').forEach(element => element.addEventListener('click', e => {
            let checkMove = new Move(e.target.id, null, isFirst)
            if(checkMove.firstClick()) {
                isFirst = e.target.id;
            }
            if (checkMove.secondClick()) {
                isFirst = null;
            };
        }
    )
)


