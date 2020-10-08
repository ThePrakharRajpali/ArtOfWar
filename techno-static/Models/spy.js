const Piece = require('./Piece.js');
class Spy extends Piece {
    constructor(){
        super();
        this.id = 'S';
        this.name = 'spy';
        this.rank = 1;
    }
}

module.exports = Spy;
