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
			isRedSetup: true,
			isBlueSetup: true,
			numRed: 0,
			numBlue: 0,
		};
	}

	renderSquare(i, j) {
		let disp = null;
		if(this.state.squares[10*i+j].pieceid !== null){
			disp = this.state.pieces[this.state.squares[10*i + j].pieceid].rank;
		}
		return(
			<Square
				value={disp}
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

	blueSetup(i, j) {
		let blueCount = this.state.numBlue;
		blueCount++;
		let newPieces = this.state.pieces.slice();
		let newSquares = this.state.squares.slice();
		let piece = {
			rank: Math.floor((Math.random() * 10) + 1),
			pos: (10*i+j),
			isBlue: true,
		};
		newPieces.push(piece);

		newSquares[10*i + j].pieceid = this.state.pieces.length;

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			isListening: false,
			lastClicked: null,
			isBlueSetup: !(blueCount >= 5),
			numBlue: blueCount,
		});

		return;
	}

	redSetup(i, j) {
		let redCount = this.state.numRed;
		redCount++;
		let newPieces = this.state.pieces.slice();
		let newSquares = this.state.squares.slice();
		let piece = {
			rank: Math.floor((Math.random() * 10) + 1),
			pos: (10*i+j),
			isBlue: false,
		};
		newPieces.push(piece);

		newSquares[10*i + j].pieceid = this.state.pieces.length;

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			isListening: false,
			lastClicked: null,
			isRedSetup: !(redCount >= 5),
			numRed: redCount,
		});

		return;
	}

	handleClick(i,j) {
		if(this.state.isBlueSetup && (10*i+j)<=39) {
			this.blueSetup(i, j);
			return;
		} else if(this.state.isRedSetup && (10*i + j>=79)) {
			this.redSetup(i, j);
			return;	
		} else{
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
							isSetup: false,
							});
						}
						return;
					} else {
						let newSquares = this.state.squares.slice();
						let newPieces = this.state.pieces.slice();
						if(this.state.squares[10*i + j].isHighlighted) {
							newSquares[10*i + j].pieceid = this.state.squares[this.state.lastClicked].pieceid;
							newSquares[this.state.lastClicked].pieceid = null;
							newPieces[this.state.squares[10*i+j].pieceid].pos = (10*i+j);
						}
						for(let i =0;i<120;i++)
							newSquares[i].isHighlighted = false;
						this.setState({
							squares: newSquares,
							pieces: newPieces,
							isListening: false,
							lastClicked: null,
							isSetup: false,
						});
						return;
					}
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
	return board;
}

function makepieces() { //id, rank, pos
	let pieces = [];
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