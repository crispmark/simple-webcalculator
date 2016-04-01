//this file is responsible for graphical calculator creation and interaction
import React from 'react';
import ReactDOM from 'react-dom';
import Evaluator from './evaluator.js'

var Calculator = React.createClass({

// initial expression is empty
  getInitialState: function(){
    return {
      calcExpression: "",
      error: false,
      shiftleft: false,
      shiftright: false
    };
  },

//on textbox change events, update the stored expression in state
  handleChange: function(event) {
    this.setState({calcExpression: event.target.value, error: false});
  },

//appends a string to calcExpression
  appendString: function(str, event) {
    this.setState({calcExpression: this.state.calcExpression + str});
  },

//deletes the last character in calcExpression
  deleteChar: function() {
    var calcExp = this.state.calcExpression;
    var newStr = calcExp.substring(0, calcExp.length -1);
    this.setState({calcExpression: newStr, error: false});
  },

//sets calcExpression to empty string
  clearString: function() {
    this.setState({calcExpression: "", error: false});
  },

//evaluates calcExpression and replaces it with the calculated value
  evaluate: function(event) {
    if (event) {
      event.preventDefault();
    }
    var expression = this.state.calcExpression;
    try {
      var result = Evaluator.evaluate(expression);
      this.setState({calcExpression: result, error: false});
    } catch (e) {
      this.setState({error: true});
    }
  },
  //redirects enter key on buttons to evaluate
  suppressEnter: function(event){
    //if enter key
    if (event.keyCode===13) {
      this.evaluate(event);
    }
  },

  //determines if the shift key is pressed
  shiftOn: function() {
    return this.state.shiftleft || this.state.shiftright;
  },

  handleKeyDown: function(event) {
    event.preventDefault();
    switch(event.code) {
      case 'ShiftLeft':
      this.setState({shiftleft: true});
      break;
      case 'ShiftRight':
      this.setState({shiftright: true});
      break;
      case 'Digit0':
      if (!this.shiftOn()) {
        this.appendString('0');
      } else {
        this.appendString(')');
      }
      break;
      case 'Digit1':
      if (!this.shiftOn()) {
        this.appendString('1');
      }
      break;
      case 'Digit2':
      if (!this.shiftOn()) {
        this.appendString('2');
      }
      break;
      case 'Digit3':
      if (!this.shiftOn()) {
        this.appendString('3');
      }
      break;
      case 'Digit4':
      if (!this.shiftOn()) {
        this.appendString('4');
      }
      break;
      case 'Digit5':
      if (!this.shiftOn()) {
        this.appendString('5');
      } else {
        this.appendString('%');
      }
      break;
      case 'Digit6':
      if (!this.shiftOn()) {
        this.appendString('6');
      } else {
        this.appendString('^');
      }
      break;
      case 'Digit7':
      if (!this.shiftOn()) {
        this.appendString('7');
      }
      break;
      case 'Digit8':
      if (!this.shiftOn()) {
        this.appendString('8');
      } else {
        this.appendString('*');
      }
      break;
      case 'Digit9':
      if (!this.shiftOn()) {
        this.appendString('9');
      } else {
        this.appendString('(');
      }
      break;
      case 'Slash':
      if (!this.shiftOn()) {
        this.appendString('/');
      }
      break;
      case 'Minus':
      if (!this.shiftOn()) {
        this.appendString('-');
      }
      break;
      case 'Equal':
      if (!this.shiftOn()) {
        this.evaluate();
      } else {
        this.appendString('+');
      }
      break;
      case 'Backspace':
      this.deleteChar();
      break;
      case 'Enter':
      this.evaluate();
      break;
    }
  },

  handleKeyUp: function(event) {
    switch(event.code) {
      case 'ShiftLeft':
      this.setState({shiftleft: false});
      break;
      case 'ShiftRight':
      this.setState({shiftright: false});
      break;
    }
  },

  //add key listeners on mount
  componentWillMount:function(){
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
  },

  //remove key listeners on unmount
  componentWillUnmount: function() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  },

  render: function() {
    var textboxClass = "box";
    if (this.state.error) {
      textboxClass = "errorBox";
    }
    return(
      <div>
        <form onSubmit={this.evaluate}>
          <input className={textboxClass}
            type="text"
            value={this.state.calcExpression}
            onChange={this.handleChange}/>
        </form>
        <div className="buttonColumn">
          <div className="buttonRow">
            {makeButton.call(this, "7")}
            {makeButton.call(this, "8")}
            {makeButton.call(this, "9")}
            {makeButton.call(this, "/")}
            <button onKeyDown={this.suppressEnter} onClick={this.deleteChar}>del</button>
            <button onKeyDown={this.suppressEnter} onClick={this.clearString}>clear</button>
          </div>
          <div className="buttonRow">
            {makeButton.call(this, "4")}
            {makeButton.call(this, "5")}
            {makeButton.call(this, "6")}
            {makeButton.call(this, "*")}
            {makeButton.call(this, "(")}
            {makeButton.call(this, ")")}
          </div>
          <div className="buttonRow">
            {makeButton.call(this, "1")}
            {makeButton.call(this, "2")}
            {makeButton.call(this, "3")}
            {makeButton.call(this, "-")}
            <button onKeyDown={this.suppressEnter} onClick={this.appendString.bind(this, "^")}>x<sup>y</sup></button>
            {makeButton.call(this, "√")}
          </div>
          <div className="buttonRow">
            {makeButton.call(this, "0")}
            {makeButton.call(this, ".")}
            {makeButton.call(this, "%")}
            {makeButton.call(this, "+")}
            <button className="equalButton" onClick={this.evaluate}>=</button>
          </div>
        </div>
      </div>
    );
  }
});

//makes a button that displays a single character, and adds that character to
//the calcExpression when pressed
function makeButton(char) {
  return <button onKeyDown={this.suppressEnter} onClick={this.appendString.bind(this, char)}>{char}</button>
}

// adds calculator to DOM
ReactDOM.render(<Calculator />, document.getElementById('container'));
