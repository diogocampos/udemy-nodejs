const fs = require('fs')

const NOTES_FILE = 'notes-data.json'

exports.add = ({ title, body }) => {
  const notes = readJSON(NOTES_FILE, [])
  const existingNote = notes.find(note => note.title === title)
  let message

  if (existingNote) {
    existingNote.body += '\n' + body
    message = `Appended to existing note "${title}"`
  } else {
    notes.unshift({ title, body })
    message = `Added new note "${title}"`
  }

  writeJSON(NOTES_FILE, notes)
  console.log(message)
}

exports.list = () => {
  const notes = readJSON(NOTES_FILE, [])
  console.log(count(notes.length, 'note'))
  for (const { title, body } of notes) {
    console.log(`-- ${title}\n${body}`)
  }
}

exports.read = ({ title }) => {
  const notes = readJSON(NOTES_FILE, [])
  const note = notes.find(note => note.title === title)
  if (note) {
    console.log(note.body)
  } else {
    throw new NoteNotFound(title)
  }
}

exports.remove = ({ title }) => {
  const notes = readJSON(NOTES_FILE, [])
  const index = notes.findIndex(note => note.title === title)
  if (index >= 0) {
    notes.splice(index, 1)
    writeJSON(NOTES_FILE, notes)
    console.log(`Note "${title}" removed`)
  } else {
    throw new NoteNotFound(title)
  }
}

//

function count(number, singular, plural) {
  if (!plural) plural = singular + 's'
  return `${number} ${number == 1 ? singular : plural}`
}

function readJSON(file, defaultValue) {
  if (!fs.existsSync(file)) writeJSON(file, defaultValue)
  return JSON.parse(fs.readFileSync(file))
}

function writeJSON(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2))
}

class NoteNotFound extends Error {
  constructor(title) {
    super(`Note "${title}" not found`)
  }
}
