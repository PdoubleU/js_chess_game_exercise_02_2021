import Piece from './piece.js';

export default class Pawn extends Piece{
    constructor(id, coordinates, color){
        super(id, coordinates, color)
        this.specialMove = true;
        this.enPassant = false;
        this.promote = false;

        this.specialMoveObj = this.specialMoveObj();
        this.captureMoveObj = this.captureMoveObj();
        this.basicMoveObj = this.straightMoveObj();
    }
    set validateMove(args) {
        console.log('validate moves')
        this._targetSquare = args[0]
        this._board = args[1]
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
            this.enPassant = false;
            this.specialMove = false;
            return this._isMoveValid = true;
        }
        else if (special() && this.specialMove && obstacle()) {
            promote();
            this.enPassant = true;
            this.specialMove = false;
            return this._isMoveValid = true;
        }
        else if (basic() && obstacle()) {
            promote();
            this.enPassant = false;
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
    // methods generates different sets of objects; each object consists details about how
    // the piece should or shouldn't move on the board - these objects are assinged to variables
    // in the constructor:
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
    // methods takes as parameters the object sets in constructor and arguments passed
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
        if (this.color === 'white')  {
            return (/[a-z]_/.test(targPiece) || /enPassant/.test(targPiece));
        } else  {
            return (/[A-Z]_/.test(targPiece) || /enPassant/.test(targPiece));
        }
    }
}