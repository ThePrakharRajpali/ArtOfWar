import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className={props.className} onClick={props.onClick}>
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
		if(this.state.squares[10*i+j].pieceid !== null) disp = this.state.pieces[this.state.squares[10*i + j].pieceid].rank;

		let className;
		if(this.state.squares[10*i+j].isLake) className="squarelake";
		else if(this.state.squares[10*i+j].isPurple) className="squarehighlightattack";
		else if(this.state.squares[10*i+j].isHighlighted) className="squarehighlighted";
		else if(this.state.squares[10*i+j].pieceid===null) className="squarefree";
		else if(this.state.pieces[this.state.squares[10*i+j].pieceid].isBlue) className="squareblueoccupied";
		else className="squareredoccupied";

		return(
			<Square
				value={disp}
				className={className}
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
		if(this.state.squares[10*i+j].pieceid!==null) return;

		let blueCount = this.state.numBlue;
		blueCount++;
		let newPieces = this.state.pieces.slice();
		let newSquares = this.state.squares.slice();
		let piece = {
			rank: Math.floor((Math.random() * 10) + 1),
			pos: (10*i+j),
			isBlue: true,
			isAlive: true,
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
		if(this.state.squares[10*i+j].pieceid!==null) return;

		let redCount = this.state.numRed;
		redCount++;
		let newPieces = this.state.pieces.slice();
		let newSquares = this.state.squares.slice();
		let piece = {
			rank: Math.floor((Math.random() * 10) + 1),
			pos: (10*i+j),
			isBlue: false,
			isAlive: true,
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

	firstClick(i, j) {
		if(this.state.squares[10*i + j].pieceid===null || this.state.squares[10*i + j].isLake===true) {
			return;
		} else {
			let newSquares = this.state.squares.slice();
			let newPieces = this.state.pieces.slice();
			if(j<9 && !newSquares[10*i + j +1].isLake) {
				if(newSquares[10*i+j+1].pieceid===null) newSquares[10*i+j+1].isHighlighted=true;
				else if(!(newPieces[newSquares[10*i+j].pieceid].isBlue === newPieces[newSquares[10*i+j+1].pieceid].isBlue)) newSquares[10*i+j+1].isPurple=true;
				else;
			}
			if(j>0 && !newSquares[10*i + j -1].isLake) {
				if(newSquares[10*i+j-1].pieceid===null) newSquares[10*i+j-1].isHighlighted=true;
				else if(!(newPieces[newSquares[10*i+j].pieceid].isBlue === newPieces[newSquares[10*i+j-1].pieceid].isBlue)) newSquares[10*i+j-1].isPurple=true;
				else;
			}
			if(i<11 && !newSquares[10*i + j +10].isLake) {
				if(newSquares[10*i+j+10].pieceid===null) newSquares[10*i+j+10].isHighlighted=true;
				else if(!(newPieces[newSquares[10*i+j].pieceid].isBlue === newPieces[newSquares[10*i+j+10].pieceid].isBlue)) newSquares[10*i+j+10].isPurple=true;
				else;
			}
			if(i>0 && !newSquares[10*i + j -10].isLake) {
				if(newSquares[10*i+j-10].pieceid===null) newSquares[10*i+j-10].isHighlighted=true;
				else if(!(newPieces[newSquares[10*i+j].pieceid].isBlue === newPieces[newSquares[10*i+j-10].pieceid].isBlue)) newSquares[10*i+j-10].isPurple=true;
				else;
			}

			this.setState({
				squares: newSquares,
				pieces: this.state.pieces,
				isListening: true,
				lastClicked: (10*i+j),
				});
			}
			return;
	}

	secondClick(i, j) {
		let newSquares = this.state.squares.slice();
		let newPieces = this.state.pieces.slice();

		if(this.state.squares[10*i + j].isHighlighted) {
			newSquares[10*i + j].pieceid = this.state.squares[this.state.lastClicked].pieceid;
			newSquares[this.state.lastClicked].pieceid = null;
			newPieces[this.state.squares[10*i+j].pieceid].pos = (10*i+j);
		}

		if(this.state.squares[10*i+j].isPurple) {
			let prevRank = newPieces[newSquares[this.state.lastClicked].pieceid].rank;
			let nextRank = newPieces[newSquares[10*i+j].pieceid].rank;

			if(prevRank === nextRank) {
				newPieces[newSquares[this.state.lastClicked].pieceid].isAlive = false;
				newPieces[newSquares[10*i+j].pieceid].isAlive = false;

				newPieces[newSquares[this.state.lastClicked].pieceid].pos= null;
				newPieces[newSquares[10*i+j].pieceid].pos = null;

				newSquares[this.state.lastClicked].pieceid = null;
				newSquares[10*i+j].pieceid = null;
			} else if(prevRank < nextRank) {
				newPieces[newSquares[this.state.lastClicked].pieceid].isAlive = false;
				newPieces[newSquares[this.state.lastClicked].pieceid].pos = null;
				newSquares[this.state.lastClicked].pieceid = null;
			} else {
				newPieces[newSquares[10*i+j].pieceid].isAlive = false;
				newPieces[newSquares[10*i+j].pieceid].pos = null;
				newSquares[10*i+j].pieceid = newSquares[this.state.lastClicked].pieceid;
				newPieces[newSquares[10*i+j].pieceid].pos = (10*i + j);
				newSquares[this.state.lastClicked].pieceid = null;
			}
		}

		for(let i =0;i<120;i++) {
			newSquares[i].isHighlighted = false;
			newSquares[i].isPurple = false;
		}
		this.setState({
			squares: newSquares,
			pieces: newPieces,
			isListening: false,
			lastClicked: null,
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
				this.firstClick(i, j);
				return;
			} else {
				this.secondClick(i, j);
				return;
			}
		}
	}

	render() {
		return (
			<div className="table">
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
				isPurple: false,
			};

			board.push(square);
		}
	}
	return board;
}

function makepieces() { //rank, pos, isBlue, isAlive
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