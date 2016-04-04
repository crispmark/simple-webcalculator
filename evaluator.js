//The functions in this file are used to evaluate strings containing
//mathematical expressions

const OP_ORDER = ['√', '^', '/', '*', '%', '-', '+']

function evaluate(str) {
  str = cleanString(str);
  return evaluateHelper(str);
}

//given a basic mathematical expression containing no brackets, split into array
function createOpArrayTree(str) {

  var opArrayTree = [str];
  opArrayTree = opArrayTree.map(function(substr) {
    return substr.split('+').map(function(subplus) {
      //need to handle - splits where it is not a number on either side
      var minusSplit = subplus.split('-');
      var mergeMinus = [];
      for (var i = 0; i < minusSplit.length; i++) {
        if (/[0-9]$/.test(minusSplit[i]) || minusSplit.length - 1 === i) {
          mergeMinus.push(minusSplit[i]);
        }
        else {
          mergeMinus.push(minusSplit[i] + '-' + minusSplit[i+1]);
          i++;
        }
      }

      return mergeMinus.map(function(subminus) {
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
                    return NaN;
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
          if (isNaN(centArray[1])) {
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
      if (subArray.length >1 && isNaN(subArray[0])) {
        subArray[0] = 0;
      }
      //at this point there should no longer be empty array slots
      subArray.forEach(function(n) {
        if (isNaN(n)) {
          throw new Error("malformed expression");
        }
      })
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
  return solution[0].toString();
};

function evaluateTree(str) {
  var opArrayTree = createOpArrayTree(str);
  return solveOpArrayTree(opArrayTree);
}

function evaluateHelper(str) {
  if (str.indexOf('(') === -1) {
    return evaluateTree(str);
  }

  else {
    var splitStrings = isolateBrackets(str);
    return evaluateHelper(splitStrings.startString
      + evaluateTree(splitStrings.bracketString)
      + splitStrings.endString);
  }
}

//cleans up +/- combinations, adds multiply in front of sqrts that need it, and
//validates expression
function cleanString(str) {
  var leftBracketCount = (str.match(/\(/g) || []).length;
  var rightBracketCount = (str.match(/\)/g) || []).length;
  if (leftBracketCount !== rightBracketCount) {
    throw new Error("malformed expression");
  }
  var validString = /^[0-9|.|√|^|/|*|%|\-|+|(|)]+$/.test(str);
  if (!validString) {
    throw new Error("malformed expression");
  }
  str = replaceRoot(str);
  return condenseAddSubtract(str);
}

//replace all n√n with n*√n
function replaceRoot(str) {
  var rootTest = /[0-9]√/;
  if (!rootTest.test(str)) {
    return str;
  }
  else {
    var root = str.match(rootTest);
    var startString = str.substring(0, root.index + 1);
    var endString = str.substring(root.index + 1);
    return replaceRoot(startString + '*' + endString)
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
