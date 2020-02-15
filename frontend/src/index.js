import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'normalize.css/normalize.css'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-exp.min.css'
import 'spectre.css/dist/spectre-icons.min.css'

import { h, render } from 'preact'

import MainLayout from './components/layouts/main_layout'
import NotesList from './components/notes_list'

const Index = (
  <MainLayout>
    <NotesList />
  </MainLayout>
)

render(Index, document.body);
