var callsite = require('callsite')
  , fs = require('fs')
  , path = require('path')
  , AssertionError = require('assert').AssertionError
  , sms = require('source-map-support');

/**
 * Enable the module only if not in the `production` environment.
 */

module.exports = (process.env.NODE_ENV === 'production')
    ? function() {}
    : assert

/**
 * Asserts that `expression` is true.
 */

function assert(expression)
{
    if (expression) return

    var stack = callsite().map(sms.wrapCallSite)
      , file = stack[1].getFileName()
      , line = stack[1].getLineNumber()
    var err = new AssertionError({
        message: getAssertionExpression(file, line),
        stackStartFunction: stack[0].getFunction()
    })

    throw err
}

/**
 * Gets the expression inside the assertion on line number
 * `lineno` of `file`.
 */

function getAssertionExpression(file, lineno)
{
    var ext = path.extname(file);
    line = readJsLine(file, lineno);
    return line.match(/assert\s*(.*)/)[1]
}

/**
 * Reads `file` and returns line number `lineno`.
 */

function readJsLine(file, lineno)
{
    var src = fs.readFileSync(file, 'utf8')
    return src.split('\n')[lineno - 1]
}
