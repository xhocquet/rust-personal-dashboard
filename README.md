## Backend

### Dependencies
* Rust Nightly
* Postgres

### Setup
* Setup ENV vars
* `cd backend && cargo run`

### DB Environment Vars
export DATABASE_URL="postgresql://localhost:5432/personal_dashboard"
export ROCKET_DATABASES="{ personal_dashboard = { url = \"$DATABASE_URL\" } }"

## Frontend (todo)
