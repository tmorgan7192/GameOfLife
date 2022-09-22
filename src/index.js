import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          key={i}
        />
      );
    }

    renderRow(i) {
      const squares = []
      for(let j=0; j<this.props.num_cols; ++j) {
        squares.push(this.renderSquare(i * this.props.num_cols + j))
      }
      return <div className="board-row" key={i}>{squares}</div>;
    }
  
    render() {
      const rows = []
      for(let i=0; i<this.props.num_rows; ++i) {
        rows.push(this.renderRow(i))
      }
      return <div>{rows}</div>;
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(this.props.num_rows * this.props.num_cols).fill(null)
          }
        ],
        stepNumber: 0
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      squares[i] = squares[i] === "X" ? null : "X";
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length
      });
    }

    getNeighborCount(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const neighborIndices = [ 
        i - this.props.num_cols - 1,
        i - this.props.num_cols,
        i - this.props.num_cols + 1,
        i - 1,
        i + 1,
        i + this.props.num_cols - 1,
        i + this.props.num_cols,
        i + this.props.num_cols + 1,
      ];
      let neighborCount = 0;
      neighborIndices.forEach( j => {
        if (j >= 0 && j < this.props.num_rows * this.props.num_cols) {
          neighborCount += squares[j] === 'X' ? 1 : 0;
        }
      });
      return neighborCount;
    }

    nextState() {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      for (let i=0; i<squares.length; ++i) {
        const neighborCount = this.getNeighborCount(i);
        squares[i] = (squares[i] === 'X' && neighborCount >= 2 && neighborCount <= 3) || (squares[i] === null && neighborCount === 3) ? 'X' : null;
      }
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length
      });
    }

  
    jumpTo(step) {
      this.setState({
        stepNumber: step
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
              num_rows={this.props.num_rows}
              num_cols={this.props.num_cols}
            />
          </div>
          <div className="buttons">
            <button onClick={() => this.jumpTo(0)}>Clear board</button>
            <button onClick={() => this.nextState()}>Next State</button>
            <button onClick={() => this.jumpTo(Math.max(this.state.stepNumber - 1, 0))}>Previous State</button>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game num_cols={30} num_rows={30}/>);
  