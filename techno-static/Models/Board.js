const Piece  = require('./Piece.js');
const Square = require('./Square.js');
const Player = require('./player.js');
class Board {
    constructor(player1, player2) {
        this.board = []; //Used as a 2D array to store squares
        this.lakeArea = [];
        this.gameOn = true;
        this.player1 = player1;
        this.player2 = player2;
    }

    initializePieces(player){
        for(var i=0; i<40; i++){
            var square = this.selectSquare();
            player.livePieces.push(this.setPiece(square, piece, player));
        }
    }

    //INITIALIZING THE GAME
    setupGame(){
        for(var i=0; i<12; i++){
            let width = [];
            for(var j=0; j<10; j++){
                var square = new Square(j,i);
                width.push(square);
            }
            this.board.push(width);
        }


        console.log("Game set up done");
    }

    addPiece(pos, piece){    //add "piece" piece to square on board co-ordinates "pos"
        this.board[pos.x][pos.y].addPiece(piece);
        console.log("Piece added to square");
    }

    getFreePosition(pos){   //Gets free squares around the the square on co-ordinates "pos"
        var right = false, left=false, up=false, down=false;
        if(pos.x < 9){
            right = this.board[pos.x + 1][pos.y].isFree();
            console.log("right is free");
        }
        if(pos.x > 0){
            left = this.board[pos.x - 1][pos.y].isFree();
            console.log("left is free");
        }
        if(pos.y < 11){
            up = this.board[pos.x][pos.y + 1].isFree();
            console.log("up is free");
        }
        if(pos.y > 0){
            down = this.board[pos.x][pos.y - 1].isFree();
            console.log("down is free");
        }

        return {right: right, left: left, up: up, down: down};
    }

    move(pos, next){    //If the piece on the square with co-od "pos" is movable, move it to square with co-od "next" if free.
        //var piece = this.board[pos.x][pos.y].curr;
        if(this.board[pos.x][pos.y].curr.movable){
            if (   ( pos.x > next.x && this.getFreePosition(pos).left )
                || ( pos.x < next.x && this.getFreePosition(pos).right)
                || ( pos.y > next.y && this.getFreePosition(pos).down )
                || ( pos.y < next.y && this.getFreePosition(pos).up   ) ) {
                    console.log("Piece moved from board");
                    this.board[pos.x][pos.y].move(this.board[next.x][next.y]);
            }
        } else {
            console.log("Can't Move the piece");
            return;
        }
    }


    isOpponent(curr, next){    //curr and next are co-ods
        // For debugging
        if(this.board[next.x][next.y].curr.color !== this.board[curr.x][curr.y].curr.color){
            console.log("Enemy Spotted");
        } else {
            console.log("Not an Enemy");
        }

        return (this.board[next.x][next.y].curr.color !== this.board[curr.x][curr.y].curr.color);
    }


    // TODO: change attack logic
    attack(curr, next){

        if(this.board[next.x][next.y].isFree()){

            console.log("Can't attack empty space");

            return;

        } else if (this.isOpponent(curr, next)){

            // we win
            if(this.board[curr.x][curr.y].curr.id === 'S'){
                this.board[next.x][next.y].curr.isAlive = false;
                this.board[next.x][next.y].curr = null;
                this.move(curr, next);
                console.log("We win");
                return;
            } else if (this.board[next.x][next.y].curr.id === 'F'){
                this.board[curr.x][curr.y].curr.isAlive = false;
                this.board[curr.x][curr.y].curr = null;
                console.log("We lose");
                this.gameOn = false;
                return;
            } else if(this.board[next.x][next.y].curr.id === 'B' && this.board[curr.x][curr.y].curr.rank !== 3){
                this.board[next.x][next.y].curr.isAlive = false;
                this.board[next.x][next.y].curr = null;
                this.board[curr.x][curr.y].curr.isAlive = false;
                this.board[curr.x][curr.y].curr = null;


                /* Blast radius*/
                if(next.x + 1 < 10 && next.y + 1 < 12){
                    this.board[next.x + 1][next.y + 1].curr.isAlive = false;
                    this.board[next.x + 1][next.y + 1].curr = null;
                }

                if(next.x + 1 < 10){
                    this.board[next.x + 1][next.y    ].curr.isAlive = false;
                    this.board[next.x + 1][next.y    ].curr = null;
                }

                if(next.x + 1 < 10 && next.y - 1 > 0){
                    this.board[next.x + 1][next.y - 1].curr.isAlive = false;
                    this.board[next.x + 1][next.y - 1].curr = null;
                }

                if(next.x - 1 > 0 && next.y + 1 < 12){
                    this.board[next.x - 1][next.y + 1].curr.isAlive = false;
                    this.board[next.x - 1][next.y + 1].curr = null;
                }

                if(next.x - 1 > 0){
                    this.board[next.x - 1][next.y    ].curr.isAlive = false;
                    this.board[next.x - 1][next.y    ].curr = null;
                }

                if(next.x - 1 > 0 && next.y - 1> 0){
                    this.board[next.x - 1][next.y - 1].curr.isAlive = false;
                    this.board[next.x - 1][next.y - 1].curr = null;
                }

                if(next.y - 1 > 0){
                    this.board[next.x    ][next.y - 1].curr.isAlive = false;
                    this.board[next.x    ][next.y - 1].curr = null;
                }

                if(next.y + 1 < 12){
                    this.board[next.x    ][next.y + 1].curr.isAlive = false;
                    this.board[next.x    ][next.y + 1].curr = null;
                }

                console.log("Boom");
                return;
            } else if(this.board[next.x][next.y].curr.id === 'B' && this.board[curr.x][curr.y].curr.rank === 3){
                this.board[next.x][next.y].curr.isAlive = false;
                this.board[next.x][next.y].curr = null;
                this.move(curr, next);
                console.log("We win");
                return;
            } else if( this.board[curr.x][curr.y].curr.rank /*our piece*/ > /*opponent piece*/ this.board[next.x][next.y].curr.rank ){

                this.board[next.x][next.y].curr.isAlive = false;
                this.board[next.x][next.y].curr = null;
                this.move(curr, next);
                console.log("We win");

            } else if (this.board[curr.x][curr.y].curr.rank < this.board[next.x][next.y].curr.rank){
                this.board[curr.x][curr.y].curr.isAlive = false;
                this.board[curr.x][curr.y].curr = null;
                console.log("We lose");
            } else {
                // tie
                this.board[next.x][next.y].curr.isAlive = false;
                this.board[next.x][next.y].curr = null;
                this.board[curr.x][curr.y].curr.isAlive = false;
                this.board[curr.x][curr.y].curr = null;
                console.log("Tie, both pieces die");
            }
        } else {
            console.log("Can't attack your army");
        }
    }

    selectSquare(){
        //addelement using document
        // get pos:
        var square = this.board[pos.x][pos.y] ;
        return square;
    }

    setPiece(square, piece player){

        square.curr = piece;
        piece.pos = square.pos;
        piece.color = player.color;
        return piece;
    }

}
 module.exports = Board;
