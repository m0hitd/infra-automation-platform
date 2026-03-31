output "instance_id" {
  description = "Instance ID of the created VM"
  value       = google_compute_instance.vm_instance.id
}

output "instance_name" {
  description = "Name of the created instance"
  value       = google_compute_instance.vm_instance.name
}

output "internal_ip" {
  description = "Internal IP address of the instance"
  value       = google_compute_instance.vm_instance.network_interface[0].network_ip
}

output "external_ip" {
  description = "External IP address of the instance"
  value       = try(google_compute_instance.vm_instance.network_interface[0].access_config[0].nat_ip, "No external IP")
}

output "instance_self_link" {
  description = "Self link of the instance"
  value       = google_compute_instance.vm_instance.self_link
}
