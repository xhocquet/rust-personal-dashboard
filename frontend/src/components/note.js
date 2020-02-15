import { h } from 'preact'

export default function Note(props) {
  return (

    <div class="column col-3">
      <div class="card navshadow">
        <div class="card-header">
          <h4>{props.note.title}</h4>
        </div>
        <div class="card-body">
          <p>{props.note.body}</p>
        </div>
      </div>
    </div>
   )
}
