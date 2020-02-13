import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'normalize.css/normalize.css'
import 'milligram/dist/milligram.min.css'

import { h, app } from "hyperapp"

app({
  init: {
    notes: [],
  },
  view: ({ notes, counter }) =>
    h("main", {}, [
      h("h1", {}, 'Personal Dashboard'),
    ]),
  node: document.body
})
