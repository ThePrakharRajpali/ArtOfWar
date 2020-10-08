const Piece = require('./Piece.js');
class Miner extends Piece {
    constructor(){
        super();
        this.id = '3';
        this.name = 'miner';
        this.rank = 3;
    }
}
module.exports = Miner;
