use crate::schema::notes;

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

#[derive(Deserialize, Insertable)]
#[table_name = "notes"]
pub struct InsertableNote {
  pub title: String,
  pub body: String,
  pub finished: bool,
  pub note_id: i32,
}
