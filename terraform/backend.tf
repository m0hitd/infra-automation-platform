# Backend configuration for remote state management
# Uncomment and configure to use Google Cloud Storage for state

# terraform {
#   backend "gcs" {
#     bucket  = "your-unique-tf-state-bucket"
#     prefix  = "terraform/state"
#   }
# }

# To use this backend:
# 1. Create GCS bucket: gsutil mb gs://your-unique-tf-state-bucket
# 2. Uncomment the above configuration
# 3. Run: terraform init
#
# Benefits:
# - Collaboration: Team members can work with same state
# - Locking: Prevents concurrent modifications
# - Versioning: Track infrastructure changes over time
