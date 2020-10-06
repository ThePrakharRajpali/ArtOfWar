import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {board:[]};
  };

  initializeBoard(){
    for(var i=0; i<10; i++) {
      var col = []
      for(var j =0; j<12; j++){
        col.push({x:i, y:j});
      }
      this.state.board.push(col);
    }
  }

  showRow(j){
    let row = [];
    for(var i=0; i<10; i++){
      var key = 10*i + j;
      row.push(<td className="square"><Square value = { {x: i, y: j}} key={key}/></td>)
    }

    return(<tr className="row">{row}</tr>);
  }

  showBoard(){
    let sq = [];
    this.initializeBoard();
    for(var j=0; j<12; j++){
     sq.push(this.showRow(j));
    }
    return sq;
  }  
  
  render(){
    return(
      <div>
        <div className="board">
          {this.showBoard()}
        </div>
      </div>
    );
  }
}

class Square extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
    <button>{this.props.value.x} {this.props.value.y}</button>
    );
  }
}

ReactDOM.render(
  <Board/>, document.getElementById('root')
);