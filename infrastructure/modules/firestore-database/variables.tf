variable "project" {
  type        = string
  description = "Google Cloud project ID the database is created in"
}

variable "name" {
  type        = string
  description = "Database identifier. Clients pick up \"(default)\" without extra configuration."
  default     = "(default)"
}

variable "location" {
  type        = string
  description = "Firestore location, either a region or a multi region such as eur3. Immutable after creation."
}

variable "concurrency_mode" {
  type        = string
  description = "Transaction concurrency control for the database"
  default     = "PESSIMISTIC"

  validation {
    condition     = contains(["OPTIMISTIC", "PESSIMISTIC", "OPTIMISTIC_WITH_ENTITY_GROUPS"], var.concurrency_mode)
    error_message = "concurrency_mode must be OPTIMISTIC, PESSIMISTIC or OPTIMISTIC_WITH_ENTITY_GROUPS."
  }
}

variable "point_in_time_recovery" {
  type        = bool
  description = "Whether reads from the past 7 days are retained, so data can be recovered after a bad write"
  default     = false
}

variable "delete_protection" {
  type        = bool
  description = "Whether the database is protected against deletion. When false terraform is also allowed to destroy it."
  default     = true
}
