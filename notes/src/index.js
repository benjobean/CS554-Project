// noteService.js

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

async function createNote(content) {
  const newNote = new Note({
    content,
  });

  try {
    const savedNote = await newNote.save();
    return savedNote;
  } catch (error) {
    throw new Error('Failed to create a note.');
  }
}

async function getAllNotes() {
  try {
    const notes = await Note.find({});
    return notes;
  } catch (error) {
    throw new Error('Failed to retrieve notes.');
  }
}

async function updateNote(id, content) {
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, { content }, { new: true });

    if (!updatedNote) {
      throw new Error('Note not found.');
    }

    return updatedNote;
  } catch (error) {
    throw new Error('Failed to update note.');
  }
}

async function deleteNote(id) {
  try {
    const deletedNote = await Note.findByIdAndRemove(id);

    if (!deletedNote) {
      throw new Error('Note not found.');
    }

    return deletedNote;
  } catch (error) {
    throw new Error('Failed to delete note.');
  }
}

export { createNote, getAllNotes, updateNote, deleteNote };
