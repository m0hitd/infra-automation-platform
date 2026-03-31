module "compute" {
  source = "./modules/compute"

  project_id    = var.project_id
  instance_name = var.instance_name
  machine_type  = var.machine_type
  zone          = var.zone
  disk_size_gb  = var.disk_size_gb
  region        = var.region
  environment   = var.environment
  tags          = var.tags
}
