const Board = require('./Board.js');
const Piece = require('./Piece.js');
class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.pos = {
            x: x,
            y: y
        }
        this.curr = null;
        // this.display = " ";
    }

    addPiece(piece){
        if(this.isFree()){
            this.curr = piece;
            piece.pos = this.pos;
            console.log("Piece added to square");
        } else {
            console.log("Square is not free");
        }
    }

    isFree(){
        return (this.curr === null);
    }

    move(next){
        if(this.curr.movable){
            next.curr = this.curr;
            this.curr.move(next);
            this.curr = null;
            console.log("piece moved from square");
        } else {
            return;
        }

    }

}

module.exports = Square;
