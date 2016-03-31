//The functions in this file are used to evaluate strings containing
//mathematical expressions

function evaluate(str) {
  str = cleanString(str);
  return evaluateHelper(str);
}

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
