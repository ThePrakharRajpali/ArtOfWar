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
			isSetup: true,
			numRed: 0,
			numBlue: 0,
			isGameOn: true,
			initialRedPiece: [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1],
			initialBluePiece: [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1],
			pieceToAdd: null,
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

	renderPanelSquare(i, j){
		if(i%2 === 0){
			let disp = (i===0) ? "squareredoccupied" : "squareblueoccupied";
			return (
				<Square
					value={j-1}
					className={disp}
					onClick={() => this.handlePanelClick(i, j)}
				/>
			);
		} else if(i===1){
			return(
				<Square
					className= "squarefree"
					value = {this.state.initialRedPiece[j]}
				/>
			);
		} else if(i===3){
			return(
				<Square
					className= "squarefree"
					value = {this.state.initialBluePiece[j]}
				/>
			);
		}
		
	}

	renderPanelRow(i){
		return (
			<div className="board-row panel-row">
				{this.renderPanelSquare(i,0)}
				{this.renderPanelSquare(i,1)}
				{this.renderPanelSquare(i,2)}
				{this.renderPanelSquare(i,3)}
				{this.renderPanelSquare(i,4)}
				{this.renderPanelSquare(i,5)}
				{this.renderPanelSquare(i,6)}
				{this.renderPanelSquare(i,7)}
				{this.renderPanelSquare(i,8)}
				{this.renderPanelSquare(i,9)}
				{this.renderPanelSquare(i,10)}
				{this.renderPanelSquare(i,11)}
			</div>
		);
	}
	//Don't delete this.
	// setup(i, j) { 
	// 	if(this.state.squares[(10*i)+j].hasPiece===true || ((10*i+j)>39 && (10*i+j)<80))
	// 		return;
	// 	else {
	// 		if((10*i+j) <= 39) {
	// 			let blueCount = this.state.numBlue;
	// 			let redCount = this.state.numRed;
	// 			let newPieces = this.state.pieces;
	// 			let newSquares = this.state.squares;
	// 			newPieces[1][numBlue].pos = 10*i+j;
	// 			newSquares[10*i+j].pieceid.isBlue = 1;
	// 			newSquares[10*i+j].pieceid.index = numBlue;
	// 			newSquares[10*i+j].hasPiece = true;
	// 			blueCount++;

	// 			this.setState({
	// 				squares: newSquares,
	// 				pieces: newPieces,
	// 				numBlue: blueCount,
	// 				isSetup: !(blueCount>=40 && redCount>=40),
	// 			});
	// 		} else {
	// 			let blueCount = this.state.numBlue;
	// 			let redCount = this.state.numRed;
	// 			let newPieces = this.state.pieces;
	// 			let newSquares = this.state.squares;
	// 			newPieces[0][redCount].pos = 10*i+j;
	// 			newSquares[10*i+j].pieceid.isBlue = 0;
	// 			newSquares[10*i+j].pieceid.index = redCount;
	// 			newSquares[10*i+j].hasPiece = true;
	// 			redCount++;

	// 			this.setState({
	// 				squares: newSquares,
	// 				pieces: newPieces,
	// 				numRed: redCount,
	// 				isSetup: !(blueCount>=40 && redCount>=40),
	// 			});
	// 		}
	// 	}
	// }

	setupAddPiece(i, j){
		var newPieces = this.state.pieces.slice();
		var newPieceToAdd = this.state.pieceToAdd.slice();
		var pieceColor = newPieceToAdd[0];
		var pieceIndex = newPieceToAdd[1];
		var newSquares = this.state.squares.slice();
		let blueCount = this.state.numBlue;
		let redCount = this.state.numRed;
		let redPieces = this.state.initialRedPiece.slice();
		let bluePieces = this.state.initialBluePiece.slice();

		if(newPieces[pieceColor][pieceIndex].pos === null){
			if(pieceColor === 1 && 10*i + j <= 39){
				newSquares[10*i + j].pieceid.isBlue = 1;
				newSquares[10*i + j].pieceid.index = pieceIndex;
				newSquares[10*i + j].hasPiece = true;
				newPieces[pieceColor][pieceIndex].pos = 10*i + j;
				blueCount++;
				bluePieces[newPieces[pieceColor][pieceIndex].rank + 1] -= 1;
			} else if(pieceColor === 0 && 10*i + j >= 80) {
				newSquares[10*i + j].pieceid.isBlue = 0;
				newSquares[10*i + j].pieceid.index = pieceIndex;
				newSquares[10*i + j].hasPiece = true;
				newPieces[pieceColor][pieceIndex].pos = 10*i + j;
				redCount++;
				redPieces[newPieces[pieceColor][pieceIndex].rank + 1] -= 1;
			}

			this.setState({
				squares: newSquares,
				pieces: newPieces,
				numRed: redCount,
				numBlue: blueCount,
				isListening: false,
				isSetup: !(blueCount>=40 && redCount >= 40),
				initialBluePiece: bluePieces,
				initialRedPiece: redPieces,
			})
		}
	}

	flagCaptured(){
		return (this.state.pieces[0][6].isAlive === false || this.state.pieces[1][6].isAlive === false);
	}

	// testSetup() {

	// 	let newSquares = this.state.squares;
	// 	let newPieces = this.state.pieces;

	// 	for(let iter=0;iter<40;iter++) {
	// 		newPieces[1][iter].pos = iter;
	// 		newSquares[iter].hasPiece = true;
	// 		newSquares[iter].pieceid.isBlue = 1;
	// 		newSquares[iter].pieceid.index = iter;
	// 	}

	// 	for(let iter=0;iter<40;iter++) {
	// 		newPieces[0][iter].pos = 119 - iter;
	// 		newSquares[119-iter].hasPiece = true;
	// 		newSquares[119-iter].pieceid.isBlue = 0;
	// 		newSquares[119-iter].pieceid.index = iter;
	// 	}

	// 	this.setState({
	// 		squares: newSquares,
	// 		pieces: newPieces,
	// 		numRed: 40,
	// 		numBlue: 40,
	// 		isSetup: false,
	// 	});

	// }

	findBlastRadius(i, j){
		// 1 2 3
		// 4 5 6
		// 7 8 9
		// (i+1, j-1) (i+1, j) (i+1, j+1)      +9 +10 +11
		// (i  , j-1) (i  , j) (i  , j+1)      -1     +1
		// (i-1, j-1) (i-1, j) (i-1, j+1)     -11 -10 -9
		var blastRadius = [
			{inRadius:true, toAdd:   9}, {inRadius:true, toAdd:  10}, {inRadius:true, toAdd: 11}, 
			{inRadius:true, toAdd:  -1}, {inRadius:true, toAdd:   0}, {inRadius:true, toAdd:  1},
			{inRadius:true, toAdd: -11}, {inRadius:true, toAdd: -10}, {inRadius:true, toAdd: -9},
		]
		if(i>0 && i<11){ 
			//code
			if(j>0 && j<9){ //all 9 squares
				
			} else if (j === 0){ // 2, 5, 8, 3, 6, 9
				blastRadius = [
					{inRadius:false, toAdd:   9}, {inRadius:true, toAdd:  10}, {inRadius:true, toAdd: 11}, 
					{inRadius:false, toAdd:  -1}, {inRadius:true, toAdd:   0}, {inRadius:true, toAdd:  1},
					{inRadius:false, toAdd: -11}, {inRadius:true, toAdd: -10}, {inRadius:true, toAdd: -9},
				]
			} else { //1, 4, 7, 2, 5, 8
				blastRadius = [
					{inRadius:true, toAdd:   9}, {inRadius:true, toAdd:  10}, {inRadius:false, toAdd: 11}, 
					{inRadius:true, toAdd:  -1}, {inRadius:true, toAdd:   0}, {inRadius:false, toAdd:  1},
					{inRadius:true, toAdd: -11}, {inRadius:true, toAdd: -10}, {inRadius:false, toAdd: -9},
				]
			}
		}else if(i===0){
			if(j>0 && j<9){ //1, 2, 3, 4, 5, 6
				blastRadius = [
					{inRadius: true, toAdd:   9}, {inRadius: true, toAdd:  10}, {inRadius: true, toAdd: 11}, 
					{inRadius: true, toAdd:  -1}, {inRadius: true, toAdd:   0}, {inRadius: true, toAdd:  1},
					{inRadius:false, toAdd: -11}, {inRadius:false, toAdd: -10}, {inRadius:false, toAdd: -9},
				]
			} else if (j === 0){ // 2, 3, 5, 6
				blastRadius = [
					{inRadius:false, toAdd:   9}, {inRadius: true, toAdd:  10}, {inRadius: true, toAdd: 11}, 
					{inRadius:false, toAdd:  -1}, {inRadius: true, toAdd:   0}, {inRadius: true, toAdd:  1},
					{inRadius:false, toAdd: -11}, {inRadius:false, toAdd: -10}, {inRadius:false, toAdd: -9},
				]
			} else { // 1, 2, 4, 5
				blastRadius = [
					{inRadius: true, toAdd:   9}, {inRadius: true, toAdd:  10}, {inRadius:false, toAdd: 11}, 
					{inRadius: true, toAdd:  -1}, {inRadius: true, toAdd:   0}, {inRadius:false, toAdd:  1},
					{inRadius:false, toAdd: -11}, {inRadius:false, toAdd: -10}, {inRadius:false, toAdd: -9},
				]
			}
		} else {
			if(j>0 && j<9){ // 4, 5, 6, 7, 8, 9
				blastRadius = [
					{inRadius:false, toAdd:   9}, {inRadius:false, toAdd:  10}, {inRadius:false, toAdd: 11}, 
					{inRadius: true, toAdd:  -1}, {inRadius: true, toAdd:   0}, {inRadius: true, toAdd:  1},
					{inRadius: true, toAdd: -11}, {inRadius: true, toAdd: -10}, {inRadius: true, toAdd: -9},
				]
			} else if (j === 0){ // 5, 6, 8, 9
				blastRadius = [
					{inRadius:false, toAdd:   9}, {inRadius:false, toAdd:  10}, {inRadius:false, toAdd: 11}, 
					{inRadius:false, toAdd:  -1}, {inRadius: true, toAdd:   0}, {inRadius: true, toAdd:  1},
					{inRadius:false, toAdd: -11}, {inRadius: true, toAdd: -10}, {inRadius: true, toAdd: -9},
				]
			} else { //4, 5, 7, 8
				blastRadius = [
					{inRadius:false, toAdd:   9}, {inRadius:false, toAdd:  10}, {inRadius:false, toAdd: 11}, 
					{inRadius:false, toAdd:  -1}, {inRadius: true, toAdd:   0}, {inRadius: true, toAdd:  1},
					{inRadius:false, toAdd: -11}, {inRadius: true, toAdd: -10}, {inRadius: true, toAdd: -9},
				]
			}
		}

		return(blastRadius);
	}

	blast(i, j){
		var blastRadius = this.findBlastRadius();
		let newSquares  = this.state.squares.slice();
		let newPieces   = this.state.pieces.slice();
		const bomb = newSquares[10*i + j].pieceid;
		for(var k=0; k<9; k++){
			var id = 10*i + j + blastRadius[k].toAdd;
			var piece = newSquares[id].pieceid;

			if(blastRadius[k].inRadius && piece !== null){
				if(piece.isBlue !== bomb.isBlue){
					newPieces[piece.isBlue][piece.index].isAlive = false;
					newPieces[piece.isBlue][piece.index].pos = null;

					newSquares[id].hasPiece = false;
					newSquares[id].pieceid = null;
				}
			}

		}

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			isListening: false,
			lastClicked: null,
			isGameOn: !this.flagCaptured(),
		});
	}

	firstClick(i, j) {
		if(this.state.squares[10*i + j].hasPiece===false || this.state.squares[10*i + j].isLake===true) {
			return;
		} else {
			if(!this.state.pieces[this.state.squares[10*i+j].pieceid.isBlue][this.state.squares[10*i+j].pieceid.index].isMovable)
				return;

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

			if(nextRank !== -1 || prevRank === 3){
				if(prevRank === nextRank) {
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].isAlive = false;
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos = null;

					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;

					newSquares[this.state.lastClicked].pieceid = null;
					newSquares[10*i+j].pieceid = null;

					newSquares[this.state.lastClicked].hasPiece = false;
					newSquares[10*i+j].hasPiece = false;

				} else if(prevRank < nextRank || prevRank !== 1) {
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
			} else if(prevRank !== 3){
				this.blast(i, j);
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
			isGameOn: !this.flagCaptured(),
		});
		return;
	}

	handleClick(i,j) {
		if(this.state.isSetup) {
			if(this.state.squares[10*i + j].hasPiece === false){
				if(this.state.isListening){
					this.setupAddPiece(i, j);
				}
			}
		}else if(this.state.isGameOn){
			if(!this.state.isListening) {
				this.firstClick(i, j);
				return;
			} else {
				this.secondClick(i, j);
				return;
			}
		}
	}

	handlePanelClick(i, j){
		let maxPieces = [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1];

		if(!this.state.isListening){
				let curr= 0
				let k = 0;
				while(k<12 && k < j){
					curr += maxPieces[k];
					k++;
				}

				while(curr<40 && this.state.pieces[i/2][curr].pos !== null){
					curr++;
				}
				
				if(curr<40 && this.state.pieces[i/2][curr].rank +1 !== j){
					return
				}

				this.setState({
					isListening: true,
					pieceToAdd: [i/2, curr]
				});
		} else {
			this.setState({
				isListening: false,
				pieceToAdd: null,
			})
		}
	}
	
	render() {
		return (
			<div>
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
				<div className="panel table">
					{this.renderPanelRow(0)}
					{this.renderPanelRow(1)}
					{this.renderPanelRow(2)}
					{this.renderPanelRow(3)}
				</div>
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