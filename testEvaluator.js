var tests = require('./tests.json');
var Evaluator = require('./evaluator0.js');

//evaluate addTests
tests.addTests.forEach(runTest);
//evaluate subtractTests
tests.subtractTests.forEach(runTest);
//evaluate percentTests
tests.percentTests.forEach(runTest);
//evaluate multTests
tests.multTests.forEach(runTest);
//evaluate divTests
tests.divTests.forEach(runTest);
//evaluate expTests
tests.expTests.forEach(runTest);
//evaluate rootTests
tests.rootTests.forEach(runTest);
//evaluate bracketTests
tests.bracketTests.forEach(runTest);

function runTest(test) {
  var newExp;
  try {
    newExp = Evaluator.evaluate(test.expression);
  } catch (e) {
    newExp = "invalid"
  }
  var result = (newExp === test.result);
  if (result) {
    console.log(test.expression + " was successful.");
  } else {
    console.log(test.expression + " failed. " + newExp);
  }
}
