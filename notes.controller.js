const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await saveNotes(notes);
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function removeNote(id) {
  const notes = await getNotes();
  const updatedNotes = notes.filter((note) => note.id !== id);
  await saveNotes(updatedNotes);
  console.log(chalk.red(`Note with id="${id}" has been removed.`));
}

async function editNote(id, title) {
  const notes = await getNotes();
  const index = notes.findIndex((note) => note.id === id);
  if (index >= 0) {
    notes[index] = { ...notes[index], id, title };
    await saveNotes(notes);
    console.log(
      chalk.green(
        `Note with id="${id}" and new title="${title}" has been updated!`
      )
    );
  }
}

async function printNotes() {
  const notes = await getNotes();

  console.log(chalk.bgBlue("List of notes"));
  notes.forEach((note) => console.log(chalk.blue(note.title)));
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  editNote,
};
