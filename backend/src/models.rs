use diesel::prelude::*;
use rocket_contrib::json::Json;
use crate::schema::notes;
use diesel::PgConnection;

#[derive(Serialize, Deserialize, Queryable, Associations)]
#[belongs_to(Note)]
#[table_name = "notes"]
pub struct Note {
  pub id: i32,
  pub title: String,
  pub body: Option<String>,
  pub finished: bool,
  pub note_id: Option<i32>,
}

#[derive(AsChangeset, Deserialize, Insertable)]
#[table_name = "notes"]
pub struct InsertableNote {
  pub title: String,
  pub body: String,
  pub finished: bool,
  pub note_id: i32,
}

impl Note {
  pub fn create(note: InsertableNote, conn: &PgConnection) -> Result<Json<Vec<Note>>, String> {
    diesel::insert_into(notes::table)
      .values(&note)
      .execute(conn)
      .expect("Error creating a new note");

    notes::table.order(notes::id).load::<Note>(conn).map_err(|err| -> String {
      println!("Error querying page views: {:?}", err);
      "Error querying page views from the database".into()
    }).map(Json)
  }

  pub fn read(conn: &PgConnection) -> Result<Json<Vec<Note>>, String> {
    notes::table.order(notes::id).load::<Note>(conn).map_err(|err| -> String {
      println!("Error querying page views: {:?}", err);
      "Error querying page views from the database".into()
    }).map(Json)
  }

  pub fn update(id: i32, note: InsertableNote, conn: &PgConnection) -> Result<Json<Vec<Note>>, String> {
    diesel::update(notes::table.find(id)).set(&note).execute(conn).expect("Error updating a note");

    notes::table.order(notes::id).load::<Note>(conn).map_err(|err| -> String {
      println!("Error querying page views: {:?}", err);
      "Error querying page views from the database".into()
    }).map(Json)
  }

  pub fn delete(id: i32, conn: &PgConnection) -> Result<Json<Vec<Note>>, String> {
    diesel::delete(notes::table.find(id)).execute(conn).expect("Error deleting note");

    notes::table.order(notes::id).load::<Note>(conn).map_err(|err| -> String {
      println!("Error querying page views: {:?}", err);
      "Error querying page views from the database".into()
    }).map(Json)
  }
}
