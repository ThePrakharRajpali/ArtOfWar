const Piece = require('./Piece.js');
class Major extends Piece {
    constructor(){
        super();
        this.id = '7';
        this.name = 'major';
        this.rank = 7;
    }
}
module.exports = Major;
