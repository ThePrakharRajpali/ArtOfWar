const Piece = require('./Piece.js');
class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.livePieces = [];
        this.deadPieces = [];
        this.point = 0;
    }

    startGame(startPieces){
        this.livePieces = startPieces;
    }
}

module.exports = Player;
