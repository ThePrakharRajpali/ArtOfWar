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
			redPieces: [],
			bluePieces: [],
			isListening: false,
			lastClicked: null,
			isSetup: true,
			numRed: 0,
			numBlue: 0,
			isGameOn: true,
		};
	}

	renderSquare(i, j) {

		let square = this.state.squares[10*i+j];
		let pieces = this.state.pieces;
		let disp = null;
		if(square.hasPiece === true) disp = pieces[square.pieceid.isBlue][square.pieceid.index].rank;

		let className;
		if(square.isLake) className="squarelake";
		else if(square.isPurple) className="squarehighlightattack";
		else if(square.isHighlighted) className="squarehighlighted";
		else if(square.hasPiece===false) className="squarefree";
		else if(square.pieceid.isBlue) className="squareblueoccupied";
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


	flagCaptured(){
		if(this.state.bluePieces[0].isAlive === false || this.state.redPieces[0].isAlive === false){
			return true;
		}
		return false;
	}

	blueSetup(i, j) {
		if(this.state.squares[10*i+j].pieceid!==null) return;

		let blueCount = this.state.numBlue;
		blueCount++;
		let newPieces = this.state.pieces.slice();
		let newBluePieces = this.state.bluePieces.slice();
		let newSquares = this.state.squares.slice();
		
		let piece = {
			rank: ( blueCount===1 )?0:Math.floor((Math.random() * 10) + 1),
			pos: (10*i+j),
			isBlue: true,
			isAlive: true,
			pieceType: null
		};
		newPieces.push(piece);
		newBluePieces.push(piece);
		newSquares[10*i + j].pieceid = this.state.pieces.length;

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			bluePieces: newBluePieces,
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
		let newRedPieces = this.state.redPieces.slice();
		let newSquares = this.state.squares.slice();
		let piece = {
			rank: (redCount === 1)? 0 : Math.floor((Math.random() * 10) + 1),
			pos: (10*i+j),
			isBlue: false,
			isAlive: true,
			pieceType: null
		};
		newPieces.push(piece);
		newRedPieces.push(piece);
		newSquares[10*i + j].pieceid = this.state.pieces.length;

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			redPieces: newRedPieces,
			isListening: false,
			lastClicked: null,
			isRedSetup: !(redCount >= 5),
			numRed: redCount,
		});

	}

	firstClick(i, j) {
		if(this.state.squares[10*i + j].hasPiece===false || this.state.squares[10*i + j].isLake===true) {
			return;
		} else {
			if(this.state.pieces[this.state.squares[10*i + j].pieceid].rank === 0){
				return;
			}
			let newSquares = this.state.squares.slice();
			if(j<9 && !newSquares[10*i + j +1].isLake) {
				if(newSquares[10*i+j+1].hasPiece===false) newSquares[10*i+j+1].isHighlighted=true;
				else if(!(newSquares[10*i+j].pieceid.isBlue === newSquares[10*i+j+1].pieceid.isBlue)) newSquares[10*i+j+1].isPurple=true;
				else;
			}
			if(j>0 && !newSquares[10*i + j -1].isLake) {
				if(newSquares[10*i+j-1].hasPiece===false) newSquares[10*i+j-1].isHighlighted=true;
				else if(!(newSquares[10*i+j].pieceid.isBlue === newSquares[10*i+j-1].pieceid.isBlue)) newSquares[10*i+j-1].isPurple=true;
				else;
			}
			if(i<11 && !newSquares[10*i + j +10].isLake) {
				if(newSquares[10*i+j+10].hasPiece===false) newSquares[10*i+j+10].isHighlighted=true;
				else if(!(newSquares[10*i+j].pieceid.isBlue === newSquares[10*i+j+10].pieceid.isBlue)) newSquares[10*i+j+10].isPurple=true;
				else;
			}
			if(i>0 && !newSquares[10*i + j -10].isLake) {
				if(newSquares[10*i+j-10].hasPiece===false) newSquares[10*i+j-10].isHighlighted=true;
				else if(!(newSquares[10*i+j].pieceid.isBlue === newSquares[10*i+j-10].pieceid.isBlue)) newSquares[10*i+j-10].isPurple=true;
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

		let lastSquare = this.state.squares[this.state.lastClicked];
		let nextSquare = this.state.squares[10*i+j];

		if(nextSquare.isHighlighted) {
			newSquares[10*i + j].pieceid = this.state.squares[this.state.lastClicked].pieceid;
			newSquares[this.state.lastClicked].pieceid = null;
			newSquares[this.state.lastClicked].hasPiece = false;
			newSquares[10*i+j].hasPiece = true;
			newPieces[newSquares[10*i+j].pieceid.isBlue][newSquares[10*i+j].pieceid.index].pos = (10*i+j);
		}

		if(nextSquare.isPurple) {
			let prevRank = newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].rank;
			let nextRank = newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].rank;

			if(prevRank === nextRank) {
				newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].isAlive = false;
				newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos = null;
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;
				newSquares[this.state.lastClicked].pieceid = null;
				newSquares[10*i+j].pieceid = null;
				newSquares[this.state.lastClicked].hasPiece = false;
				newSquares[10*i+j].hasPiece = false;
			} else if(prevRank < nextRank) {
				newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].isAlive = false;
				newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos = null;
				newSquares[this.state.lastClicked].pieceid = null;
				newSquares[this.state.lastClicked].hasPiece = false;
			} else {
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;
				newSquares[10*i+j].pieceid = newSquares[this.state.lastClicked].pieceid;
				newPieces[newSquares[10*i+j].pieceid.isBlue][newSquares[10*i+j].pieceid.index].pos = 10*i + j;
				newSquares[10*i+j].hasPiece = true;
				newSquares[this.state.lastClicked].pieceid = null;
				newSquares[this.state.lastClicked].hasPiece = false;
			}
		}

		for(let i =0;i<120;i++) {
			newSquares[i].isHighlighted = false;
			newSquares[i].isPurple = false;
		}

		var gameOn = !this.flagCaptured();

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			isListening: false,
			lastClicked: null,
			isGameOn: gameOn,
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
			if(this.state.isGameOn === true){
				if(!this.state.isListening) {
					this.firstClick(i, j);
					return;
				} else {
					this.secondClick(i, j);
					return;
				}
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
				pieceid: {
					isBlue: null, //set this as 0 or 1, not true or false.
					index: null,
				},
				isHighlighted: false,
				isPurple: false,
				hasPiece: false,
			};

			board.push(square);
		}
	}
	return board;
}

