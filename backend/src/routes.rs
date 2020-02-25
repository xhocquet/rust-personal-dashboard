pub mod api {
  use rocket_contrib::json::Json;
  use crate::db;
  use crate::models::{InsertableNote, Note};

  // index
  #[get("/api/v1/notes")]
  pub fn notes_index(conn: db::Connection) -> Result<Json<Vec<Note>>, String> {
    Note::read(&conn)
  }

  // create
  #[post("/api/v1/notes", data = "<note>")]
  pub fn notes_create(
    conn: db::Connection,
    note: Json<InsertableNote>,
  ) ->  Result<Json<Vec<Note>>, String> {
    let insert = InsertableNote { ..note.into_inner() };
    Note::create(insert, &conn)
  }

  // update
  #[put("/api/v1/notes/<id>", data = "<note>")]
  pub fn notes_update(
    id: i32,
    note: Json<InsertableNote>,
    conn: db::Connection,
  ) -> Result<Json<Vec<Note>>, String> {
    let update = InsertableNote { ..note.into_inner() };
    Note::update(id, update, &conn)
  }

  // delete
  #[delete("/api/v1/notes/<id>")]
  pub fn notes_delete(id: i32, conn: db::Connection) -> Result<Json<Vec<Note>>, String> {
    Note::delete(id, &conn)
  }
}

use std::io;
use rocket::response::{NamedFile};

#[get("/")]
pub fn index() -> io::Result<NamedFile> {
    NamedFile::open("static/index.html")
}

#[get("/favicon.ico")]
pub fn favicon() -> io::Result<NamedFile> {
    NamedFile::open("static/favicon.ico")
}
