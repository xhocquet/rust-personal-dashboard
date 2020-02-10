use crate::schema::notes;

#[derive(Serialize, Deserialize, Queryable)]
pub struct Note {
  pub id: i32,
  pub title: String,
  pub body: Option<String>,
  pub finished: bool,
}

#[derive(Deserialize, Insertable)]
#[table_name = "notes"]
pub struct InsertableNote {
  pub title: String,
  pub body: String,
  pub finished: bool,
}
