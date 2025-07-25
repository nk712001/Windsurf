terraform {
  backend "s3" {
    bucket         = "<YOUR_TF_STATE_BUCKET>"
    key            = "user-module/${var.environment}/terraform.tfstate"
    region         = var.aws_region
    dynamodb_table = "<YOUR_TF_LOCK_TABLE>"
    encrypt        = true
  }
}
