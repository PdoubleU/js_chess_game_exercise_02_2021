import cloneDeep from './lodash.clonedeep.js';
import GameStateProvider from './gamestateprovider.js';
import Bishop from './bishop.js';
import Rook from './rook.js';
import King from './king.js';
import Queen from './queen.js';
import Knight from './knight.js';
import Pawn from './pawn.js';
import Board from './board.js';
import clockify from "../helpers.js";

export default class Game {
    constructor(gameTime) {
        this.whiteSetOfPieces = new Array();
        this.blackSetOfPieces = new Array();
        this.whiteTime = gameTime;
        this.blackTime = gameTime;
        this.currentTimer = null;
        this.blackTimerDisplay = document.querySelector('.timer_black');
        this.whiteTimerDisplay = document.querySelector('.timer_white');
        this.turn = 'white';
        this.isGameOver = false;
        this.capturedWhite = new Array();
        this.capturedBlack = new Array();
        this.currentBoard = new Board;
        this.root = document.querySelector('#root');
        this.choosenPieceID = null;
        this.listOfSquares = null;
        this.whiteKingChecked = false;
        this.blackKingChecked = false;
        this.gameHistory = new Array();
        this.currentState = new GameStateProvider;
        this.setStateParams = new Array();
        this.enPassantPawnCoors = [];
        this.enPassantPawnBoardCoors = [];

        this.makeSetOfPieces();
        this.undoMove();
        this.renderPanel();
        this.renderBoard();
        this.listOfSquares = document.querySelectorAll('.square');
        this.selectAndMovePiece();
        this.copyCurrState();
        this.setState(...this.setStateParams);
    }

