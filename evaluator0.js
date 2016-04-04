//The functions in this file are used to evaluate strings containing
//mathematical expressions

const OP_ORDER = ['√', '^', '/', '*', '%', '-', '+']

function evaluate(str) {
  //str = cleanString(str);
  console.log("got here");
  return evaluateTree(str);
}

//given a basic mathematical expression containing no brackets, split into array
function createOpArrayTree(str) {

  var opArrayTree = [str];
  opArrayTree = opArrayTree.map(function(substr) {
    return substr.split('+').map(function(subplus) {
      return subplus.split('-').map(function(subminus) {
        return subminus.split('%').map(function(subcent) {
          return subcent.split('*').map(function(submult) {
            return submult.split('/').map(function(subdiv) {
              return subdiv.split('^').map(function(subexp) {
                return subexp.split('√')
              })
            })
          })
        })
      })
    });
  });
  return opArrayTree;
}

function solveOpArrayTree(opArrayTree) {

  var solution = opArrayTree.map(function(substr) {

    var addArray = substr.map(function(subplus) {
      var subArray = subplus.map(function(subminus) {
        var centArray = subminus.map(function(subcent) {
          var multArray =  subcent.map(function(submult) {
            var divArray =  submult.map(function(subdiv) {
              var expArray = subdiv.map(function(subexp) {
                if (subexp.length === 1) {
                  if (subexp[0] !== '') {
                    var n = parseFloat(subexp[0]);
                    if (!isNaN(n)) {
                      return n;
                    }
                    else {
                      throw new Error("malformed expression");
                    }
                  }
                  else {
                    return null;
                  }
                }
                else if (subexp.length === 2) {
                  var n = parseFloat(subexp[1]);
                  if (!isNaN(n)) {
                    return Math.sqrt(n);
                  }
                  else {
                    throw new Error("malformed expression");
                  }
                } else {
                  throw new Error("malformed expression");
                }
              })
              //reverse the array to allow for logical exponents on exponents
              var reverseExpArray = expArray.reverse();
              return reverseExpArray.reduce(function(acc, n){
                acc = Math.pow(n, acc);
                return acc;
              });
            })
            return divArray.reduce(function(acc, n){
              acc = acc/n;
              return acc;
            });
          })
          return multArray.reduce(function(acc, n){
            acc = acc * n;
            return acc;
          }, 1);
        })
        if (centArray.length === 1) {
          return centArray[0];
        }
        else if (centArray.length === 2) {
          if (centArray[1] === null) {
            return centArray[0]*0.01;
          }
          else {
            throw new Error("malformed expression");
          }
        }
        else {
          throw new Error("malformed expression");
        }
      })
      if (subArray[0] === null) {
        subArray[0] = 0;
      }
      return subArray.reduce(function(acc, n) {
        acc = acc - n;
        return acc;
      });
    });
    return addArray.reduce(function(acc, n) {
      acc += n;
      return acc;
    }, 0);
  });
  return solution[0];
};

function evaluateTree(str) {
  var opArrayTree = createOpArrayTree(str);
  return solveOpArrayTree(opArrayTree);
}

//console.log(evaluateTree("100/-10+10*2"));
console.log(JSON.stringify(createOpArrayTree("5.5+4.93")));
console.log(evaluateTree("5.5+4.93"));

