variable "project_id" {
  description = "GCP Project ID"
  type        = string
  sensitive   = true
}

variable "instance_name" {
  description = "Name of the instance"
  type        = string
}

variable "machine_type" {
  description = "Machine type"
  type        = string
  default     = "e2-micro"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
}

variable "disk_size_gb" {
  description = "Disk size in GB"
  type        = number
  default     = 20
}

variable "region" {
  description = "GCP Region"
  type        = string
}

variable "environment" {
  description = "Environment"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Network tags"
  type        = list(string)
  default     = []
}
