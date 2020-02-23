import { h, Fragment, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Tree from './tree';

import './index.css';

const URL = 'http://localhost:8000/api/v1/notes';

export default class NotesTree extends Component {
  constructor(props) {
    super(props);
    this.state = { notes: [], timestamp: null, tree: null };
  }

  componentDidMount() {
    let self = this;

    fetch(URL)
      .then(res => res.json())
      .then(res => {
        const tree = new Tree('svg-container', self.createNode.bind(self))
        tree.setupTree(res);
        this.setState({ notes: res, timestamp: Date.now(), tree: tree });
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { timestamp: nextTimestamp } = nextState;
    const { timestamp: currentTimestamp } = this.state;
    return nextTimestamp !== currentTimestamp;
  }

  componentDidUpdate() {
    const { tree, notes } = this.state;
    tree.setupTree(notes);
  }

  createNode(payload) {
    fetch(URL, {
      method: 'post',
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ notes: res, timestamp: Date.now() });
      });
  }

  render() {
    return <div id="svg-container" />;
  }
}