function evaluateHelper(str) {
  if (str.indexOf('(') === -1) {
    return evaluateWithinBrackets(str);
  }

  else {
    var splitStrings = isolateBrackets(str);
    return evaluateHelper(splitStrings.startString
      + evaluateWithinBrackets(splitStrings.bracketString)
      + splitStrings.endString);
    }
  }

  //cleans up +/- combinations and validates expression
  function cleanString(str) {
    var leftBracketCount = (str.match(/\(/g) || []).length;
    var rightBracketCount = (str.match(/\)/g) || []).length;
    if (leftBracketCount !== rightBracketCount) {
      throw new Error("malformed expression");
    }
    var validString = /^[0-9|sqrt|^|/|*|%|-|+|(|)]+$/.test(str);
    if (!validString) {
      throw new Error("malformed expression");
    }
    return condenseAddSubtract(str);
  }

  //determines the value of an expression in a string containing no brackets
  function evaluateWithinBrackets(str) {

    //in bedmas order, attempts to find operations within the string, and when it
    //does it calculates the result of the operation using the numbers to the left
    //and right of it, merges the result with the rest of the string, and attempts
    //to evaluate remaining operators
    var opIndex;
    opIndex = str.indexOf('√');
    if (opIndex >= 0) {
      var newExpression = sqrt(str.substring(0, opIndex), str.substring(opIndex + 1));
      return (evaluateWithinBrackets(newExpression));

    } else {
      opIndex = str.indexOf('^');
      if (opIndex >= 0) {
        var newExpression = exp(str.substring(0, opIndex), str.substring(opIndex + 1));
        return (evaluateWithinBrackets(newExpression));

      } else {
        opIndex = str.indexOf('/');
        if (opIndex >= 0) {
          var newExpression = divide(str.substring(0, opIndex), str.substring(opIndex + 1));
          return (evaluateWithinBrackets(newExpression));

        } else {
          opIndex = str.indexOf('*');
          if (opIndex >= 0) {
            var newExpression = multiply(str.substring(0, opIndex), str.substring(opIndex + 1));
            return (evaluateWithinBrackets(newExpression));

          } else {
            opIndex = str.indexOf('%');
            if (opIndex >= 0) {
              var newExpression = percent(str.substring(0, opIndex), str.substring(opIndex + 1));
              return (evaluateWithinBrackets(newExpression));

            } else {
              //a negative number at index 0 does not require an operation
              opIndex = str.substring(1).indexOf('-') + 1;
              if (opIndex >= 1) {
                var newExpression = subtract(str.substring(0, opIndex), str.substring(opIndex + 1));
                return (evaluateWithinBrackets(newExpression));

              } else {
                opIndex = str.indexOf('+');
                if (opIndex >= 0) {
                  var newExpression = add(str.substring(0, opIndex), str.substring(opIndex + 1));
                  return (evaluateWithinBrackets(newExpression));

                } else {
                  return str;
                }
              }
            }
          }
        }
      }
    }
  }

  //isolates a pair of brackets with no inner brackets, and returns an object
  //with a startString, bracketString, and endString
  function isolateBrackets(str) {
    var result = str.match(/\([^()]+\)/);
    if (!result) {
      throw new Error("malformed expression");
    }
    //append a multiplier if the startString ends in a number
    var startString = str.substring(0, result.index);
    var endnum = endNumber(startString);
    if(endnum.value !== undefined) {
      startString += '*';
    }

    return {
      startString: startString,
      bracketString: result[0].substring(1, result[0].length - 1),
      endString: str.substring(result.index + result[0].length)
    };
  }

  //eliminate +- ++ -+ and -- from a string
  function condenseAddSubtract(str) {
    var result = str.replace("+-", "-");
    result = result.replace("-+", "-");
    result = result.replace("++", "+");
    result = result.replace("--", "+");
    if (result !== str) {
      result = condenseAddSubtract(result);
    }
    return result;
  }

  //gets the square root of the number at the beginning of string two and merges
  //the result returning a new expression string
  function sqrt(str1, str2) {
    var end = endNumber(str1);
    var start = startNumber(str2);

    if(!start.value) {
      throw new Error("malformed expression");
    }
    //if first string ends with a number, we must append a multiplication character
    if(end.value) {
      str1 += '*';
    }

    var root = Math.sqrt(start.value);
    if (isNaN(root)) {
      throw new Error("malformed expression");
    }
    return str1 + root.toString() + start.remainder;
  }
  //multiplies the number at the end of string one to the power of the number at
  //the start of string two and merges the result returning a new expression string
  function exp(str1, str2) {
    var end = endNumber(str1);
    var start = startNumber(str2);

    var exp = Math.pow(end.value, start.value);
    if (isNaN(exp)) {
      throw new Error("malformed expression");
    }
    return end.remainder + exp.toString() + start.remainder;
  }
  //divides the number at the end of string one by the number at the start of
  //string two and merges the result returning a new expression string
  function divide(str1, str2) {
    var end = endNumber(str1);
    var start = startNumber(str2);
    //if missing a value or divisor is 0 evaluation is impossible
    if(start.value === undefined || end.value === undefined) {
      throw new Error("malformed expression");
    }

    if (start.value === 0) {
      throw new Error("can't divide by zero");
    }

    var quotient = end.value / start.value;
    return end.remainder + quotient.toString() + start.remainder;
  }
  //multiplies the number at the end of string one with the number at the start of
  //string two and merges the result returning a new expression string
  function multiply(str1, str2) {
    var end = endNumber(str1);
    var start = startNumber(str2);
    //if missing a value evaluation is impossible
    if(start.value === undefined || end.value === undefined) {
      throw new Error("malformed expression");
    }

    var product = end.value * start.value;
    return end.remainder + product.toString() + start.remainder;
  }

  //multiplies the number at the end of string one, and merges the result
  //returning a new expression string
  function percent(str1 ,str2) {
    var end = endNumber(str1);

    //if there is no number in front of %, this is an invalid expression
    if (!end.value) {
      throw new Error("malformed expression");
    }
    else {
      var percent = end.value * 0.01;
      return end.remainder + percent.toString() + str2;
    }
  }

  //adds the number at the end of string one to the number at the start of string
  //two and merges the result returning a new expression string
  function add(str1, str2) {
    var end = endNumber(str1);
    var start = startNumber(str2);
    //if missing a value, setting to 0 ensures that addition will not be affected
    if(!start.value) {
      start.value = 0;
    }
    if(!end.value) {
      end.value = 0;
    }
    var sum = end.value + start.value;
    return end.remainder + sum.toString() + start.remainder;
  }

  //subtracts the number at the start of string two from the number at the end of
  //string one and merges the result returning a new expression string
  function subtract(str1, str2) {
    var end = endNumber(str1);
    var start = startNumber(str2);
    //if missing a value, setting to 0 ensures that the subtraction will not be
    //affected
    if(!start.value) {
      start.value = 0;
    }
    if(!end.value) {
      end.value = 0;
    }
    var diff = end.value - start.value;
    return end.remainder + diff.toString() + start.remainder;
  }

  //returns the number at the end of a string if one exists and the remaining string
  function endNumber(str) {
    var result = str.match(/-?\d+(\.\d*)?$/);
    if (result) {
      var nString = result[0];
      return {
        value: parseFloat(nString),
        remainder: str.substring(0, str.length - nString.length)
      };
    }
    else  {
      return {
        remainder: str
      }
    }
  }

  //returns the number at the start of a string if one exists and the remaining string
  function startNumber(str) {
    var result = str.match(/^-?\d+(\.\d*)?/);
    if (result) {
      var nString = result[0];
      var remainder = str.substring(nString.length);
      return {
        value: parseFloat(nString),
        remainder: remainder
      };
    }
    else return {
      remainder: str
    }
  }

  module.exports={
    evaluate: evaluate
  }
