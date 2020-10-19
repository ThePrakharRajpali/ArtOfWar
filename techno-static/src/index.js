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
			blueTurn: false,
			abilityOn: null,
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

	testSetup() {

		let newSquares = this.state.squares;
		let newPieces = this.state.pieces;

		for(let iter=0;iter<40;iter++) {
			newPieces[1][iter].pos = iter;
			newSquares[iter].hasPiece = true;
			newSquares[iter].pieceid.isBlue = 1;
			newSquares[iter].pieceid.index = iter;
		}

		for(let iter=0;iter<40;iter++) {
			newPieces[0][iter].pos = 119 - iter;
			newSquares[119-iter].hasPiece = true;
			newSquares[119-iter].pieceid.isBlue = 0;
			newSquares[119-iter].pieceid.index = iter;
		}

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			numRed: 40,
			numBlue: 40,
			isSetup: false,
		});

	}

	
	firstClick(i, j) {
		if(this.state.squares[10*i + j].hasPiece===false || this.state.squares[10*i + j].isLake===true) {
			return;
		}else if(this.state.squares[10*i+j].pieceid.isBlue != this.state.blueTurn) { //Single equal don't @ me.
			return;
		}else {
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
				isListening: true,
				lastClicked: (10*i+j),
				});
			}
			return;
	}

	secondClick(i, j) {
		if(!this.state.squares[10*i+j].isHighlighted && !this.state.squares[10*i+j].isPurple){
			let newSquares = this.state.squares.slice();

			for(let i =0;i<120;i++) {
				newSquares[i].isHighlighted = false;
				newSquares[i].isPurple = false;
			}

			this.setState({
				squares: newSquares,
				isListening: false,
				lastClicked: null,
			});

			return;
		}

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
				newPieces[nextSquare.pieceid.isBlue][newSquares.pieceid.index].lastPos = newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos;
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;
				
				newSquares[10*i+j].pieceid = newSquares[this.state.lastClicked].pieceid;
				newPieces[newSquares[10*i+j].pieceid.isBlue][newSquares[10*i+j].pieceid.index].pos = 10*i + j;
				newSquares[10*i+j].hasPiece = true;
				newSquares[this.state.lastClicked].pieceid = null;
				newSquares[this.state.lastClicked].hasPiece = false;
				newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].kill += 1;
			} else if(nextRank !== -1 || prevRank === 3){
				if(prevRank === nextRank) {
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].isAlive = false;
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].lastPos = newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos;
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos = null;

					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].lastPos = newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;

					newSquares[this.state.lastClicked].pieceid = null;
					newSquares[10*i+j].pieceid = null;

					newSquares[this.state.lastClicked].hasPiece = false;
					newSquares[10*i+j].hasPiece = false;

				} else if(prevRank < nextRank) {
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].isAlive = false;
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].lastPos = newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos;
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos = null;

					newSquares[this.state.lastClicked].pieceid = null;
					newSquares[this.state.lastClicked].hasPiece = false;

					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].kill += 1;
				} else {
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].lastPos = newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;
					
					newSquares[10*i+j].pieceid = newSquares[this.state.lastClicked].pieceid;
					newPieces[newSquares[10*i+j].pieceid.isBlue][newSquares[10*i+j].pieceid.index].pos = 10*i + j;
					newSquares[10*i+j].hasPiece = true;
					newSquares[this.state.lastClicked].pieceid = null;
					newSquares[this.state.lastClicked].hasPiece = false;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].kill += 1;
				}
			} else if(prevRank !== 3){ //TODO Bomb.
				let orig = 10*i+j;

				for(let row_c = -10;row_c<=10;row_c=row_c+10) {
					for(let col_c = -1; col_c<=1; col_c++) {
						let co_od = 10*i + j + row_c + col_c;

						if(co_od>=0 && co_od<=119  && isNear(orig, co_od)) {
							if(!newSquares[co_od].isLake && newSquares[co_od].hasPiece) {
								if(newSquares[orig].pieceid.isBlue !== newSquares[co_od].pieceid.isBlue) {
									newPieces[newSquares[co_od].pieceid.isBlue][newSquares[co_od].pieceid.index].lastPos = newPieces[newSquares[co_od].pieceid.isBlue][newSquares[co_od].pieceid.index].pos;
									newPieces[newSquares[co_od].pieceid.isBlue][newSquares[co_od].pieceid.index].pos = null;
									newPieces[newSquares[co_od].pieceid.isBlue][newSquares[co_od].pieceid.index].isAlive = false;

									newSquares[co_od].hasPiece = false;
									newSquares[co_od].pieceid = null;
								}				
							}
						}
					}
				}

				newPieces[newSquares[orig].pieceid.isBlue][newSquares[orig].pieceid.index].pos = null;
				newPieces[newSquares[orig].pieceid.isBlue][newSquares[orig].pieceid.index].isAlive = false;

				newSquares[orig].pieceid = null;
				newSquares[orig].hasPiece = false;
			}
		}

		for(let i =0;i<120;i++) {
			newSquares[i].isHighlighted = false;
			newSquares[i].isPurple = false;
		}

		let blt = this.state.blueTurn;

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			isListening: false,
			lastClicked: null,
			isGameOn: !this.flagCaptured(),
			blueTurn: !blt,
		});
		return;
	}

	

	handleClick(i,j) {
		if(this.state.isSetup) {
			// if(this.state.squares[10*i + j].hasPiece === false){
			// 	if(this.state.isListening){
			// 		this.setupAddPiece(i, j);
			// 	}
			// }
			this.testSetup()
		} else if(this.state.abilityOn !== null){
			let last = this.state.lastClicked;
			let clickedPiece = this.state.pieces[this.state.squares[last].pieceid.isBlue][this.state.squares[last].pieceid.index];
			let rank = clickedPiece.rank;

			let newSquares = this.state.squares.slice();
			let newPieces = this.state.pieces.slice();
	
			if(rank === 1){ // spy (teleport)
				if(!newSquares[10*i + j].hasPiece){
					newPieces[newSquares[last].pieceid.isBlue][newSquares[last].pieceid.index].pos = 10*i + j;
					newPieces[newSquares[last].pieceid.isBlue][newSquares[last].pieceid.index].kill = 0;

					newSquares[10*i + j].hasPiece = true;
					newSquares[10*i + j].pieceid = newSquares[last].pieceid;

					newSquares[last].hasPiece = false;
					newSquares[last].pieceid = null;
				}
			} else if(rank === 2) { //Scout (dash)
				var numKills = 0;
				var currPos = last;
				var nextPos = (clickedPiece.isBlue) ? currPos + 10: currPos - 10;
				while(numKills <= 2 && (!newSquares[nextPos].isLake) && nextPos < 120 && nextPos>0){
					currPos = nextPos;
					nextPos = (clickedPiece.isBlue) ? currPos + 10: currPos - 10;

					if(newSquares[currPos].hasPiece && newSquares[currPos].pieceid.isBlue !== newSquares[last].pieceid.isBlue){
						newPieces[newSquares[currPos].pieceid.isBlue][newSquares[currPos].pieceid.index].lastPos = newPieces[newSquares[currPos].pieceid.isBlue][newSquares[currPos].pieceid.index].pos;
						newPieces[newSquares[currPos].pieceid.isBlue][newSquares[currPos].pieceid.index].pos = null;
						newPieces[newSquares[currPos].pieceid.isBlue][newSquares[currPos].pieceid.index] = null;
						newSquares[currPos].pieceid = null;
						newSquares[currPos].hasPiece = false;
						numKills += 1;
					} else if(newSquares[currPos].hasPiece && newSquares[currPos].pieceid.isBlue === newSquares[last].pieceid.isBlue){
						currPos = nextPos;
						nextPos = (clickedPiece.isBlue) ? currPos + 10: currPos - 10;
					}
				}

				newPieces[newSquares[last].pieceid.isBlue][newSquares[last].pieceid.index].isAlive = false;
				newPieces[newSquares[last].pieceid.isBlue][newSquares[last].pieceid.index].lastPos = last;
				newPieces[newSquares[last].pieceid.isBlue][newSquares[last].pieceid.index].pos = null;
				newSquares[last].hasPiece = false;
				newSquares[last].pieceid = null;

			} else if(rank === 3) { // Miner 
				//show
			} else if(rank === 4) { // Sergeant (direct kill)
				if(newSquares[10*i + j].hasPiece){
					newPieces[newSquares[10*i + j].pieceid.isBlue][newSquares[10*i + j].pieceid.index].lastPos = 10*i + j;
					newPieces[newSquares[10*i + j].pieceid.isBlue][newSquares[10*i + j].pieceid.index].pos = null;
					newPieces[newSquares[10*i + j].pieceid.isBlue][newSquares[10*i + j].pieceid.index].isAlive = false;
					newSquares[10*i + j].hasPiece = false;
					newSquares[10*i + j].pieceid = null;
				}
				
			} else if(rank === 5) { // Lietenant
				//show
			} else if(rank === 6) { // captain (freeze one piece)
				if(newSquares[10*i + j].hasPiece && newSquares[10*i + j].pieceid.isBlue !== newSquares[last].pieceid.isBlue){
					newPieces[ newSquares[10*i + j].pieceid].isMovable = false;
				}
			} else if(rank === 7) { // Major (NOT DECIDED)

			} else if(rank === 8) { // Colonel (Bomb to mortar)
				
			} else if(rank === 9) { // Genaral (revive)
				if(!newSquares[10*i+j].hasPiece){
					for(var k=39; k>=0; k++){
						if(10*i + j === newPieces[newSquares[last].pieceid.isBlue][k].lastPos){
							newPieces[newSquares[last].pieceid.isBlue][k].lastPos = null;
							newPieces[newSquares[last].pieceid.isBlue][k].pos = 10*i + j;
							newPieces[newSquares[last].pieceid.isBlue][k].isAlive = true;

							newSquares[10*i + j].hasPiece = true;
							newSquares[10*i + j].pieceid = {
								isBlue: newSquares[last].pieceid.isBlue,
								index: k,
							}
						}
					}
				}
			} else if(rank === 10) { // Marshal
				// show
			}

			this.setState({
				squares: newSquares,
				pieces: newPieces,
				last: null,
				abilityOn: false,
				isListening: false,
			})
		} else if(this.state.isGameOn){
			var blt = this.state.blueTurn;
			if(!this.state.isListening) {
				this.firstClick(i, j);
				return;
			} else if(this.state.blueTurn === blt) {
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

	useAbility(){
		var last = this.state.lastClicked;
		
		if(this.state.isListening){
			var clickedPiece = this.state.pieces[this.state.squares[last].pieceid.isBlue][this.state.squares[last].pieceid.index];

			if(this.checkAbility()){
				this.setState({
					abilityOn: clickedPiece,
				})
			}
		}
	}

	checkAbility(){
		var newPieces = this.state.pieces.slice();
		var newSquares = this.state.squares.slice();
		var last = this.state.lastClicked;
		var piece = newPieces[newSquares[last].pieceid.isBlue][newSquares[last].pieceid.index];

		let rank = piece.rank;
		let kills = piece.kill;
		return((rank > 3 && kills >= 5) ||(rank === 3 && kills >= 3) || (rank === 2 && kills >= 1) || (rank === 1 && kills >= 5));
	}
	
	render() {
		return (
			<div>
				<div className="table">
					{this.renderPanelRow(3)}
					{this.renderPanelRow(2)}

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
				{/* </div>
				<div className="panel table"> */}
					<button onClick={() => this.useAbility()}>Use ability</button>
					{this.renderPanelRow(0)}
					{this.renderPanelRow(1)}
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

function isNear (a, b) {
	return ((Math.abs(a%10 - b%10) <= 1) && (Math.abs(Math.floor(a/10) - Math.floor(b/10)) <= 1));
}

class Piece {
	constructor(isBlue,rank,isMovable) {
		this.isBlue = isBlue;
		this.pos = null;
		this.rank = rank;
		this.isAlive = true;
		this.isMovable = isMovable;
		this.kill = 0;
		this.lastPos = null;
	}
}

ReactDOM.render(<Board/>, document.getElementById("root"));