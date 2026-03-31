variable "project_id" {
  description = "GCP Project ID"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "asia-south1"
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "dev"
}

variable "instance_name" {
  description = "Name of the Compute Engine instance"
  type        = string
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.instance_name))
    error_message = "Instance name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "machine_type" {
  description = "Machine type for the instance"
  type        = string
  default     = "e2-micro"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "asia-south1-a"
}

variable "disk_size_gb" {
  description = "Boot disk size in GB"
  type        = number
  default     = 20
}

variable "tags" {
  description = "Tags for resources"
  type        = list(string)
  default     = ["http-server", "https-server"]
}
