var hexContrastCheck = require('wcag-contrast').hex
var convertCssColorNameToHex = require('convert-css-color-name-to-hex')


var DEFAULT_INPUT = {
  pageBackground: "#FFFFFF",
  objectBackground: "#5A9BCC",
  textColour: "#000000"
}

// https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/contrast-ratio.js
var textLevels = {
  "Fail": {
    range: [0, 3],
    color: "hsl(0, 100%, 40%)"
  },
  "AA Large": {
    range: [3, 4.5],
    color: "hsl(22, 84%, 37%)"
  },
  "AA": {
    range: [4.5, 7],
    color: "hsl(142, 100%, 26%)"
  },
  "AAA": {
    range: [7, 22],
    color: "hsl(142, 52%, 24%)"
  }
};

// https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast
var nonTextLevels = {
  "Fail": {
    range: [0, 3],
    color: "hsl(0, 100%, 40%)"
  },
  "AA": {
    range: [3, 22],
    color: "hsl(142, 100%, 26%)"
  }
}

function roundNumber (number) {
  // Truncate the number without rounding up
  number = Math.floor(number * 100) / 100
  // If it's a whole number round up.
  if (number % 1 === 0) {
    return number.toFixed(0)
  }
  return number
}

function rangeIntersect(min, max, value) {
  return value <= max && value >= min
}

function getLevelStatus (contrastRatio, levels) {
  let status
  for (var level in levels) {
    var bounds = levels[level].range
    var lower = bounds[0]
    var upper = bounds[1]

    if (rangeIntersect(lower, upper, contrastRatio)) {
      status = {
        title: level,
        ...levels[level]
      }
    }
  }
  return status
}

function contrast (input) {
  // Merge defaults into user input
  input = Object.assign({}, DEFAULT_INPUT, input)
  
  let textContrastWithObjectContrastRatio = hexContrastCheck(
    convertCssColorNameToHex(input.textColour),
    convertCssColorNameToHex(input.objectBackground)
  )

  let textContrastWithObject = {
    contrastRatio: roundNumber(textContrastWithObjectContrastRatio),
    status: getLevelStatus(textContrastWithObjectContrastRatio, textLevels)
  }
  
  let objectContrastWithPageContrastRatio = hexContrastCheck(
    convertCssColorNameToHex(input.objectBackground),
    convertCssColorNameToHex(input.pageBackground)
  )

  let objectContrastWithPage = {
    contrastRatio: roundNumber(objectContrastWithPageContrastRatio),
    status: getLevelStatus(objectContrastWithPageContrastRatio, nonTextLevels)
  }
  
  return {
    input,
    textContrastWithObject,
    objectContrastWithPage
  }  
}

module.exports = contrast