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

        this.makeSetOfPieces();
        this.movePiece();
        this.checkIfValidMove('h3', 'a2', { x: 0, y: 1});


    }
    switchTimer() {
        //to do
    }
    addBoardStateToHistory(){
        //to do
    }
    checkIfValidMove(targetPosition, currPosition, allowedMove) {
        let targetX = targetPosition.split('')[0].charCodeAt(0),
            targetY = parseInt(targetPosition.split('')[1]),
            currentX = currPosition.split('')[0].charCodeAt(0),
            currentY = parseInt(currPosition.split('')[1]),
            allowedX = allowedMove.x,
            allowedY = allowedMove.y;
        /* set of console log tests:
        console.log(targetX);
        console.log(targetY);

        console.log(currentX);
        console.log(currentY);
        
        console.log(allowedX);
        console.log(allowedY);

        console.log(targetY - currentY);
        console.log(targetX - currentX);
        */
        ((targetY - currentY == allowedY) && (targetX - currentX == allowedX))
        ?
        true
        :
        false;
    }
    movePiece() {
        console.log(this.whiteSetOfPieces.length);
        console.log(this.whiteSetOfPieces[1]);
        this.listOfSquares.forEach(square => square.addEventListener('click', e => {
            e.preventDefault();
            console.log(this.whiteSetOfPieces);
            if (this.choosenPiece === e.target.id) {
                this.choosenPiece = null;
                return;
            }
            else if (this.choosenPiece != e.target.id && this.choosenPiece != null && this.checkIfValidMove(e.target.id, this.choosenPiece, this.whiteSetOfPieces[0].basicMove)) {
                let currSquare = document.querySelector(`#${this.choosenPiece}`),
                    moveOnSquare = document.querySelector(`#${e.target.id}`),
                    currSquareClass = currSquare.classList[2];

                console.log(e.target.id)

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
        // render board inside index.html: 
        this.root.append(this.currentBoard.printBoard())
    }
    makeSetOfPieces() {
        // method iterate through initialy set board and fill two arrays with newly created objects which unique names and coordinates on the board:
        for (let elem in this.currentBoard.board) {
            for (let i = 0; i < this.currentBoard.board[elem].length; i++) {
                let pieceID = this.currentBoard.board[elem][i][1],
                    coordinates = [elem, this.currentBoard.board[elem][i][0]]
                if (pieceID === 'null') {
                    void 0;
                }
                else if(/B_|K_|N_|P_|R_|Q_/.test(pieceID)) {
                    switch(pieceID.match(/[A-Z]_/)[0]) {
                        case 'P_':
                            this.whiteSetOfPieces.push(new Pawn(pieceID, coordinates, 'white'));
                            break;
                        case 'R_':
                            this.whiteSetOfPieces.push(new Rook(pieceID, coordinates, 'white'));
                            break;
                        case 'N_':
                            this.whiteSetOfPieces.push(new Knight(pieceID, coordinates, 'white'));
                            break;
                        case 'B_':
                            this.whiteSetOfPieces.push(new Bishop(pieceID, coordinates, 'white'));
                            break;
                        case 'Q_':
                            this.whiteSetOfPieces.push(new Queen(pieceID, coordinates, 'white'));
                            break;
                        case 'K_':
                            this.whiteSetOfPieces.push(new King(pieceID, coordinates, 'white'));
                            break;
                        default:
                            console.log('Error: index.js:89, switch statement')
                            break;
                    }

                }
                else if(/b_|k_|n_|p_|r_|q_/.test(pieceID)) {
                    switch(pieceID.match(/[a-z]_/)[0]) {
                        case 'p_':
                            this.blackSetOfPieces.push(new Pawn(pieceID, coordinates, 'black'));
                            break;
                        case 'r_':
                            this.blackSetOfPieces.push(new Rook(pieceID, coordinates, 'black'));
                            break;
                        case 'n_':
                            this.blackSetOfPieces.push(new Knight(pieceID, coordinates, 'black'));
                            break;
                        case 'b_':
                            this.blackSetOfPieces.push(new Bishop(pieceID, coordinates, 'black'));
                            break;
                        case 'q_':
                            this.blackSetOfPieces.push(new Queen(pieceID, coordinates, 'black'));
                            break;
                        case 'k_':
                            this.blackSetOfPieces.push(new King(pieceID, coordinates, 'black'));
                            break;
                        default:
                            console.log('Error: index.js:146, switch statement')
                            break;
                    }
                }

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
            this.board[String.fromCharCode(i)][1][1] = `P_${String.fromCharCode(i)}`;
            this.board[String.fromCharCode(i)][6][1] = `p_${String.fromCharCode(i)}`;
        }
        for (let i = 97; i < 105; i += 7){
            // rooks:
            this.board[String.fromCharCode(i)][0][1] = `R_${String.fromCharCode(i)}`;
            this.board[String.fromCharCode(i)][7][1] = `r_${String.fromCharCode(i)}`;
        }
        for (let i = 98; i < 104; i += 5){
            // knights:
            this.board[String.fromCharCode(i)][0][1] = `N_${String.fromCharCode(i)}`;
            this.board[String.fromCharCode(i)][7][1] = `n_${String.fromCharCode(i)}`;
        }
        for (let i = 99; i < 103; i += 3){
            // bishops:
            this.board[String.fromCharCode(i)][0][1] = `B_${String.fromCharCode(i)}`;
            this.board[String.fromCharCode(i)][7][1] = `b_${String.fromCharCode(i)}`;
        }
        // kings and qeens:
        this.board[String.fromCharCode(100)][0][1] = `Q_d`;
        this.board[String.fromCharCode(100)][7][1] = `q_d`;
        this.board[String.fromCharCode(101)][0][1] = `K_e`;
        this.board[String.fromCharCode(101)][7][1] = `k_e`;
    }
    // method called just after creating the board. This method returns html tags with elements referencing to all squares on chessboard with their proper id's:
    printBoard(){
        let color = 'b',
            container = document.createElement('div');
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
    constructor(id, coordinates, color){
        this.id = id;
        this.color = color;
        this.position = coordinates;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
        this.basicMove = this.setMove();
    }
    setMove() {
        let obj;
        this.color === 'white'
        ?
        obj = { x : 1, y : 0 }
        :
        obj = { x : -1, y : 0 }
        return obj;
    }
}
class Rook {
    constructor(coordinates, color){
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}
class Knight {
    constructor(coordinates, color){
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}
class Bishop {
    constructor(coordinates, color){
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}
class Queen {
    constructor(coordinates, color){
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}
class King {
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