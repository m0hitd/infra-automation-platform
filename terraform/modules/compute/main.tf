resource "google_compute_instance" "vm_instance" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = var.disk_size_gb
      type  = "pd-standard"
    }
  }

  network_interface {
    network = "default"

    access_config {
      # Ephemeral public IP
    }
  }

  service_account {
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  metadata = {
    enable-oslogin = "true"
  }

  tags = var.tags

  labels = {
    environment = var.environment
    managed-by  = "terraform"
  }

  lifecycle {
    ignore_changes = [boot_disk[0].initialize_params[0].image]
  }
}
