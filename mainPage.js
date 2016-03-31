//this file is responsible for graphical calculator creation and interaction
import React from 'react';
import ReactDOM from 'react-dom';
import Evaluator from './evaluator.js'

var Calculator = React.createClass({

// initial expression is empty
  getInitialState: function(){
    return {
      calcExpression: "",
      error: false
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
    event.preventDefault();
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
