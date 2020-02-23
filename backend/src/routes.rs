pub mod api {
  use diesel::{self, prelude::*};
  use rocket_contrib::json::Json;

  use crate::models::{InsertableNote, Note};
  use crate::schema;
  use crate::DbConn;

  #[get("/api/v1/notes")]
  pub fn notes_index(conn: DbConn) -> Result<Json<Vec<Note>>, String> {
    use crate::schema::notes::dsl::*;

    notes.load(&conn.0).map_err(|err| -> String {
      println!("Error querying page views: {:?}", err);
      "Error querying page views from the database".into()
    }).map(Json)
  }


  #[post("/api/v1/notes", data = "<note>")]
  pub fn notes_create(
    conn: DbConn,
    note: Json<InsertableNote>,
  ) ->  Result<Json<Vec<Note>>, String> {
    use crate::schema::notes::dsl::*;

    diesel::insert_into(schema::notes::table)
      .values(&note.0)
      .execute(&conn.0)
      .map_err(|err| -> String {
        println!("Error inserting row: {:?}", err);
        "Error inserting row into database".into()
      })?;

    notes.load(&conn.0).map_err(|err| -> String {
      println!("Error querying page views: {:?}", err);
      "Error querying page views from the database".into()
    }).map(Json)
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
