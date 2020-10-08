const Piece = require('./Piece.js');
class Captain extends Piece {
    constructor(){
        super();
        this.id = '6';
        this.name = 'captain';
        this.rank = 8;
    }
}

module.exports = Captain;
