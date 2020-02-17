import { h, Fragment, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { setupTree } from './tree';

import './notes_tree.css';

const URL = 'http://localhost:8000/api/v1/notes'

export default class NotesTree extends Component {
  constructor(props) {
    super(props);
    this.state = { notes: [] };
  }

  componentDidMount() {
    fetch(`${URL}`)
      .then(res => res.json())
      .then(res => {
        this.setState({notes: res})
        setupTree(res)
      })
  }

  render() {
    return(
      <Fragment>
        <h1 class="text-center" style="margin: 3% auto;">Notes</h1>
      </Fragment>
     )
  }
}
