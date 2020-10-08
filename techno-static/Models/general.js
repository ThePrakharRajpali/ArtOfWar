const Piece = require('./Piece.js');
class General extends Piece {
    constructor(){
        super();
        this.id = '9';
        this.name = 'general';
        this.rank = 10;
    }
}
module.exports = General;
