const Piece = require('./Piece.js');
class Colonel extends Piece {
    constructor(){
        super();
        this.id = '8';
        this.name = 'colonel';
        this.rank = 8;
    }
}
module.exports = Colonel;
