const Piece = require('./Piece.js');
class Lieutenant extends Piece {
    constructor(){
        super();
        this.id = '5';
        this.name = 'lieutenant';
        this.rank = 5;
    }
}
module.exports = Lieutenant;
