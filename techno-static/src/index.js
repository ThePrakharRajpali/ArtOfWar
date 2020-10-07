import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className={props.isLake ? "squarelake" : props.isHighlighted ? "squarehighlighted" : "squarefree"} onClick={props.onClick}>
			{props.value}
		</button>
		);
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: makearray(),
			pieces: makepieces(),
			isListening: false,
			lastClicked: null,
		};
	}

	renderSquare(i, j) {
		return(
			<Square
				value={this.state.squares[10*i + j].pieceid}
				isLake={this.state.squares[10*i + j].isLake}
				isHighlighted={this.state.squares[10*i+j].isHighlighted}
				onClick={()=>this.handleClick(i,j)}
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

	handleClick(i,j) {
		if(!this.state.isListening) {
			if(this.state.squares[10*i + j].pieceid===null || this.state.squares[10*i + j].isLake===true) {
				return;
			} else {
				let newSquares = this.state.squares.slice();
				newSquares[10*i + j].isClicked = true;
				if(j<9 && !this.state.squares[10*i + j +1].isLake && (this.state.squares[10*i + j + 1].pieceid===null)) {
					newSquares[10*i + j + 1].isHighlighted = true;
				}
				if(j>0 && !this.state.squares[10*i + j -1].isLake && (this.state.squares[10*i + j - 1].pieceid===null)) {
					newSquares[10*i + j - 1].isHighlighted = true;
				}
				if(i<11 && !this.state.squares[10*i + j +10].isLake && (this.state.squares[10*i + j + 10].pieceid===null)) {
					newSquares[10*i + j + 10].isHighlighted = true;
				}
				if(i>0 && !this.state.squares[10*i + j -10].isLake && (this.state.squares[10*i + j -10].pieceid===null)) {
					newSquares[10*i + j - 10].isHighlighted = true;
				}

				this.setState({
					squares: newSquares,
					pieces: this.state.pieces,
					isListening: true,
					lastClicked: (10*i+j),
					});
				}
				return;
			} else {
				let newSquares = this.state.squares.slice();
				let newPieces = this.state.pieces.slice();
				if(this.state.squares[10*i + j].isHighlighted) {
					newSquares[10*i + j].pieceid = this.state.squares[this.state.lastClicked].pieceid;
					newSquares[this.state.lastClicked].pieceid = null;
					for(var l = 0;l<newPieces.length;l++) {
						if(newPieces[l].id === newSquares[10*i + j].pieceid){
							newPieces[l].pos = (10*i + j);
						}
					}
				}
				for(let i =0;i<120;i++)
					newSquares[i].isHighlighted = false;
				this.setState({
					squares: newSquares,
					pieces: newPieces,
					isListening: false,
					lastClicked: null,
				});
				return;
			}
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

		for(var j =0; j<10;j++) {
			let square = {
				isLake: isLake(i,j),
				pieceid: null,
				isHighlighted: false,
				isClicked: false,
			};

			board.push(square);
		}
	}
	board[15].pieceid = "B_1";
	return board;
}

function makepieces() {
	let pieces = [];

	let piece = {
		id: "B_1",
		rank: 11,
		pos: 15,
	};

	pieces.push(piece);

	return pieces;
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