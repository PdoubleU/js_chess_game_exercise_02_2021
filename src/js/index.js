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
        this.selectAndMovePiece();
        this.evaluatePieceProperties();
        this.renderPanel();

    }

    evaluatePieceProperties(id, target, board) {
        console.log('eval props');
        if(this.turn === 'white') {
            for (let i = 0; i< this.whiteSetOfPieces.length; i++) {
                if (this.whiteSetOfPieces[i].id === id) {
                    console.log('white set: ');
                    this.whiteSetOfPieces[i].validateMove = [id, target, board];
                    (this.whiteSetOfPieces[i]._isMoveValid) ? this.whiteSetOfPieces[i].updatePosition = target : void 0;
                    return this.whiteSetOfPieces[i]._isMoveValid
                }
            }

        }
        else if(this.turn === 'black') {
            for (let i = 0; i< this.blackSetOfPieces.length; i++) {
                if (this.blackSetOfPieces[i].id === id) {
                    console.log('black set: ');
                    this.blackSetOfPieces[i].validateMove = [id, target, board];
                    (this.blackSetOfPieces[i]._isMoveValid) ? this.blackSetOfPieces[i].updatePosition = target : void 0;
                    return this.blackSetOfPieces[i]._isMoveValid
                }
            }
        }
    }
    selectAndMovePiece() {
        this.listOfSquares.forEach(square => square.addEventListener('click', e => {
            console.log(e.target.id)
            if (this.choosenPieceID === e.target.id) {
                this.choosenPieceID = null;
                return;
            }
            else if (this.choosenPieceID != e.target.id
                    && this.choosenPieceID != null) {

                let currSquare = document.querySelector(`#${this.choosenPieceID}`),
                    currSquareClass = currSquare.classList[2],
                    targetRow = e.target.id.split('')[1],
                    targetColumn = e.target.id.split('')[0],
                    currentRow = this.choosenPieceID.split('')[1],
                    currentColumn = this.choosenPieceID.split('')[0];

                if(this.evaluatePieceProperties(currSquareClass, e.target.id, this.currentBoard)){
                    console.log(this.evaluatePieceProperties(currSquareClass, e.target.id, this.currentBoard));
                    // switch turns depends on the current this.turn value:
                    this.switchPlayer()
                    // switch timer:
                        // to do
                    // update this.currentBoard:
                    this.currentBoard.board[targetColumn][targetRow - 1][1] = this.currentBoard.board[currentColumn][currentRow - 1][1];
                    this.currentBoard.board[currentColumn][currentRow - 1][1] = null;
                    // render updated board:
                    this.renderBoard();
                    // reset variable:
                    this.choosenPieceID = null;

                    return;
                } else {
                    this.choosenPieceID = null;
                }

            }
            else {
                this.choosenPieceID = e.target.id;
            }
        }
        ));
    }
    renderBoard() {
        // render board inside index.html or update the board if moved piece:
        if(document.querySelector('.board_container')) {
            document.querySelector('.board_container').remove()
            this.root.append(this.currentBoard.printBoard())
            // refresh Node list:
            this.listOfSquares = document.querySelectorAll('.square')
            this.selectAndMovePiece()
        } else {
            this.root.append(this.currentBoard.printBoard())
        }
    }
    renderPanel() {
        document.querySelector('.player').innerHTML = this.turn;
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
    switchTimer() {
        //to do
    }
    addBoardStateToHistory(){
        //to do
    }
    switchPlayer() {
        this.turn = this.turn === 'white' ? 'black' : 'white';
        this.renderPanel()
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
        this._targetSquare = null;
        this._board = null;
        this._isMoveValid = null;

        this.specialMoveObj = true;
        this.promoteMoveObj = true;
        this.captureMoveObj = this.captureMoveObj();
        this.basicMoveObj = this.straightMoveObj();
    }
    set validateMove(args) {
        this._targetSquare = args[1]
        this._board = args[2]
        console.log(this.position)
        console.log(this._targetSquare)
        let targetX = this._targetSquare.split('')[0].charCodeAt(0),
            targetY = parseInt(this._targetSquare.split('')[1]),
            currentX = this.position[0].charCodeAt(0),
            currentY = parseInt(this.position[1]);

        console.log(this.captureMoveObj);

        return this.isMoveCapture([targetY, currentY, targetX, currentX])
    }
    get validateMove() {
        return this._isMoveValid
    }
    //update set of coordinates:
    set updatePosition(coors) {
        return this.position = [coors.split('')[0], parseInt(coors.split('')[1])]
    }
    // methods for generating different sets of objects, each object consinsts details about how
    // the piece should or shouldn't move on the board - these objects are assinged to variables
    // in constructor:
    straightMoveObj() {
        let obj;
        this.color === 'white'
        ?
        obj = { x : 0, y : 1 }
        :
        obj = { x : 0, y : -1 }
        return obj;
    }
    captureMoveObj() {
        let obj;
        this.color === 'white'
        ?
        obj = { x : [-1, 1], y : 1 }
        :
        obj = { x : [-1, 1], y : -1 }
        return obj;
    }
    promoteMoveObj() {
        let obj;
        this.color === 'white'
        ?
        obj = { x : 0, y : 1 }
        :
        obj = { x : 0, y : -1 }
        return obj;
    }
    // methods, which are taking as parameters the objects set in constructor and arguments passed
    // through getter validateMove(). All methods are executed in validateMove and all together
    // infuence the returned boolean value:
    isMoveStraight(args){
        if ((args[0] - args[1] == this.basicMoveObj.y) && (args[2] - args[3] == this.basicMoveObj.x)) {
            return this._isMoveValid = true
        } else {
            return this._isMoveValid = false
        }
    }
    isMoveCapture(args){
        console.log(args[0] - args[1] == this.captureMoveObj.y);
        console.log(args[2] - args[3] == this.captureMoveObj.x[0]);
        console.log(args[2] - args[3] == this.captureMoveObj.x[1]);
        if ((args[0] - args[1] == this.captureMoveObj.y) && (args[2] - args[3] == this.captureMoveObj.x[0] || args[2] - args[3] == this.captureMoveObj.x[1])) {
            return this._isMoveValid = true
        } else {
            return this._isMoveValid = false
        }
    }
    isMovePromote(){

    }
    isMoveObstacle(){

    }



}
class Rook {
    constructor(id, coordinates, color){
        this.id = id;
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}
class Knight {
    constructor(id, coordinates, color){
        this.id = id;
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}
class Bishop {
    constructor(id, coordinates, color){
        this.id = id;
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}
class Queen {
    constructor(id, coordinates, color){
        this.id = id;
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}
class King {
    constructor(id, coordinates, color){
        this.id = id;
        this.color = color;
        this.position = coordinates;
        this.move = null;
        this.specialMove = true;
        this.promote = true;
        this.capture = null;
    }
}


let newGame = new Game(15);
let refresh = document.querySelector('.refresh').addEventListener('click', () => newGame.renderBoard())
