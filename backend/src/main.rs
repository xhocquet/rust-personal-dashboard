#![feature(proc_macro_hygiene, decl_macro)]

extern crate chrono;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket;
extern crate rocket_contrib;
extern crate serde;
extern crate serde_json;
#[macro_use]
extern crate serde_derive;

pub mod models;
pub mod db;
pub mod routes;
pub mod schema;
pub mod cors;

use rocket_contrib::templates::Template;
use rocket_contrib::serve::StaticFiles;

fn main() {
    rocket::ignite()
      .mount("/", routes![
        routes::index,
        routes::favicon,
        routes::api::notes_index,
        routes::api::notes_create,
        routes::api::notes_update,
        routes::api::notes_delete,
      ])
      .mount("/static", StaticFiles::from("static"))
      .manage(db::connect())
      .attach(cors::CorsFairing)
      .attach(Template::fairing())
      .launch();
}
