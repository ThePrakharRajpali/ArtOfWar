import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
<<<<<<< Updated upstream
		<button className={props.isLake ? "squarelake" : props.isHighlighted ? "squarehighlighted" : "squarefree"} onClick={props.onClick}>
			{props.value}
=======
		<button className={props.className} onClick={props.onClick}>
			{/*{props.value}*/}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
		return(
			<Square
				value={this.state.squares[10*i + j].pieceid}
				isLake={this.state.squares[10*i + j].isLake}
				isHighlighted={this.state.squares[10*i+j].isHighlighted}
=======
        let square = this.state.squares[10*i+j];
		let pieces = this.state.pieces;
		let disp = null;
		if(square.hasPiece === true) disp = pieces[square.pieceid.isBlue][square.pieceid.index].rank;

		let className;
		if(square.isLake) className="squarelake";
		else if(square.isPurple) className="squarehighlightattack";
		else if(square.isHighlighted) className="squarehighlighted";
		else if(square.hasPiece===false) className="squarefree ";
		else if(square.pieceid.isBlue){
		 if(disp===1) className="squareblueoccupied spyB";
		 else if(disp===2) className="squareblueoccupied scoutB";
		 else if(disp===3) className="squareblueoccupied minerB";
         else if(disp===4) className="squareblueoccupied sergeantB";
         else if(disp===5) className="squareblueoccupied lieutenantB";
         else if(disp===6) className="squareblueoccupied captainB";
         else if(disp===7) className="squareblueoccupied majorB";
         else if(disp===8) className="squareblueoccupied colonelB"; 
         else if(disp===9) className="squareblueoccupied generalB";
         else if(disp===10) className="squareblueoccupied marshalB";
         else if(disp===0) className="squareblueoccupied flagB";
         else className="squareblueoccupied bombB";
		  }
		else{
		  if(disp===1) className="squareredoccupied spyR";
		 else if(disp===2) className="squareredoccupied scoutR";
		 else if(disp===3) className="squareredoccupied minerR";
         else if(disp===4) className="squareredoccupied sergeantR";
         else if(disp===5) className="squareredoccupied lieutenantR";
         else if(disp===6) className="squareredoccupied captainR";
         else if(disp===7) className="squareredoccupied majorR";
         else if(disp===8) className="squareredoccupied colonelR";
         else if(disp===9) className="squareredoccupied generalR";
         else if(disp===10) className="squareredoccupied marshalR";
         else if(disp===0) className="squareredoccupied flagR";
         else className="squareredoccupied bombR";
		}
        let id = "b" + (i+1) + "_" + (j+1);  
		return(
			<Square
				value={disp}
				className={className + " " +id}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
	renderPanelSquare(i, j){
		let p=j-1;
		let className;
		if(i%2 === 0){
	     if(i===0){
	     if(p===1) className="squareredoccupied spyR";
		 else if(p===2) className="squareredoccupied scoutR";
		 else if(p===3) className="squareredoccupied minerR";
         else if(p===4) className="squareredoccupied sergeantR";
         else if(p===5) className="squareredoccupied lieutenantR";
         else if(p===6) className="squareredoccupied captainR";
         else if(p===7) className="squareredoccupied majorR";
         else if(p===8) className="squareredoccupied colonelR";
         else if(p===9) className="squareredoccupied generalR";
         else if(p===10) className="squareredoccupied marshalR";
         else if(p===0) className="squareredoccupied flagR";
         else className="squareredoccupied bombR";
					} 

		else{ 
		 if(p===1) className="squareblueoccupied spyB";
		 else if(p===2) className="squareblueoccupied scoutB";
		 else if(p===3) className="squareblueoccupied minerB";
         else if(p===4) className="squareblueoccupied sergeantB";
         else if(p===5) className="squareblueoccupied lieutenantB";
         else if(p===6) className="squareblueoccupied captainB";
         else if(p===7) className="squareblueoccupied majorB";
         else if(p===8) className="squareblueoccupied colonelB"; 
         else if(p===9) className="squareblueoccupied generalB";
         else if(p===10) className="squareblueoccupied marshalB";
         else if(p===0) className="squareblueoccupied flagB";
         else className="squareblueoccupied bombB";
					} 
			return (
				<Square
					value={j-1}
					className={className}
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
			<div className=" board-row panel-row">
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

	blast(i,j){
		// 0 1 2
		// 3 4 5
		// 6 7 8

		// i,j is coordinate of bomb.
		var newPieces = this.state.pieces.slice();
		var newSquares = this.state.squares.slice();
		var bomb = newPieces[newSquares[10*i + j].pieceid.isBlue][newSquares[10*i+j].pieceid.index];

		var blastRadius = [
			{toAdd:  9, inRadius: true}, {toAdd: 10, inRadius: true}, {toAdd:11, inRadius: true},
			{toAdd: -1, inRadius: true}, {toAdd:  0, inRadius: true}, {toAdd: 1, inRadius: true},
			{toAdd:-11, inRadius: true}, {toAdd:-10, inRadius: true}, {toAdd:-9, inRadius: true}
		];

		for(let k=0; k<9; k++){
			if((i+1 > 11 && k<=2) || (i-1 < 0 && k>=6) || (j-1 < 0 && k%3 === 0) || (j+1 > 9 && k%3 === 2)){
				blastRadius[k].inRadius = false;
			}

			let m = 10*i +j + blastRadius[k].toAdd;

			if(blastRadius[k].inRadius === true && newSquares[m].pieceid !== null && newSquares[m].pieceid.isBlue !== bomb.isBlue){
				newPieces[newSquares[m].pieceid.isBlue][newSquares[m].pieceid.index].isAlive = false;
				newPieces[newSquares[m].pieceid.isBlue][newSquares[m].pieceid.index].pos = null;

				newSquares[m].hasPiece = false;
				newSquares[m].pieceid = null;
			}
		}

		
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

			if(prevRank === 1 && nextRank !== -1){
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;
					
				newSquares[10*i+j].pieceid = newSquares[this.state.lastClicked].pieceid;
				newPieces[newSquares[10*i+j].pieceid.isBlue][newSquares[10*i+j].pieceid.index].pos = 10*i + j;
				newSquares[10*i+j].hasPiece = true;
				newSquares[this.state.lastClicked].pieceid = null;
				newSquares[this.state.lastClicked].hasPiece = false;
			} else if(nextRank !== -1 || prevRank === 3){
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
			} else if(prevRank !== 3){
				//this.blast(i, j);
				newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].isAlive = false;
				newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos = null;

				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;

				newSquares[this.state.lastClicked].pieceid = null;
				newSquares[10*i+j].pieceid = null;

				newSquares[this.state.lastClicked].hasPiece = false;
				newSquares[10*i+j].hasPiece = false;
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

>>>>>>> Stashed changes
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