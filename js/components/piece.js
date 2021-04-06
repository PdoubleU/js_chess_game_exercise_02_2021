export default class Piece {
    constructor(id, coordinates, color) {
        this.id = id;
        this.color = color;
        this.position = coordinates;
        this._targetSquare = null;
        this._board = null;
        this._isMoveValid = null;
    }
}