function makepieces() { //pieces[0][index] are red, pieces[1][index] are blue.
	let pieces = [];

	let redPieces = makePieceArray(false);
	let bluePieces = makePieceArray(true);
	
	pieces.push(redPieces);
	pieces.push(bluePieces);

	return pieces;
}

function makePieceArray(isBlue) {
	let part = [];

	for(let i = 0;i<6;i++)
		part.push(new Piece(isBlue,-1,false));

	part.push(new Piece(isBlue,0,false));
	part.push(new Piece(isBlue,1,true));

	for(let i=0;i<7;i++)
		part.push(new Piece(isBlue,2,true));

	for(let i=0;i<5;i++)
		part.push(new Piece(isBlue,3,true));

	for(let i=0;i<5;i++)
		part.push(new Piece(isBlue,4,true));

	for(let i=0;i<4;i++)
		part.push(new Piece(isBlue,5,true));

	for(let i=0;i<4;i++)
		part.push(new Piece(isBlue,6,true));

	for(let i=0;i<3;i++)
		part.push(new Piece(isBlue,7,true));

	for(let i=0;i<2;i++)
		part.push(new Piece(isBlue,8,true));

	part.push(new Piece(isBlue,9,true));
	part.push(new Piece(isBlue,10,true));

	return part;
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

class Piece {
	constructor(isBlue,rank,isMovable) {
		this.isBlue = isBlue;
		this.pos = null;
		this.rank = rank;
		this.isAlive = true;
		this.isMovable = isMovable;
	}
}

ReactDOM.render(<Board/>, document.getElementById("root"));