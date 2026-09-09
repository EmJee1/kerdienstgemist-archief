output "name" {
  description = "Database identifier, as used in client configuration"
  value       = google_firestore_database.this.name
}

output "id" {
  description = "Fully qualified resource name of the database"
  value       = google_firestore_database.this.id
}

output "location" {
  description = "Location the database lives in"
  value       = google_firestore_database.this.location_id
}
