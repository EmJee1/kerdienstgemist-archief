locals {
  delete_protection_state = var.delete_protection ? "DELETE_PROTECTION_ENABLED" : "DELETE_PROTECTION_DISABLED"
  deletion_policy = var.delete_protection ? "ABANDON" : "DELETE"

  point_in_time_recovery = var.point_in_time_recovery ? "POINT_IN_TIME_RECOVERY_ENABLED" : "POINT_IN_TIME_RECOVERY_DISABLED"
}

resource "google_firestore_database" "this" {
  project     = var.project
  name        = var.name
  location_id = var.location
  type        = "FIRESTORE_NATIVE"

  concurrency_mode            = var.concurrency_mode
  app_engine_integration_mode = "DISABLED"

  point_in_time_recovery_enablement = local.point_in_time_recovery
  delete_protection_state           = local.delete_protection_state
  deletion_policy                   = local.deletion_policy
}
