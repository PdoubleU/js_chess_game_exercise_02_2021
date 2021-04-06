export default class GameState {
    constructor(
        gameTime,
        whiteSetOfPieces,
        blackSetOfPieces,
        whiteTime, blackTime,
        turn, capturedWhite, capturedBlack,
        currentBoard,
        choosenPieceID, listOfSquares,
        whiteKingChecked, blackKingChecked ){
        this.gameTime = gameTime,
        this.whiteSetOfPieces = whiteSetOfPieces,
        this.blackSetOfPieces = blackSetOfPieces,
        this.whiteTime = whiteTime,
        this.blackTime = blackTime,
        this.turn = turn,
        this.capturedWhite = capturedWhite,
        this.capturedBlack = capturedBlack,
        this.currentBoard = currentBoard,
        this.choosenPieceID = choosenPieceID,
        this.listOfSquares = listOfSquares,
        this.whiteKingChecked = whiteKingChecked,
        this.blackKingChecked = blackKingChecked
    }
}
