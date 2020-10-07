import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
    <button 
      className={props.isLake ? "squarelake" : "squarefree"} 
      onClick={ (props.onClick) }>
			{props.value.piece}
		</button>
		);
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      squares: makearray(),
      pieces: makearray()
		};
  }
  
  getPieces(){
    for(var i=0; i<10; i++){
      for(var j=0; j<12; j++){
        if(this.state.squares[i][j].piece.piece != null){
          this.state.pieces.push(this.state.squares[i][j].piece);
        }
      }
    }
  }

  addPiece(i, j){
    if(this.state.pieces.length <= 40){
      this.square[i][j].piece = {
        piece: "P",
        x: j,
        y: i
      }
    }
    else {
      console.log("Can't add any more pieces");
      return;
    }
  }

  

	renderSquare(i, j) {
		return(
			<Square
				value={this.state.squares[i][j].piece.piece}
        isLake={this.state.squares[i][j].isLake}
        onClick= {(i, j) => this.addPiece()}
			/>
			);
	}

	renderRow(i) {
		return(
			<div className="board-row">
				{this.renderSquare(i,0)}
				{this.renderSquare(i,1)}
				{this.renderSquare(i,2)}
				{this.renderSquare(i,3)}
				{this.renderSquare(i,4)}
				{this.renderSquare(i,5)}
				{this.renderSquare(i,6)}
				{this.renderSquare(i,7)}
				{this.renderSquare(i,8)}
				{this.renderSquare(i,9)}
			</div>
			);
	}

	render() {
		return (
			<div>
				{this.renderRow(0)}
				{this.renderRow(1)}
				{this.renderRow(2)}
				{this.renderRow(3)}
				{this.renderRow(4)}
				{this.renderRow(5)}
				{this.renderRow(6)}
				{this.renderRow(7)}
				{this.renderRow(8)}
				{this.renderRow(9)}
				{this.renderRow(10)}
				{this.renderRow(11)}
			</div>
			);
	}
}

function makearray() {
	let board = [];

	for(var i = 0; i<12; i++) {
		let row = [];

		for(var j =0; j<10;j++) {
			let square = {
				isLake: isLake(i,j),
				piece: {
          piece: null,
          x: j,
          y: i
        },
			};

			row.push(square);
		}

		board.push(row);
	}

	return board;
}

function isLake(i,j) {
	if(i>=4 && i<=5 && j>=2 && j<=3)
		return true;
	if(i===6 && j===3)
		return true;
	if(i===5 && j===6)
		return true;
	if(i>=6 && i<=7 && j>=6 && j<=7)
		return true;

	return false;
}

ReactDOM.render(<Board/>, document.getElementById("root"));