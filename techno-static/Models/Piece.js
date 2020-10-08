const Square = require('./Square.js');

class Piece {
    constructor(pos, color) {
        this.id = null;
        this.rank = null;
        this.name = null;
        this.pos = pos;
        this.color = color;
        this.isAlive = true;
        this.movable = false;
    }

    setPos(pos){
        this.pos = pos;
    }

    move(next_pos){
        if(this.movable){
            this.pos = next_pos;
            console.log("piece moved from piece");
        } else {
            return;
        }
    }
}

module.exports = Piece;
