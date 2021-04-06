import GameState from './gamestate.js';

export default class GameStateProvider {
    saveMemento() {
        return new GameState(
            this.gameTime,
            this.whiteSetOfPieces,
            this.blackSetOfPieces,
            this.whiteTime,
            this.blackTime,
            this.turn,
            this.capturedWhite,
            this.capturedBlack,
            this.currentBoard,
            this.choosenPieceID,
            this.listOfSquares,
            this.whiteKingChecked,
            this.blackKingChecked
        )
    }
    restoreMemento(memento) {
        this.gameTime = memento.gameTime,
        this.whiteSetOfPieces = memento.whiteSetOfPieces,
        this.blackSetOfPieces = memento.blackSetOfPieces,
        this.whiteTime = memento.whiteTime,
        this.blackTime = memento.blackTime,
        this.turn = memento.turn,
        this.capturedWhite = memento.capturedWhite,
        this.capturedBlack = memento.capturedBlack,
        this.currentBoard = memento.currentBoard,
        this.choosenPieceID = memento.choosenPieceID,
        this.listOfSquares = memento.listOfSquares,
        this.whiteKingChecked = memento.whiteKingChecked,
        this.blackKingChecked = memento.blackKingChecked
    }
}