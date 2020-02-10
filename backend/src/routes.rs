use diesel::{self, prelude::*};

use rocket_contrib::json::Json;

use crate::models::{InsertableNote, Note};
use crate::schema;
use crate::DbConn;

#[get("/")]
pub fn index(conn: DbConn) -> Result<Json<Vec<Note>>, String> {
  use crate::schema::notes::dsl::*;

  notes.load(&conn.0).map_err(|err| -> String {
    println!("Error querying page views: {:?}", err);
    "Error querying page views from the database".into()
  }).map(Json)
}


#[post("/note", data = "<note>")]
pub fn create_note(
  conn: DbConn,
  note: Json<InsertableNote>,
) ->  Result<String, String> {
  let inserted_rows = diesel::insert_into(schema::notes::table)
    .values(&note.0)
    .execute(&conn.0)
    .map_err(|err| -> String {
      println!("Error inserting row: {:?}", err);
      "Error inserting row into database".into()
    })?;

  Ok(format!("Inserted {} row(s).", inserted_rows))
}
