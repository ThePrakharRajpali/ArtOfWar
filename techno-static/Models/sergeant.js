const Piece = require('./Piece.js');
class Sergeant extends Piece {
    constructor() {
        super();
        this.id = '4';
        this.name = 'sergeant';
        this.rank = 4;
    }
}
module.exports = Sergeant;
