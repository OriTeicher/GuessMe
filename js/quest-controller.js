'use strict'

// NOTE: This is a global used only in the controller
var gLastRes = null

$(document).ready(function () {
  init()
  addEventListeners()
})
// $(document).ready(
//   init()

// )
// $(init); // shortcut onload
// addEventListeners();

function init() {
  createQuestsTree() // Create quests
}

function addEventListeners() {
  $('.btn-start').click(onStartGuessing)
  $('.btn-yes').click({ ans: 'yes' }, onUserResponse) // Put on the ev data the obj {ans: 'yes'}
  $('.btn-no').click({ ans: 'no' }, onUserResponse)
  // $('.btn-yes').click('yes', onUserResponse) // Put on the ev data the obj {ans: 'yes'}
  // $('.btn-no').click('no', onUserResponse)
  $('.btn-add-guess').click(onAddGuess)
  $('.btn-close').click(closeModal)
}

function onStartGuessing() {
  // hide the game-start section
  $('.game-start').hide()
  renderQuest()
  // show the quest section
  $('.quest').show('slow')
}

function renderQuest() {
  // select the <h2> inside quest and update
  // its text by the currQuest text
  var currQuest = getCurrQuest()
  $('.quest h2').text(currQuest.txt)
}

function onUserResponse(ev) {
  // function onUserResponse(ans) { option 2
  // in case we dont insert the and obj into the ev we get a string with the ans
  console.log(ev)
  // console.log(this)
  console.log($(this))
  var res = ev.data.ans
  // var res = ans // option 2
  // If this node has no children
  if (isChildless(getCurrQuest())) {
    if (res === 'yes') {
      // improve UX , added modal and animation
      onGameOver(true)
      onRestartGame()
    } else {
      onGameOver(false)
      $('.quest').hide('slow') // hide the quest div
      $('.new-quest').show('slow') //show the form section
    }
  } else {
    // update the lastRes global var
    gLastRes = res
    moveToNextQuest(res)
    renderQuest()
  }
}

function onAddGuess(ev) {
  ev.preventDefault()
  //  Get the inputs' values
  var newGuess = $('#newGuess').val()
  var newQuest = $('#newQuest').val()
  // Call the service addGuess
  addGuess(newQuest, newGuess, gLastRes)
  //empty the fields opt1
  // $('#newGuess').val('')
  // $('#newQuest').val('')
  //empty all the form fields opt2
  const $elForm = $('.ending-form')
  // console.log('$elForm', $elForm)
  $elForm[0].reset()
  onRestartGame()
}

function onRestartGame() {
  $('.new-quest').hide()
  $('.quest').hide()
  $('.game-start').show()
  gLastRes = null
  setTimeout(closeModal, 800)
  init()
}

function onGameOver(isWin) {
  const $elJinnImg = $('.jinn')
  const $elModal = $('.modal')
  $elModal.show()
  if (isWin) {
    $elModal.find('.modal-body').text('Yes, I knew it!').css('color', 'green')
    animateRotate(360, $elJinnImg) //Some animation :)
  } else {
    $elModal.find('.modal-body').text('No Clue, Teach me!').css('color', 'red')
    setTimeout(closeModal, 800)
    $elJinnImg.fadeOut('slow').fadeIn('slow').fadeOut('slow').fadeIn('fast')
  }
}

function closeModal() {
  $('.modal').hide()
}

//* The function below can be found on stackoverflow.
// Search 'jquery rotate animation' its the first result on google */
//https://stackoverflow.com/questions/15191058/css-rotation-cross-browser-with-jquery-animate

// Nice function for rotate animation
function animateRotate(angle, $el) {
  // we use a pseudo object for the animation
  // (starts from `0` to `angle`), you can name it as you want
  $({ deg: 0 }).animate(
    { deg: angle },
    {
      duration: 2000,
      step: now => {
        // in the step-callback (that is fired each step of the animation),
        // you can use the `now` paramter which contains the current
        // animation-position (`0` up to `angle`)
        $el.css({
          transform: 'rotate(' + now + 'deg)',
        })
      },
    }
  )
}
