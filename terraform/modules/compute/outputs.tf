output "instance_id" {
  description = "Instance ID"
  value       = google_compute_instance.vm_instance.id
}

output "instance_name" {
  description = "Instance name"
  value       = google_compute_instance.vm_instance.name
}

output "internal_ip" {
  description = "Internal IP"
  value       = google_compute_instance.vm_instance.network_interface[0].network_ip
}

output "external_ip" {
  description = "External IP"
  value       = try(google_compute_instance.vm_instance.network_interface[0].access_config[0].nat_ip, null)
}
