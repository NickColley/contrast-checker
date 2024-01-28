import contrast from './contrast.js';
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';

const COLOUR_INPUT_SUFFIX = '-colour'

function debounce(func) {
  return function () {
    window.requestAnimationFrame(func)
  }
}

const $form = document.querySelector('form')

// If any inputs change, trigger a submit.
Array.from($form.elements).forEach($input => {
  // Hide submit button since we're handling this with AJAX.
  if ($input.type === 'submit') {
    return $input.setAttribute('hidden', true)
  }
  if ($input.type === 'reset') {
    $input.addEventListener('click', event => {
      event.preventDefault()
      resetColourInputs()
    })
    return
  }
  
  appendColourInput($input)
  $input.addEventListener('change', debounce(submitForm))
  $input.addEventListener('input', debounce(submitForm))
})

// Client side simulation of a GET request.
$form.addEventListener('submit', async (event) => {
  event.preventDefault()
  submitForm()
});

async function submitForm () {
  const formData = new FormData($form)

  const queryString =
      Array.from(formData.entries())
            .map((entry) => `${encodeURIComponent(entry[0])}=${encodeURIComponent(entry[1])}`)
            .join('&')


  const updatedUrl = '?' + queryString
  window.history.replaceState('', '', updatedUrl)
  
  // Turn entries into an object
  let data = {}
  for(var entry of formData.entries()) {
     data[entry[0]] = entry[1]
  }
  const json = contrast(data)
  
  renderView(json)
}

function renderView (data) {
  const rootStyle = document.documentElement.style
  rootStyle.setProperty('--app-input-page-background', data.input.pageBackground)
  rootStyle.setProperty('--app-input-object-background', data.input.objectBackground)
  rootStyle.setProperty('--app-input-text-color', data.input.textColour)
  rootStyle.setProperty('--app-object-contrast-with-page-color', data.objectContrastWithPage.status.color)
  rootStyle.setProperty('--app-text-contrast-with-object-color', data.textContrastWithObject.status.color)
  
  document.querySelector('[data-app-text-contrast-with-object-contrast-ratio]').textContent = data.textContrastWithObject.contrastRatio
  document.querySelector('[data-app-object-contrast-with-page-contrast-ratio]').textContent = data.objectContrastWithPage.contrastRatio
  
  document.querySelector('[data-app-text-contrast-with-object-status-title]').textContent = data.textContrastWithObject.status.title 
  document.querySelector('[data-app-object-contrast-with-page-status-title]').textContent = data.objectContrastWithPage.status.title 
}

function resetColourInputs () {
  Array.from(document.querySelectorAll('.js-app-input-color')).forEach($input => {
    let originalId = $input.id.replace(COLOUR_INPUT_SUFFIX, '')
    let $originalInput = document.getElementById(originalId)
    let originalValue = $originalInput.getAttribute('value')
    $input.value = $originalInput.value = originalValue
  })
  var event = new Event('submit')
  $form.dispatchEvent(event)
}

function appendColourInput ($input) {
  let $colourInput = document.createElement('input')
  $colourInput.className = 'js-app-input-color ' + $input.className + ' app-input-color'
  $colourInput.value = $input.value
  $colourInput.type = 'color'
  $colourInput.id = $input.id + COLOUR_INPUT_SUFFIX
  $colourInput.setAttribute('aria-label', `${$input.labels[0].textContent.trim()} Colour`)
  // Feature detection
  if ($colourInput.type === "color" && typeof $colourInput.selectionStart !== "number") {
    $colourInput.addEventListener('input', event => {
      $input.value = $colourInput.value
      var event = new Event('input')
      $input.dispatchEvent(event)
    })
    $input.addEventListener('input', event => {
      $colourInput.value = convertCssColorNameToHex($input.value)
    })
    $input.parentNode.appendChild($colourInput)
  }
  
}