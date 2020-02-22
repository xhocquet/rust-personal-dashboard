import { h, Fragment, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Tree from './tree';

import './index.css';

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
        let tree = new Tree('svg-container', res).setupTree()
        this.setState({notes: res, timestamp: Date.now(), tree: tree})
      })
  }

  render() {
    return <div id="svg-container" />
  }
}
