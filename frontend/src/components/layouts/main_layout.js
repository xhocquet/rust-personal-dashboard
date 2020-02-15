import { Fragment, render, h } from 'preact'

import './main_layout.css'

export default function MainLayout(props) {
  return (
    <Fragment>
      <header class="navbar navshadow">
        <section class="navbar-primary">
          <a class="navbar-brand">Personal Dash</a>
        </section>
      </header>
      <div class="container centered">
        {props.children}
      </div>
      <footer class="footer">cc2020 Xavier Hocquet</footer>
    </Fragment>
  )
}
