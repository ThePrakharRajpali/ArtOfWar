const Piece = require('./Piece.js');
class Scout extends Piece {
    constructor(){
        super();
        this.id = '2';
        this.name = 'scout';
        this.rank = 2;
    }
}module.exports = Scout;
