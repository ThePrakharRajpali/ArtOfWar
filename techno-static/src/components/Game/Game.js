import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import queryString from 'query-string';
import io from 'socket.io-client';
import '../../index.css';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import logo from '../../Techno-logo_2_20.png';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const ENDPOINT = 'localhost:5000';

// const roomId = ({ location }) => {
// 	const [name, setName] = useState('');
// 	const [room, setRoom] = useState('');
	
// 	useEffect(()=>{
// 		const { name,room }=queryString(location.search);
// 		socket=io(ENDPOINT);

// 		setName(name);
// 		setRoom(room);

// 		console.log(socket);
// 	},[ENDPOINT,location.search])
// }

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
			isPlayerBlue: true,
			lastClicked: null,
			isSetup: true,
			numRed: 0,
			numBlue: 0,
			isGameOn: true,
			initialRedPiece: [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1],
			initialBluePiece: [6, 1, 1, 7, 5, 5, 4, 4, 3, 2, 1, 1],
			pieceToAdd: null,
			pieceToMove: null,
			blueTurn: false,
			redScore: 0,
			blueScore: 0,
			name:"",
			room:"",
			clickMask: false,
			redTime: 60*20,
			blueTime: 60*20,
			room: this.props.location.state.roomid,
			name: this.props.location.state.name,
		};
		this.socket = io(ENDPOINT);
	}

	componentDidMount(){
		//const name = this.props.location.state.name;
		const room = this.props.location.state.roomid;
		const name = this.props.location.state.name;
		console.log("roomid is: " + room);
		console.log("player is: " + name);
		this.socket.emit('join',{data: room, rollno: name});

		this.socket.emit('disconnect',function(){
			console.log("bye bye!!");				
		});

		this.socket.on("roomid", ({ roomid, isPlayerBlue, roomState }) => {
			this.setState({
				isPlayerBlue: isPlayerBlue,
				squares: roomState.squares,
				pieces: roomState.pieces,
				blueScore: roomState.blueScore,
				redScore: roomState.redScore,
				isGameOn: roomState.isGameOn,
				blueTurn: roomState.blueTurn,
				isSetup: roomState.isSetup,
				numBlue: roomState.numBlue,
				numRed:  roomState.numRed,
				initialRedPiece: roomState.initialRedPiece,
				initialBluePiece: roomState.initialBluePiece,
			});	
			console.log("Roomid given");
		});

		this.socket.on("move", (data) => {
			this.setState({
				squares: data.squares,
				pieces: data.pieces,
				isGameOn: data.isGameOn,
				blueScore: data.blueScore,
				redScore: data.redScore,
				blueTurn: data.blueTurn,
			});
		});

		this.socket.on("setupDone", (data) =>{
			this.setState({
				squares: data.squares,
				pieces: data.pieces,
				isGameOn: data.isGameOn,
				blueScore: data.blueScore,
				redScore: data.redScore,
				blueTurn: data.blueTurn,
				isSetup: data.isSetup,
				clickMask: false,
			});
		});

		this.socket.on("newPieceAddedInfo", (data) => {
			this.setState({
				squares: data.squares,
				pieces: data.pieces,
				initialBluePiece: data.initialBluePiece,
				initialRedPiece: data.initialRedPiece,
				numRed: data.numRed,
				numBlue: data.numBlue,
				pieceToAdd: null,
				pieceToMove: null,
				lastClicked: null,
				isListening: false,
			});
		});

		this.socket.on("timer", (timeinterval) => {
            this.setState({
                blueTime:timeinterval.blue,
                redTime:timeinterval.red,
            });
        });

        this.socket.on("Ended", (data) => {
        	console.log(this.isPlayerBlue);
        	console.log(data);
        	if(this.state.isPlayerBlue==data) alert("Congratulations, You won!!");
            else alert("you lost :( better luck next time");
            this.state.ended=1;
            console.log(this.state)
            this.setState({
               isGameOn: false,
            });

            if(this.state.blueScore<180 && this.state.redScore<180){
            	if(data===0) {
            		let redScore = this.state.redScore;
            		this.setState({redScore: redScore+180});
            	}else{
            		let blueScore = this.state.blueScore;
            		this.setState({blueScore: blueScore+180});
            	}
            }
        });
	}


	renderSquare(i, j) {

		let square = this.state.squares[10*i+j];
		let pieces = this.state.pieces;
		let disp = null;
		if(square.hasPiece === true && pieces[square.pieceid.isBlue][square.pieceid.index].rank===-1) disp = 'B';
		else if(square.hasPiece === true && pieces[square.pieceid.isBlue][square.pieceid.index].rank===0) disp = 'F';
		else if(square.hasPiece === true) disp = pieces[square.pieceid.isBlue][square.pieceid.index].rank;

		let className;
		if(square.isLake) className="squarelake";
		else if(square.isHighlighted) className="squarehighlighted";
		else if(square.hasPiece===false) className="squarefree";
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
         else if(disp==='F') className="squareblueoccupied flagB";
         else className="squareblueoccupied bombB";
		}
		else {
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
         else if(disp==='F') className="squareredoccupied flagR";
         else className="squareredoccupied bombR";
		}
		if(disp!==null && square.pieceid.isBlue!=this.state.isPlayerBlue){
			if( square.pieceid.isBlue){
           className="squareblueoccupied hideB";
		    }
		    else {
		   className="squareredoccupied hideR";
           }
		 }

		if(square.isPurple) className="squarehighlightattack";

		let id;

		if(this.state.isPlayerBlue)
			id = "b" + (11-i+1) + "_" + (9-j+1);
		else
			id = "b" + (i+1) + "_" + (j+1);

		return(
			<Square
				className={className + " " + id} 
				onClick={()=>this.handleClick(i,j)}
			/>
			);

	}

	renderRow(i) {
		
		if(this.state.isPlayerBlue){
			return(
				<div className="board-row">
					{this.renderSquare(i,9)}
					{this.renderSquare(i,8)}
					{this.renderSquare(i,7)}
					{this.renderSquare(i,6)}
					{this.renderSquare(i,5)}
					{this.renderSquare(i,4)}
					{this.renderSquare(i,3)}
					{this.renderSquare(i,2)}
					{this.renderSquare(i,1)}
					{this.renderSquare(i,0)}
				</div>
				);
		}else {
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

	}

	renderPanelSquare(i, j){
		
		let disp = null;
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
         disp=j-1;

         if(j==0) disp = 'B';
         if(j==1) disp = 'F';
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
         disp=j-1;

         if(j==0) disp = 'B';
         if(j==1) disp = 'F';
		} 
			return (
				<Square
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

	handlePanelClick(i, j){
		if(this.state.isSetup && !this.state.clickMask){
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
					return;
				}

				if(curr >= 40){
					return;
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

		{	
			if(newPieces[pieceColor][pieceIndex].pos === null){
				if(pieceColor === 1 && 10*i + j <= 39){
					newSquares[10*i + j].pieceid = {
						isBlue: 1,
						index : pieceIndex,
					}
					newSquares[10*i + j].hasPiece = true;
					newPieces[pieceColor][pieceIndex].pos = 10*i + j;
					blueCount++;
					bluePieces[newPieces[pieceColor][pieceIndex].rank + 1] -= 1;
				} else if(pieceColor === 0 && 10*i + j >= 80) {
					newSquares[10*i + j].pieceid = {
						isBlue: 0,
						index : pieceIndex,
					}
					newSquares[10*i + j].hasPiece = true;
					newPieces[pieceColor][pieceIndex].pos = 10*i + j;
					redCount++;
					redPieces[newPieces[pieceColor][pieceIndex].rank + 1] -= 1;
				}

				let toSend = {
					squares: newSquares,
					pieces: newPieces,
					initialBluePiece: bluePieces,
					initialRedPiece: redPieces,
					numRed: redCount,
					numBlue: blueCount,
				};

				this.socket.emit("newPieceAdd", toSend);

				this.setState({
					squares: newSquares,
					pieces: newPieces,
					numRed: redCount,
					numBlue: blueCount,
					isListening: false,
					initialBluePiece: bluePieces,
					initialRedPiece: redPieces,
					pieceToAdd: null,
				})
			}
		}
	}

	setupFirstClick(i,j){
		if(this.state.isListening || !this.state.squares[10*i+j].hasPiece){
			return;
		}else{
			if(this.state.isPlayerBlue == this.state.squares[10*i+j].pieceid.isBlue){
				let newPiece = this.state.squares[10*i+j].pieceid;
				this.setState({
					pieceToMove: newPiece,
					isListening: true,
					lastClicked: 10*i+j,
				});
			}
		}
	}

	setupSecondClick(i,j){
		let colorToMove = this.state.pieceToMove.isBlue;
		let newSquares = this.state.squares.slice();
		let newPieces = this.state.pieces.slice();

		if((!colorToMove && 10*i+j >=80) || (colorToMove && 10*i+j <=39)) {
			let clickedPiece = this.state.pieceToMove;
			let swapPiece = newSquares[10*i+j].pieceid;
			let hadPiece = newSquares[10*i+j].hasPiece;

			newSquares[10*i+j].hasPiece = true;
			newSquares[10*i+j].pieceid = clickedPiece;
			newPieces[clickedPiece.isBlue][clickedPiece.index].pos = 10*i+j;

			if(hadPiece){
				newPieces[swapPiece.isBlue][swapPiece.index].pos = this.state.lastClicked;
				newSquares[this.state.lastClicked].pieceid = swapPiece;
			}else{
				newSquares[this.state.lastClicked].hasPiece = false;
				newSquares[this.state.lastClicked].pieceid = null;
			}

			let toSend = {
				squares: newSquares,
				pieces: newPieces,
				initialBluePiece: this.state.initialBluePiece,
				initialRedPiece: this.state.initialRedPiece,
				numRed: this.state.redCount,
				numBlue: this.state.blueCount,
			};

			this.socket.emit("newPieceAdd", toSend);

			this.setState({
				squares: newSquares,
				pieces: newPieces,
				isListening: false,
				pieceToMove: null,
				lastClicked: null,
			});
		}else{
			this.setState({
				isListening: false,
				pieceToMove: null,
				lastClicked: null,
			});
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

		let redScore = this.state.redScore;
		let blueScore = this.state.blueScore;

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

				if(newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isBlue){
					blueScore += nextRank;
				} else {
					redScore += nextRank;
				}
			} else if(nextRank !== -1 || prevRank === 3){
				if(prevRank === nextRank) {
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].isAlive = false;
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos = null;

					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].lastPos = newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;

					newSquares[this.state.lastClicked].pieceid = null;
					newSquares[10*i+j].pieceid = null;

					newSquares[this.state.lastClicked].hasPiece = false;
					newSquares[10*i+j].hasPiece = false;

				} else if(prevRank < nextRank) {
					let lastPieceId = lastSquare.pieceid;
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].isAlive = false;
					newPieces[lastSquare.pieceid.isBlue][lastSquare.pieceid.index].pos = null;

					newSquares[this.state.lastClicked].pieceid = null;
					newSquares[this.state.lastClicked].hasPiece = false;

					if(!newPieces[lastPieceId.isBlue][lastPieceId.index].isBlue){
						blueScore += prevRank;
					} else {
						redScore += prevRank;
					}
				} else {

					let lastPieceId = lastSquare.pieceid;
					let nextPieceId = nextSquare.pieceid;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].isAlive = false;
					newPieces[nextSquare.pieceid.isBlue][nextSquare.pieceid.index].pos = null;
					
					newSquares[10*i+j].pieceid = newSquares[this.state.lastClicked].pieceid;
					newPieces[newSquares[10*i+j].pieceid.isBlue][newSquares[10*i+j].pieceid.index].pos = 10*i + j;
					newSquares[10*i+j].hasPiece = true;
					newSquares[this.state.lastClicked].pieceid = null;
					newSquares[this.state.lastClicked].hasPiece = false;

					if(nextRank === 1){
						if(newPieces[lastPieceId.isBlue][lastPieceId.index].isBlue){
							blueScore += prevRank;
						} else {
							redScore += prevRank;
						}
					} else if (nextRank === -1){
						if(newPieces[lastPieceId.isBlue][lastPieceId.index].isBlue){
							blueScore += 5;
						} else {
							redScore += 5;
						}
					} else if( nextRank === 0){
						if(newPieces[lastPieceId.isBlue][lastPieceId.index].isBlue){
							blueScore += 180;
						} else {
							redScore += 180;
						}
					} else {
						if(newPieces[lastPieceId.isBlue][lastPieceId.index].isBlue){
							blueScore += nextRank;
						} else {
							redScore += nextRank;
						}
					}
				}
			} else if(prevRank !== 3){ //TODO Bomb.
				let orig = 10*i+j;

				for(let row_c = -10;row_c<=10;row_c=row_c+10) {
					for(let col_c = -1; col_c<=1; col_c++) {
						let co_od = 10*i + j + row_c + col_c;

						if(co_od>=0 && co_od<=119  && isNear(orig, co_od)) {
							if(!newSquares[co_od].isLake && newSquares[co_od].hasPiece) {
								if(newSquares[orig].pieceid.isBlue !== newSquares[co_od].pieceid.isBlue) {
									var nextRankBlast = newPieces[newSquares[co_od].pieceid.isBlue][newSquares[co_od].pieceid.index].rank;
									newPieces[newSquares[co_od].pieceid.isBlue][newSquares[co_od].pieceid.index].pos = null;
									newPieces[newSquares[co_od].pieceid.isBlue][newSquares[co_od].pieceid.index].isAlive = false;

									newSquares[co_od].hasPiece = false;
									newSquares[co_od].pieceid = null;

									if(newPieces[newSquares[orig].pieceid.isBlue][newSquares[orig].pieceid.index].isBlue){
										blueScore += nextRankBlast
									} else {
										redScore += nextRankBlast
									}
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

		let toSend = {
			turn: !blt,
			isGameOn: !this.flagCaptured(),
			blueScore: blueScore,
			redScore: redScore,
			squares: newSquares,
			pieces: newPieces,
			room: this.state.room,
			name: this.state.name,
		};

		this.socket.emit("moved", toSend);

		this.setState({
			squares: newSquares,
			pieces: newPieces,
			isListening: false,
			lastClicked: null,
			isGameOn: !this.flagCaptured(),
			blueTurn: !blt,
			redScore: redScore,
			blueScore: blueScore,
		});

		if(this.flagCaptured()){
			this.socket.emit("win", this.state.isPlayerBlue?1:0);
		}
		return;
	}

	handleClick(i,j) {
		if(this.state.isSetup && !this.state.clickMask) {

			if(this.state.pieceToAdd !== null){
				if(this.state.squares[10*i+j].hasPiece === false){
					this.setupAddPiece(i,j);
				}
			}else if(!this.state.isListening){
				this.setupFirstClick(i,j);
			}else{
				this.setupSecondClick(i,j);
			}

			// this.testSetup()
		} else if(!this.state.clickMask && this.state.isGameOn && this.state.isPlayerBlue === this.state.blueTurn){
			let blt = this.state.blueTurn;
			if(!this.state.isListening) {
				this.firstClick(i, j);
				return;
			} else if(this.state.blueTurn === blt) {
				this.secondClick(i, j);
				return;
			}
			
		}
	}
	
	render() {

		let Panel = null;
		let readyButton = null;
		let resignButton = null;
		let timerPanelRed = null;
		let timerPanelBlue = null;
		let turnDetails = null;

		if(this.state.isSetup){
			if(this.state.isPlayerBlue) Panel = <div>{this.renderPanelRow(2)}{this.renderPanelRow(3)}</div>;
			else Panel = <div>{this.renderPanelRow(0)}{this.renderPanelRow(1)}</div>;
		}

		if(this.state.isSetup) readyButton = <button className="btn btn-success" onClick={()=>this.readyClick()}>Ready</button>;

		if(!this.state.isSetup){
			timerPanelRed = <p className = "badge badge-danger" >Red is left with <p>{this.state.redTime}</p></p>;
			timerPanelBlue = <p className = "badge badge-primary">Blue is left with <p>{this.state.blueTime}</p></p>;
		}	

		if(this.state.isGameOn) resignButton = <button className="btn btn-danger" onClick={()=>this.resignClick()}>Resign</button>

		if(this.state.isSetup){
			if(!this.state.clickMask){
				turnDetails = <h3>Setup Your Board</h3>
			} else {
				turnDetails = <h3>Waiting For Opponent to Setup</h3>
			}
		} else {
			if(this.state.isPlayerBlue === this.state.blueTurn){
				turnDetails = <h3>Your Turn</h3>
			} else {
				turnDetails = <h3>Opponent's Turn</h3>
			}
		}

		if(this.state.isPlayerBlue){
			return (
				<div>
					<span>
  						<Navbar /*className="justify-content-center"*/ expand="lg" variant="dark" bg="dark">
							<span><TechnoLogo/></span>
						  	{/* <span className='help'> <img src={logo}></img>   </span> */}
							<Navbar.Brand className='mx-auto' href="#"><h1>Ultimate Stratego</h1></Navbar.Brand>
							<span className='help'><Help/></span>
  						</Navbar>
						
						
					</span>
					<div classname="show-content bg-success text-white">
						<div className="row justify-content-between text-center">
							<div className="col-4"><h4>Opponent's Score: {this.state.redScore}</h4></div> <div className="col-4">{turnDetails}</div> <div className="col-2 col-md-4"><h4>Your Score: {this.state.blueScore}</h4></div>
						</div>
						<div className="row justify-content-between">
							<div className="col-2"></div>
							<div className="col-2">
								{timerPanelRed}
							</div>
							<div classname="col-2">
								{timerPanelBlue}
							</div>
							<div className="col-2"></div>
						</div>
					</div>
					<div className='table'>
					
					<span className="">
						

						{this.renderRow(11)}
						{this.renderRow(10)}
						{this.renderRow(9)}
						{this.renderRow(8)}
						{this.renderRow(7)}
						{this.renderRow(6)}
						{this.renderRow(5)}
						{this.renderRow(4)}
						{this.renderRow(3)}
						{this.renderRow(2)}
						{this.renderRow(1)}
						{this.renderRow(0)}
					</span>
					<span className=''>
						<br></br>
						{Panel}
						<br></br>
						<div className="row">
							<div className="col-2">{readyButton}</div>
							<div className="col-8"></div>
							<div className="col-2">{resignButton}</div>
						</div>
						
						
					</span>
					
					</div>
					<span className='footer'>Copyright (C) Technothlon 2019-20</span>
				</div>
				);
		} else{
			return (
				<div>
					<span>
  						<Navbar /*className="justify-content-center"*/ expand="lg" variant="dark" bg="dark">
							<span><TechnoLogo/></span>
						  	{/* <span className='help'> <img src={logo}></img>   </span> */}
    						<Navbar.Brand className='mx-auto' href="#"><h1>Ultimate Stratego</h1></Navbar.Brand>
							<span className='help'><Help/></span>
  						</Navbar>
						
					</span>
					<div classname="show-content bg-success text-white">
						<div className="row justify-content-between text-center">
							<div className="col-4"><h4>Opponent's Score: {this.state.blueScore}</h4></div> <div className="col-4">{turnDetails}</div> <div className="col-2 col-md-4"><h4>Your Score: {this.state.redScore}</h4></div>
						</div>

						<div className="row justify-content-between">
							<div className="col-2"></div>
							<div className="col-2">
								{timerPanelBlue}
							</div>
							<div classname="col-2">
								{timerPanelRed}
							</div>
							<div className="col-2"></div>
						</div>
					</div>
					<div className='table'>
					<span className="">

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
					</span>
					<span className=''>
						<br></br>
						{Panel}
						<br></br>
						<div className="row">
							<div className="col-2">{readyButton}</div>
							<div className="col-8"></div>
							<div className="col-2">{resignButton}</div>
						</div>
					</span>

					</div>
					<div className='footer'>Copyright (C) Technothlon 2019-20</div>
				</div>
				);
		}

	}
	resignClick(){
		var quit = prompt("Type: RESIGN to end match");
		if(quit.toUpperCase() === "RESIGN"){
			this.socket.emit("win", this.state.isPlayerBlue?0:1);
		} else {
			alert("You could not resign");
			return;
		}
	}

	readyClick(){
		if(!this.state.clickMask){
			if(this.state.isPlayerBlue){
				if(this.state.numBlue<40) alert('Place all pieces first.');
				else {
					this.socket.emit("ready",function(){
						console.log("Blue is Ready");				
					});

					this.setState({clickMask:true});
				}
			}else{
				if(this.state.numRed<40) alert('Place all pieces first.');
				else {
					this.socket.emit("ready",function(){
						console.log("Red is ready");				
					});

					this.setState({clickMask:true});
				}
			}
		}
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
		part.push(pieceMaker(isBlue,-1,false));

	part.push(pieceMaker(isBlue,0,false));
	part.push(pieceMaker(isBlue,1,true));

	for(let i=0;i<7;i++)
		part.push(pieceMaker(isBlue,2,true));

	for(let i=0;i<5;i++)
		part.push(pieceMaker(isBlue,3,true));

	for(let i=0;i<5;i++)
		part.push(pieceMaker(isBlue,4,true));

	for(let i=0;i<4;i++)
		part.push(pieceMaker(isBlue,5,true));

	for(let i=0;i<4;i++)
		part.push(pieceMaker(isBlue,6,true));

	for(let i=0;i<3;i++)
		part.push(pieceMaker(isBlue,7,true));

	for(let i=0;i<2;i++)
		part.push(pieceMaker(isBlue,8,true));

	part.push(pieceMaker(isBlue,9,true));
	part.push(pieceMaker(isBlue,10,true));

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

function pieceMaker(isBlue, rank, isMovable) {
	let piece = {
		isBlue: isBlue,
		pos: null,
		rank: rank,
		isMovable: isMovable,
		isAlive: true,
	};

	return piece;
}

function Help() {
	const [show, setShow] = useState(false);
  
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
  
	return (
	  <span>
		<Button variant="primary" onClick={handleShow}>
		  Help
		</Button>
  
		<Modal show={show} onHide={handleClose}>
		  <Modal.Header closeButton>
			<Modal.Title>Modal heading</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
		  <Modal.Footer>
			<Button variant="secondary" onClick={handleClose}>
			  Close
			</Button>
			{/* <Button variant="primary" onClick={handleClose}>
			  Save Changes
			</Button> */}
		  </Modal.Footer>
		</Modal>
	  </span>
	);
  }

const popover = (
	<Popover id="popover-basic">
	  <Popover.Title as="h3">Message from Technothlon</Popover.Title>
	  <Popover.Content>
		Good luck playing the game of Ultimate Stratego ;)
	  </Popover.Content>
	</Popover>
  );
  
  const TechnoLogo = () => (
	<OverlayTrigger trigger="click" placement="right" overlay={popover}>
		<a href='#'><img src={logo} alt='technologo'></img></a>
	  {/* <Button variant="success">Click</Button> */}
	</OverlayTrigger>
  );

export default Board;
// ReactDOM.render(<Board/>, document.getElementById("root"));
