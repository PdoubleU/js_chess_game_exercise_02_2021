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

    evaluatePieceProperties(id, target, board, targPosition) {
        if(this.turn === 'white') {
            for (let i = 0; i< this.whiteSetOfPieces.length; i++) {
                if (this.whiteSetOfPieces[i].id === id) {
                    this.whiteSetOfPieces[i].validateMove = [id, target, board];
                    (this.whiteSetOfPieces[i]._isMoveValid) ? this.whiteSetOfPieces[i].updatePosition = target : void 0;
                    (this.whiteSetOfPieces[i].promote === true && this.whiteSetOfPieces[i]._isMoveValid) ? this.promotePawn(this.whiteSetOfPieces[i], i, targPosition) : void 0;
                    return this.whiteSetOfPieces[i]._isMoveValid
                }
            }
        }
        else if(this.turn === 'black') {
            for (let i = 0; i< this.blackSetOfPieces.length; i++) {
                if (this.blackSetOfPieces[i].id === id) {
                    this.blackSetOfPieces[i].validateMove = [id, target, board];
                    (this.blackSetOfPieces[i]._isMoveValid) ? this.blackSetOfPieces[i].updatePosition = target : void 0;
                    (this.blackSetOfPieces[i].promote === true && this.blackSetOfPieces[i]._isMoveValid) ? this.promotePawn(this.blackSetOfPieces[i], i, targPosition) : void 0;
                    return this.blackSetOfPieces[i]._isMoveValid
                }
            }
        }
    }
    selectAndMovePiece() {
        this.listOfSquares.forEach(square => square.onclick = (e) => {
            if (e.target.classList[2] === 'null' && this.choosenPieceID === null) {
                return;
            }
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
                if(this.evaluatePieceProperties(currSquareClass, e.target.id, this.currentBoard, [targetColumn, targetRow])){
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
        );
    }
    promotePawn(object, index, targetPosition) {
        let takeNewPiece = (e) => {
            let args = [`${e.target.id[0]}_${object.position[0]}`, object.position, object.color];
            if (object.color === 'white'){
                switch(e.target.id.match(/[A-Z]_/)[0]) {
                    case 'R_':
                        this.whiteSetOfPieces[index] = new Rook(...args);
                        break;
                    case 'N_':
                        this.whiteSetOfPieces[index] = new Knight(...args);
                        break;
                    case 'B_':
                        this.whiteSetOfPieces[index] = new Bishop(...args)
                        break;
                    case 'Q_':
                        this.whiteSetOfPieces[index] = new Queen(...args)
                        break;
                    default:
                        console.error('Error: new piece wasn\'t added to set, occured in method promotePawn, class Game');
                        break;
                    }
                this.currentBoard.board[targetPosition[0]][targetPosition[1] - 1][1] = args[0]
                this.renderBoard()
                return document.querySelector(`.promote_${args[2]}`).style.visibility = 'hidden'
            }
            else if (object.color === 'black'){
                switch(e.target.id.match(/[a-z]_/)[0]) {
                    case 'r_':
                        this.blackSetOfPieces[index] = new Rook(...args)
                        break;
                    case 'n_':
                        this.blackSetOfPieces[index] = new Knight(...args)
                        break;
                    case 'b_':
                        this.blackSetOfPieces[index] = new Bishop(...args)
                        break;
                    case 'q_':
                        this.blackSetOfPieces[index] = new Queen(...args)
                        break;
                    default:
                        console.error('Error: new piece wasn\'t added to set, occured in method promotePawn, class Game');
                        break;
                    }
                this.currentBoard.board[targetPosition[0]][targetPosition[1] - 1][1] = args[0]
                this.renderBoard()
                document.querySelector(`.promote_${args[2]}`).style.visibility = 'hidden'
            }
        }
        document.querySelector(`.promote_${object.color}`).style.visibility = 'visible'
        document.querySelectorAll(`.fig_${object.color}`)
        .forEach(elem =>
            elem.onclick = e => takeNewPiece(e)
            );
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
                    let args = [pieceID, coordinates, 'white']
                    switch(pieceID.match(/[A-Z]_/)[0]) {
                        case 'P_':
                            this.whiteSetOfPieces.push(new Pawn(...args));
                            break;
                        case 'R_':
                            this.whiteSetOfPieces.push(new Rook(...args));
                            break;
                        case 'N_':
                            this.whiteSetOfPieces.push(new Knight(...args));
                            break;
                        case 'B_':
                            this.whiteSetOfPieces.push(new Bishop(...args));
                            break;
                        case 'Q_':
                            this.whiteSetOfPieces.push(new Queen(...args));
                            break;
                        case 'K_':
                            this.whiteSetOfPieces.push(new King(...args));
                            break;
                        default:
                            console.error('Error: set of pieces wasn\'t created, check method makeSetOfPiecec in class Game');
                            break;
                    }
                }
                else if(/b_|k_|n_|p_|r_|q_/.test(pieceID)) {
                    let args = [pieceID, coordinates, 'black']
                    switch(pieceID.match(/[a-z]_/)[0]) {
                        case 'p_':
                            this.blackSetOfPieces.push(new Pawn(...args));
                            break;
                        case 'r_':
                            this.blackSetOfPieces.push(new Rook(...args));
                            break;
                        case 'n_':
                            this.blackSetOfPieces.push(new Knight(...args));
                            break;
                        case 'b_':
                            this.blackSetOfPieces.push(new Bishop(...args));
                            break;
                        case 'q_':
                            this.blackSetOfPieces.push(new Queen(...args));
                            break;
                        case 'k_':
                            this.blackSetOfPieces.push(new King(...args));
                            break;
                        default:
                            console.error('Error: set of pieces wasn\'t created, check method makeSetOfPiecec in class Game');
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
        let color = 'bl', container = document.createElement('div');
        container.classList.add('board_container')
        for (let elem in this.board) {
            let column = document.createElement('div');
            column.classList.add('column', `${elem}`)
            container.append(column)
            for (let i = 0; i < this.board[elem].length; i++) {
                let square = document.createElement('div'),
                styleClassName = (this.board[elem][i][1] !== null) ? this.board[elem][i][1].split('')[0] : 'null';
                square.classList.add('square', `${color}`, `${this.board[elem][i][1]}`, styleClassName);
                square.id = `${elem}${this.board[elem][i][0]}`;
                square.textContent = `${elem}${this.board[elem][i][0]}`;
                container.lastChild.prepend(square);
                (i === this.board[elem].length - 1)
                ?
                color = color
                :
                color = color === 'bl' ? 'w' : 'bl';
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
        this.specialMove = true;
        this.enPassant = false;
        this.promote = false;

        this.specialMoveObj = this.specialMoveObj();
        this.captureMoveObj = this.captureMoveObj();
        this.basicMoveObj = this.straightMoveObj();
    }
    set validateMove(args) {
        this._targetSquare = args[1]
        this._board = args[2]
        let targetX = this._targetSquare.split('')[0].charCodeAt(0),
            targetY = parseInt(this._targetSquare.split('')[1]),
            currentX = this.position[0].charCodeAt(0),
            currentY = parseInt(this.position[1]),
            objOnTargSquare = this._board.board[this._targetSquare.split('')[0]][parseInt(this._targetSquare.split('')[1] - 1)][1],
            capture = () => this.isMoveCapture([targetY, currentY, targetX, currentX, objOnTargSquare]),
            basic = () => this.isMoveStraight([targetY, currentY, targetX, currentX]),
            special = () => this.isMoveSpecial([targetY, currentY, targetX, currentX]),
            obstacle = () => this.isMoveObstacle([targetY, currentY, currentX]),
            promote = () => this.isMovePromote(targetY);
        if (capture()) {
            promote();
            this.specialMove = false;
            return this._isMoveValid = true;
        }
        else if (special() && this.specialMove && obstacle()) {
            promote();
            this.specialMove = false;
            return this._isMoveValid = true;
        }
        else if (basic() && obstacle()) {
            promote();
            this.specialMove = false;
            return this._isMoveValid = true;
        }
        else {
            return this._isMoveValid = false;
        }

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
    specialMoveObj() {
        let obj;
        this.color === 'white'
        ?
        obj = { x : 0, y : 2 }
        :
        obj = { x : 0, y : -2 }
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
    // methods, which are taking as parameters the objects set in constructor and arguments passed
    // through getter validateMove(). All methods are executed in validateMove and all together
    // infuence the returned boolean value:
    isMoveStraight(args){
        if ((args[0] - args[1] == this.basicMoveObj.y) && (args[2] - args[3] == this.basicMoveObj.x)) {
            return true
        } else {
            return false
        }
    }
    isMoveSpecial(args){
        if (args[0] - args[1] == this.specialMoveObj.y &&
        args[2] - args[3] == this.specialMoveObj.x) {
            return true
        } else {
            return false
        }
    }
    isMoveCapture(args){
        // to do: enPassant
        if ((args[0] - args[1] == this.captureMoveObj.y) &&
            (args[2] - args[3] == this.captureMoveObj.x[0] || args[2] - args[3] == this.captureMoveObj.x[1]) &&
            this.isCapturedPieceEnemy(args[4])) {
            return true
        } else {
            return false
        }
    }
    isMovePromote(targetRow){
        if (this.color === 'white') {
            if (targetRow === 8) {
                return this.promote = true
            }
        } else {
            if (targetRow === 1) {
                return this.promote = true
            }
        }
    }
    isMoveObstacle(args){
        if (this.color === 'white') {
            for (let i = args[0] - 1; i > args[1] - 1; i--) {
                if (this._board.board[String.fromCharCode(args[2])][i][1] !== null) {
                    return false
                }
            }
            return true
        }
        else {
            for (let i = args[0] - 1; i < args[1] - 1; i++) {
                if (this._board.board[String.fromCharCode(args[2])][i][1] !== null) {
                    return false
                }
            }
            return true
        }
    }
    isCapturedPieceEnemy(targPiece) {
        // to do: enPassant
        if (this.color === 'white')  {
            return (/[a-z]_/.test(targPiece))
        } else  {
            return (/[A-Z]_/.test(targPiece))
        }
    }
}
class Rook {
    constructor(id, coordinates, color){
        this.id = id;
        this.color = color;
        this.position = coordinates;
        this._targetSquare = null;
        this._board = null;
        this._isMoveValid = null;
        this.castling = true;

        this.basicMoveObj = this.straightMoveObj();
    }
    set validateMove(args) {
        this._targetSquare = args[1]
        this._board = args[2]
        let targetX = this._targetSquare.split('')[0].charCodeAt(0),
            targetY = parseInt(this._targetSquare.split('')[1]),
            currentX = this.position[0].charCodeAt(0),
            currentY = parseInt(this.position[1]),
            objOnTargSquare = this._board.board[this._targetSquare.split('')[0]][parseInt(this._targetSquare.split('')[1] - 1)][1],
            capture = this.isMoveCapture([targetY, currentY, targetX, currentX, objOnTargSquare]),
            basic = this.isMoveStraight([targetY, currentY, targetX, currentX]),
            special = this.isMoveSpecial([targetY, currentY, targetX, currentX]),
            obstacle = this.isMoveObstacle([targetY, currentY, targetX, currentX]);

        if (capture && basic && obstacle) {
            this.castling = false
            return this._isMoveValid = true;
        }
        else {
            return this._isMoveValid = false;
        }

    }
    get validateMove() {
        return this._isMoveValid
    }
    //update set of coordinates:
    set updatePosition(coors) {
        return this.position = [coors.split('')[0], parseInt(coors.split('')[1])]
    }
    straightMoveObj() {
        return  { x : 0, y : 0 }
    }
    specialMoveObj() {
        let obj;
        this.color === 'white'
        ?
        obj = { x : 0, y : 2 }
        :
        obj = { x : 0, y : -2 }
    }
    captureMoveObj() {
        let obj;
        this.color === 'white'
        ?
        obj = { x : [-1, 1], y : 1 }
        :
        obj = { x : [-1, 1], y : -1 }
    }
    isMoveStraight(args){
        if ((args[0] - args[1] == this.basicMoveObj.y) || (args[2] - args[3] == this.basicMoveObj.x)) {
            return true
        } else {
            return false
        }
    }
    isMoveSpecial(args){
        // to do (castling)
    }
    isMoveCapture(args){
        if (this.isCapturedPieceEnemy(args[4])) {
            return true
        } else {
            return false
        }
    }
    isMoveObstacle(args){
        if (args[0] - args[1] == this.basicMoveObj.y) {
            if (args[2] > args[3]) {
                for (let i = args[2] - 1; i > args[3]; i--) {
                    if (this._board.board[String.fromCharCode([i])][args[0] - 1][1] !== null) {
                        return false
                    }
                }
            } else if (args[2] < args[3]) {
                for (let i = args[2] + 1; i < args[3]; i++) {
                    if (this._board.board[String.fromCharCode([i])][args[0] - 1][1] !== null) {
                        return false
                    }
                }
            }
            return true
        }
        else if (args[2] - args[3] == this.basicMoveObj.x){
            if (args[0] > args[1]) {
                for (let i = args[0] - 2; i > args[1] - 1; i--) {
                    if (this._board.board[String.fromCharCode(args[2])][i][1] !== null) {
                        return false
                    }
                }
            } else if (args[0] < args[1]) {
                for (let i = args[0]; i < args[1] - 1; i++) {
                    if (this._board.board[String.fromCharCode(args[2])][i][1] !== null) {
                        return false
                    }
                }
            }
            return true
        }
    }
    isCapturedPieceEnemy(targPiece) {
        if (targPiece === null) {
            return true
        }
        else if (this.color === 'white')  {
            return (/[a-z]_/.test(targPiece))
        }
        else {
            return (/[A-Z]_/.test(targPiece))
        }
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
