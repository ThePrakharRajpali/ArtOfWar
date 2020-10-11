const Piece = require('./Piece.js');
class Bomb extends Piece {
    constructor(){
        super();
        this.id = 'B';
        this.name = 'bomb';
        this.rank = 0;
        this.movable = false;
    }
}
module.exports = Bomb;
