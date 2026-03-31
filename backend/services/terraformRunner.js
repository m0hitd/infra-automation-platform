const { exec } = require("child_process");
const path = require("path");

/**
 * Run Terraform plan command
 * @param {string} tfVarsPath - Path to terraform variables file
 * @returns {Promise<string>} - Terraform plan output
 */
function getTerraformPlan(tfVarsPath) {
  return new Promise((resolve, reject) => {
    const terraformPath = path.join(__dirname, "../../terraform");
    exec(
      `cd ${terraformPath} && terraform plan -var-file="${tfVarsPath}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Terraform plan failed: ${stderr}`));
        }
        resolve(stdout);
      }
    );
  });
}

/**
 * Run Terraform apply command
 * @param {string} instanceName - Name of the instance to create
 * @returns {Promise<string>} - Terraform apply output
 */
function runTerraform(instanceName) {
  return new Promise((resolve, reject) => {
    const terraformPath = path.join(__dirname, "../../terraform");
    
    exec(
      `cd ${terraformPath} && terraform apply -auto-approve -var="instance_name=${instanceName}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Terraform execution failed: ${stderr}`));
        }
        resolve(stdout);
      }
    );
  });
}

/**
 * Destroy infrastructure
 * @returns {Promise<string>} - Terraform destroy output
 */
function destroyInfra() {
  return new Promise((resolve, reject) => {
    const terraformPath = path.join(__dirname, "../../terraform");
    
    exec(
      `cd ${terraformPath} && terraform destroy -auto-approve`,
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Terraform destroy failed: ${stderr}`));
        }
        resolve(stdout);
      }
    );
  });
}

module.exports = {
  runTerraform,
  destroyInfra,
  getTerraformPlan,
};