    setState(
        whiteSetOfPieces,
        blackSetOfPieces,
        whiteTime, blackTime,
        turn, capturedWhite, capturedBlack,
        currentBoard,
        choosenPieceID, listOfSquares,
        whiteKingChecked, blackKingChecked
    ) {
        this.currentState.whiteSetOfPieces = whiteSetOfPieces,
        this.currentState.blackSetOfPieces = blackSetOfPieces,
        this.currentState.whiteTime = whiteTime,
        this.currentState.blackTime = blackTime,
        this.currentState.turn = turn,
        this.currentState.capturedWhite = capturedWhite,
        this.currentState.capturedBlack = capturedBlack,
        this.currentState.currentBoard = currentBoard,
        this.currentState.choosenPieceID = choosenPieceID,
        this.currentState.listOfSquares = listOfSquares,
        this.currentState.whiteKingChecked = whiteKingChecked,
        this.currentState.blackKingChecked = blackKingChecked
    }
    copyCurrState(){
        // return array of copied variables from constructor representing the current game state:
        return this.setStateParams = [
            cloneDeep(this.whiteSetOfPieces),
            cloneDeep(this.blackSetOfPieces),
            this.whiteTime, this.blackTime,
            this.turn, cloneDeep(this.capturedWhite), cloneDeep(this.capturedBlack),
            cloneDeep(this.currentBoard),
            this.choosenPieceID, cloneDeep(this.listOfSquares),
            this.whiteKingChecked, this.blackKingChecked
        ]
    }
    updateHistory() {
        // gameHistory get a new element which represents the recent state of the game taken thanks to GameStateProvider
        this.gameHistory.push(this.currentState.saveMemento());
    }
    undoMove() {
        // return when the history is empty (the very first stage of the game):
        if (this.gameHistory.length < 1) return;
        // restore memento update this.currentState by taking the last item from the gameHistory:
        this.currentState.restoreMemento(this.gameHistory.pop());
        // block below update constructor variables using the restored this.currentState:
            this.whiteSetOfPieces = cloneDeep(this.currentState.whiteSetOfPieces)
            this.blackSetOfPieces = cloneDeep(this.currentState.blackSetOfPieces)
            this.whiteTime = this.currentState.whiteTime
            this.blackTime = this.currentState.blackTime
            this.turn = this.currentState.turn
            this.capturedWhite = cloneDeep(this.currentState.capturedWhite)
            this.capturedBlack = cloneDeep(this.currentState.capturedBlack)
            this.currentBoard = cloneDeep(this.currentState.currentBoard)
            this.choosenPieceID = this.currentState.choosenPieceID
            this.listOfSquares = cloneDeep(this.currentState.listOfSquares)
            this.whiteKingChecked = this.currentState.whiteKingChecked
            this.blackKingChecked = this.currentState.blackKingChecked

        // render board and panel with restored data:
        this.renderBoard();
        this.renderPanel();
    }
    evaluatePieceProperties(id, target, targetClass, board, [targX, targY], [currX, currY]) {
        // if choosen piece id is equal to value of default king position and target square is equal to value of default castling move for king, then execute castling() method:
        if ((this.choosenPieceID === 'e1' || this.choosenPieceID === 'e8') &&
            (target === 'c1' || target === 'g1' || target === 'c8' || target === 'g8')) {
            let [validation , { rookCurr,  rookTarg }] = this.castling(this.turn, target, board);

            if (!validation) {
                return false
                }
            // update current board after valid castling:
            this.currentBoard.board[targX][targY - 1][1] = this.currentBoard.board[currX][currY - 1][1];
            this.currentBoard.board[rookTarg[0]][rookTarg[1] - 1][1] = this.currentBoard.board[rookCurr[0]][rookCurr[1] - 1][1];
            this.currentBoard.board[currX][currY - 1][1] = null;
            this.currentBoard.board[rookCurr[0]][rookCurr[1] - 1][1] = null
            return true
        }
        let piece = this[`${this.turn}SetOfPieces`].find(elem => elem.id === id);
        let index = this[`${this.turn}SetOfPieces`].findIndex(elem => elem.id === id);
        if (piece) {
            piece.validateMove = [target, board];

            (piece._isMoveValid) ? piece.updatePosition = target : void 0;
            (piece.promote && piece._isMoveValid) ? this.promotePawn(piece, index, target) : void 0;
            if (piece._isMoveValid) {
                // remove enPassant from the board - opponent did or didn't capture pawn in enPassant:
                for (let col in this.currentBoard.board) {
                    this.currentBoard.board[col].forEach(square => square[1] === 'enPassant' && (square[1] = null));
                }
                // update current board after valid move:
                this.currentBoard.board[targX][targY - 1][1] = this.currentBoard.board[currX][currY - 1][1];
                this.currentBoard.board[currX][currY - 1][1] = null;
                // remove pawn from the board if was captured as enPassant target:
                if (targetClass === 'enPassant') {
                    this.currentBoard.board[this.enPassantPawnBoardCoors[0]][this.enPassantPawnBoardCoors[1] - 1][1] = null;
                }
                // code belowe set the square value to 'enPassant' which allows opponent to do enPassant capture:
                if (piece.enPassant) {
                    this.enPassantPawnCoors = [id, this.turn];
                    this.enPassantPawnBoardCoors = [targX, targY];
                    this.turn === 'white' ? this.currentBoard.board[currX][currY][1] = 'enPassant' : this.currentBoard.board[currX][currY - 2][1] = 'enPassant';
                }
            }

            return piece._isMoveValid
        }
        return false
    }
    selectAndMovePiece() {
        this.listOfSquares.forEach(square => square.onclick = (e) => {
            if (!e.target.classList[2] && this.choosenPieceID) {
                return;
            }
            if (this.choosenPieceID === e.target.id) {
                this.choosenPieceID = null;
                return;
            }
            else if (this.choosenPieceID != e.target.id && this.choosenPieceID) {
                let currSquare = document.querySelector(`#${this.choosenPieceID}`),
                    currSquareClass = currSquare.classList[2],
                    targetSquare = document.querySelector(`#${e.target.id}`),
                    targetSquareClass = targetSquare.classList[2],
                    targetRow = e.target.id.split('')[1],
                    targetColumn = e.target.id.split('')[0],
                    currentRow = this.choosenPieceID.split('')[1],
                    currentColumn = this.choosenPieceID.split('')[0],
                    oppositePlayer = (/[A-Z]_/.test(currSquareClass)) ? 'black' : 'white',
                    props = [currSquareClass, e.target.id, targetSquareClass, this.currentBoard, [targetColumn, targetRow], [currentColumn, currentRow]];

                if(this.evaluatePieceProperties(...props)){
                    // update game history with the current board status before valid move:
                    this.updateHistory();
                    // reset value of isChecked prop set for king and property white/blackKingIsChecked to default value false:
                    this.resetKingIsChecked(this.turn)
                    // remove captured piece from the correct set of pieces, it has to be done before rendering new board!:
                    this.rmItemFromSetOfPieces(/enPassant/.test(targetSquareClass) ? this.enPassantPawnCoors : [targetSquareClass, oppositePlayer]);
                    // render updated board:
                    this.renderBoard();
                    // looking for check:
                    this.kingChecked(oppositePlayer)
                    // switch turns depends on the current this.turn value:
                    this.switchPlayer();
                    // reset current timer (cancel setInterval for current player):
                    this.stopCurrentTimer();
                    // switch timer:
                    this.switchTimer();
                    this.renderPanel();
                    // reset variable:
                    this.choosenPieceID = null;
                    //copy and save current state:
                    this.copyCurrState();
                    this.setState(...this.setStateParams);
                    return;
                } else {
                    this.choosenPieceID = null;
                }
            }
            else {
                this.choosenPieceID = e.target.id;
            }
        });
    }
    kingChecked(color) {
        let kingPosition = this[`${color}SetOfPieces`].find(elem => (elem.id === 'k_e' || elem.id === 'K_e') ? elem : void 0);
        let king = kingPosition;
        kingPosition = kingPosition.position[0] + kingPosition.position[1];
        for (let i = 0; i < this[`${this.turn}SetOfPieces`].length; i++) {
            if(this[`${this.turn}SetOfPieces`][i].id ===  'k_e' || this[`${this.turn}SetOfPieces`][i].id === 'K_e') {
                void 1;
            }
            else {
                this[`${this.turn}SetOfPieces`][i].validateMove = [kingPosition, this.currentBoard];
                (this[`${this.turn}SetOfPieces`][i]._isMoveValid) ? this[`${color}KingChecked`] = true : void 0;
            }
        }
        if (this[`${color}KingChecked`] === true ) {
            king.checked = true;
        }
        if (king._isChecked === true) {
            for (let elem in this.currentBoard.board) {
                for (let i = 0; i < this.currentBoard.board[elem].length; i++) {
                    (this.currentBoard.board[elem][i][1] === king.id) ? document.getElementById(`${king.position[0] + king.position[1]}`).style.backgroundColor = 'red' : void 0;
                }
            }
        }
    }
    resetKingIsChecked(color) {
        let king = this[`${color}SetOfPieces`].find(elem => (elem.id === 'k_e' || elem.id === 'K_e') ? elem : void 0);
        this[`${color}KingChecked`] = false;
        king.checked = false;
    }
    rmItemFromSetOfPieces(params) {
        const [id, color] = params;
        if (!id) return;
        let tempArray = this[`${color}SetOfPieces`].filter(elem => (elem.id !== id) ? elem : void 1);
        this[`${color}SetOfPieces`] = tempArray;
    }
    promotePawn(object, index, targetPosition) {
        document.querySelector(`.promote_${object.color}`).style.visibility = 'visible'
        document.querySelectorAll(`.fig_${object.color}`)
        .forEach(elem => elem.onclick = e => takeNewPiece(e));
        let takeNewPiece = (e) => {
            let args = [`${e.target.id[0]}_${object.position[0]}`, object.position, object.color];
            switch(e.target.id.match(/[A-Z]_/i)[0]) {
                case 'r_':
                case 'R_':
                    this[`${object.color}SetOfPieces`][index] = new Rook(...args);
                    break;
                case 'n_':
                case 'N_':
                    this[`${object.color}SetOfPieces`][index] = new Knight(...args);
                    break;
                case 'b_':
                case 'B_':
                    this[`${object.color}SetOfPieces`][index] = new Bishop(...args)
                    break;
                case 'q_':
                case 'Q_':
                    this[`${object.color}SetOfPieces`][index] = new Queen(...args)
                    break;
                default:
                    console.error('Error: new piece wasn\'t added to set, occured in method promotePawn, class Game');
                    break;
                }
                this.currentBoard.board[targetPosition[0]][targetPosition[1] - 1][1] = args[0]
                this.renderBoard()
                return document.querySelector(`.promote_${args[2]}`).style.visibility = 'hidden'
            }
    }
    castling(color, targetSquare, board) {
        let validation = null;
        let positions = {rookCurr: null, rookTarg: null}
        let king = this[`${color}SetOfPieces`].find(elem => /[k]_/i.test(elem.id));
        let rookQSide = this[`${color}SetOfPieces`].find(elem => /[r]_a/i.test(elem.id))
        let rookKSide = this[`${color}SetOfPieces`].find(elem => /[r]_h/i.test(elem.id));
        if (!king._castling) {
            validation = false
            return [validation, positions]
        }
        if (/c8|c1/i.test(targetSquare) && rookQSide._castling) {
            if (color === 'white') {
                if (board.board['c'][0][1] || board.board['d'][0][1] || board.board['b'][0][1]) {
                        validation = false
                        return [validation, positions]
                }
            }
            else {
                if (board.board['c'][7][1] || board.board['d'][7][1] || board.board['b'][7][1]) {
                        validation = false
                        return [validation, positions]
                    }
            }
            positions.rookCurr = rookQSide.position
            positions.rookTarg = (color === 'white') ? ['d', 1] : ['d', 8]
            king.updatePosition = targetSquare
            rookQSide.updatePosition = (color === 'white') ? 'd1' : 'd8'
            rookQSide._castling = false
            king._castling = false
            validation = true
        }
        if (/g8|g1/i.test(targetSquare) && rookKSide._castling) {
            if (color === 'white') {
                if (board.board['f'][0][1] || board.board['g'][0][1] ) {
                        validation = false
                        return [validation, positions]
                }
            }
            else {
                if (board.board['f'][7][1] || board.board['g'][7][1] ) {
                        validation = false
                        return [validation, positions]
                    }
            }
            positions.rookCurr = rookKSide.position
            positions.rookTarg = (color === 'white') ? ['f', 1] : ['f', 8]
            king.updatePosition = targetSquare
            rookKSide.updatePosition = (color === 'white') ? 'f1' : 'f8'
            rookKSide._castling = false
            king._castling = false
            validation = true
        }
        return [validation, positions];
    }
    renderBoard() {
        // render board inside index.html or update the board if moved piece:
        if(document.querySelector('.board_container')) {
            document.querySelector('.board_container').remove()
            this.root.append(this.currentBoard.printBoard())
            // refresh Node list:
            this.listOfSquares = document.querySelectorAll('.square')
            this.selectAndMovePiece()
            return
        }
        this.root.append(this.currentBoard.printBoard())
    }
    renderPanel() {
        document.querySelector('.player').innerHTML = this.turn;
        document.querySelector('.timer_white').innerHTML = clockify(this.whiteTime);
        document.querySelector('.timer_black').innerHTML = clockify(this.blackTime);
    }
    makeSetOfPieces() {
        // method iterate through initialy set board and fill two arrays with newly created objects with unique names and coordinates on the board:
        for (let elem in this.currentBoard.board) {
            for (let i = 0; i < this.currentBoard.board[elem].length; i++) {
                let pieceID = this.currentBoard.board[elem][i][1],
                    coordinates = [elem, this.currentBoard.board[elem][i][0]],
                    color = (/[A-Z]_/.test(pieceID)) ? 'white' : 'black';
                if (pieceID === 'null') {
                    void 0;
                }
                else if(/[A-Z]_/i.test(pieceID)) {
                    let args = [pieceID, coordinates, color]
                    switch(pieceID.match(/[A-Z]_/i)[0]) {
                        case 'P_':
                        case 'p_':
                            this[`${color}SetOfPieces`].push(new Pawn(...args));
                            break;
                        case 'R_':
                        case 'r_':
                            this[`${color}SetOfPieces`].push(new Rook(...args));
                            break;
                        case 'N_':
                        case 'n_':
                            this[`${color}SetOfPieces`].push(new Knight(...args));
                            break;
                        case 'B_':
                        case 'b_':
                            this[`${color}SetOfPieces`].push(new Bishop(...args));
                            break;
                        case 'Q_':
                        case 'q_':
                            this[`${color}SetOfPieces`].push(new Queen(...args));
                            break;
                        case 'K_':
                        case 'k_':
                            this[`${color}SetOfPieces`].push(new King(...args));
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
        let timer = setInterval(() => {
            if (this[`${this.turn}Time`] === 0) {
                clearInterval(this.currentTimer);
                return this.isGameOver = true;
                };
            this[`${this.turn}Time`] -= 1;
            this[`${this.turn}TimerDisplay`].innerHTML = clockify(this[`${this.turn}Time`]);
        }, 1000);
        return this.currentTimer = timer;
    }
    stopCurrentTimer(){
        clearInterval(this.currentTimer);
    }
    switchPlayer() {
        this.turn = this.turn === 'white' ? 'black' : 'white';
    }
}

