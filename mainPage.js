//this file is responsible for graphical calculator creation and interaction
import React from 'react';
import ReactDOM from 'react-dom';

var Calculator = React.createClass({

// initial expression is empty
  getInitialState: function(){
    return {
      calcExpression: ""
    };
  },

//on textbox change events, update the stored expression in state
  handleChange: function(event) {
    this.setState({calcExpression: event.target.value});
  },

//appends a string to calcExpression
  appendString(str) {
    this.setState({calcExpression: this.state.calcExpression + str});
  },

//deletes the last character in calcExpression
  deleteChar() {
    var calcExp = this.state.calcExpression;
    var newStr = calcExp.substring(0, calcExp.length -1);
    this.setState({calcExpression: newStr});
  },

//sets calcExpression to empty string
  clearString() {
    this.setState({calcExpression: ""});
  },

//evaluates calcExpression and replaces it with the calculated value
  evaluate(event) {
    event.preventDefault();
    console.log("evaluated");
  },

  render: function() {
    return(
      <div>
        <form onSubmit={this.evaluate}>
          <input type="text"
            value={this.state.calcExpression}
            onChange={this.handleChange}/>
        </form>
        <div className="buttonColumn">
          <div className="buttonRow">
            {makeButton.call(this, "7")}
            {makeButton.call(this, "8")}
            {makeButton.call(this, "9")}
            {makeButton.call(this, "/")}
            <button onClick={this.deleteChar}>del</button>
            <button onClick={this.clearString}>clear</button>
          </div>
          <div className="buttonRow">
            {makeButton.call(this, "4")}
            {makeButton.call(this, "5")}
            {makeButton.call(this, "6")}
            {makeButton.call(this, "x")}
            {makeButton.call(this, "(")}
            {makeButton.call(this, ")")}
          </div>
          <div className="buttonRow">
            {makeButton.call(this, "1")}
            {makeButton.call(this, "2")}
            {makeButton.call(this, "3")}
            {makeButton.call(this, "-")}
            <button onClick={this.appendString.bind(this, "^")}>x<sup>y</sup></button>
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
  return <button onClick={this.appendString.bind(this, char)}>{char}</button>
}

// adds calculator to DOM
ReactDOM.render(<Calculator />, document.getElementById('container'));
