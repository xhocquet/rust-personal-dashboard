table! {
    notes (id) {
        id -> Int4,
        title -> Text,
        body -> Nullable<Text>,
        finished -> Bool,
        note_id -> Nullable<Int4>,
    }
}
