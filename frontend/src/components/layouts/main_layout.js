import { Fragment, h } from 'preact'

import './main_layout.css'

export default function MainLayout(props) {
  return (
    <Fragment>
      <header className="navbar navshadow">
        <section className="navbar-primary">
          <a className="navbar-brand">Personal Dash</a>
        </section>
      </header>
      {props.children}
      <footer className="footer">cc2020 Xavier Hocquet</footer>
    </Fragment>
  )
}
