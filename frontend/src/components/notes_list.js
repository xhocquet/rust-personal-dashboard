import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import Note from './note'

export default function NotesList() {
  const URL = 'http://localhost:8000/api/v1/notes'
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch(`${URL}`)
      .then(res => res.json())
      .then(res => setNotes(res || []))
  })

  return(
    <Fragment>
      <h1 class="text-center" style="margin: 3% auto;">Notes</h1>
      <div class="columns">
        {notes.map(note => (
           <Note note={note} />
         ))}
      </div>
    </Fragment>
   )
}
