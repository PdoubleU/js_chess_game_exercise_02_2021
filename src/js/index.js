class Board {
    constructor(){
        // below define rows and columns, as well as first column name represents as integer 97 which is reffering to lower case letter a in asci
        this.rows = 8;
        this.firstColumn = 97;
        // property board represents the newly created board thanks to method createBoard()
        this.board = this.createBoard();

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
}



let newGame = new Board();
console.log(newGame.board);

