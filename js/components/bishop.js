import Piece from './piece.js';

export default class Bishop extends Piece{
    constructor(id, coordinates, color){
        super(id, coordinates, color)
    }
    set validateMove(args) {
        this._targetSquare = args[0]
        this._board = args[1]
        let targetX = this._targetSquare.split('')[0].charCodeAt(0),
            targetY = parseInt(this._targetSquare.split('')[1]),
            currentX = this.position[0].charCodeAt(0),
            currentY = parseInt(this.position[1]),
            objOnTargSquare = this._board.board[this._targetSquare.split('')[0]][parseInt(this._targetSquare.split('')[1] - 1)][1],
            capture = () => this.isMoveCapture([targetY, currentY, targetX, currentX, objOnTargSquare]),
            basic = () => this.isMoveStraight([targetY, currentY, targetX, currentX]),
            obstacle = () => this.isMoveObstacle([targetY, currentY, targetX, currentX]);

        if (capture() && basic() && obstacle()) {
            return this._isMoveValid = true
        }
        else {
            return this._isMoveValid = false
        }

    }
    get validateMove() {
        return this._isMoveValid
    }
    //update set of coordinates:
    set updatePosition(coors) {
        return this.position = [coors.split('')[0], parseInt(coors.split('')[1])]
    }
    isMoveStraight(args){
        if (Math.abs(args[0] - args[1]) === Math.abs(args[2] - args[3])) {
            return true
        } else {
            return false
        }
    }
    isMoveCapture(args){
        if (this.isCapturedPieceEnemy(args[4])) {
            return true
        } else {
            return false
        }
    }
    isMoveObstacle(args){
        if (args[0] > args[1]) {
            if (args[2] > args[3]) {
                let column = args[2] - 1
                for (let i = args[0] - 2; i > args[1] - 1; i--) {
                    if (this._board.board[String.fromCharCode(column)][i][1] !== null) {
                        return false
                    }
                    column -= 1
                }
            } else if (args[2] < args[3]) {
                let column = args[2] + 1
                for (let i = args[0] - 2; i > args[1] - 1; i--) {
                    if (this._board.board[String.fromCharCode(column)][i][1] !== null) {
                        return false
                    }
                    column += 1
                }
            }
            return true
        } else if (args[0] < args[1]) {
            if (args[2] > args[3]) {
                let column = args[2] - 1;
                for (let i = args[0]; i < args[1] - 1; i++) {
                    if (this._board.board[String.fromCharCode(column)][i][1] !== null) {
                        return false
                    }
                    column -= 1
                }
            } else if (args[2] < args[3]) {
                let column = args[2] + 1;
                for (let i = args[0]; i < args[1] - 1; i++) {
                    if (this._board.board[String.fromCharCode(column)][i][1] !== null) {
                        return false
                    }
                    column += 1
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
