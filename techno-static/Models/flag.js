const Piece = require('./Piece.js');
class Flag extends Piece {
    constructor(){
        super();
        this.id = 'F';
        this.name = 'flag';
        this.rank = 0;
        this.movable = false;
    }
}
module.exports = Flag;
