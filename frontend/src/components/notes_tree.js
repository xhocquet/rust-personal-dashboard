import { h, Fragment, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { setupTree } from './tree';

import './notes_tree.css';

const URL = 'http://localhost:8000/api/v1/notes'

export default class NotesTree extends Component {
  constructor(props) {
    super(props);
    this.state = { notes: [], timestamp: undefined };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { timestamp: nextTimestamp } = nextState
    const { timestamp: currentTimestamp } = this.state
    return nextTimestamp === currentTimestamp
  }

  componentDidMount() {
    fetch(`${URL}`)
      .then(res => res.json())
      .then(res => {
        this.setState({notes: res, timestamp: Date.now()})
        setupTree(res)
      })
  }

  render() {
    return <div id="svg-container" />
  }
}
