//The functions in this file are used to evaluate strings containing
//mathematical expressions

const OP_ORDER = ['√', '^', '/', '*', '%', '-', '+']

function evaluate(str) {
  //str = cleanString(str);
  str = condenseAddSubtract(str);
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

console.log(evaluateTree('10%'))

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

  module.exports={
    evaluate: evaluate
  }
