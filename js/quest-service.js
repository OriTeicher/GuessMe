'use strict'

const QUESTS_KEY = 'quests'
var gQuestsTree
var gCurrQuest
var gPrevQuest = null

function createQuestsTree() {
  gQuestsTree = loadFromStorage(QUESTS_KEY) // Load the quests from storage if you have
  if (!gQuestsTree) {
    gQuestsTree = createQuest('Male?')
    gQuestsTree.yes = createQuest('Gandhi')
    gQuestsTree.no = createQuest('Rita')
    _saveQuestsToStorage()
  }
  gPrevQuest = null
  gCurrQuest = gQuestsTree //Set the gCurrQuest to the all tree
}

function createQuest(txt) {
  return {
    txt: txt,
    yes: null,
    no: null,
  }
}

function isChildless(node) {
  //Check on the node/currQuest if there are no more quest, if it`s the end of the tree
  return node.yes === null && node.no === null
}

function moveToNextQuest(res) {
  // update the gPrevQuest, gCurrQuest global vars
  gPrevQuest = gCurrQuest // Save the last quest
  gCurrQuest = gCurrQuest[res] // Move to next quest
}

function addGuess(newQuestTxt, newGuessTxt, lastRes) {
  // Create and Connect the 2 Quests to the quetsions tree
  //Opt1 Shorter
  // gPrevQuest[lastRes] = createQuest(newQuestTxt);
  // gPrevQuest[lastRes].yes = createQuest(newGuessTxt);
  // gPrevQuest[lastRes].no = gCurrQuest;
  //Opt2 Can be more readable

  const newQuest = createQuest(newQuestTxt) // Create the new quest
  newQuest.yes = createQuest(newGuessTxt) // Put on yes the answer, its a quest with the guess text and null in yes/no
  newQuest.no = gCurrQuest // Put the last quest in the no of the new quest exmp: queen? yes: Cleo  no: Rita

  gPrevQuest[lastRes] = newQuest // Connect the new quests to the tree
  _saveQuestsToStorage() // Save to storage only when we change the tree
}

function getCurrQuest() {
  return gCurrQuest
}

function _saveQuestsToStorage() {
  saveToStorage(QUESTS_KEY, gQuestsTree)
}
