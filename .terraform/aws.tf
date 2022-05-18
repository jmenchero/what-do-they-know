
provider "aws" {
  version = "~> 3.0"
  region  = "eu-west-3"
}

terraform {
  backend "s3" {
    bucket = "wdtk-terraform-state"
    key    = "wdtk-terraform-state"
    region = "eu-west-3"
  }
}


resource "aws_s3_bucket" "front" {
  bucket = "wdtk-front"
  acl    = "public-read"
  policy = file("policies/wdtk-front-public.json")

  website {
    index_document = "index.html"
  }
}

resource "aws_redshift_cluster" "db" {
  cluster_identifier  = "wdtk-cluster"
  database_name       = "wdtk-db"
  master_username     = "wdtk-front"
  master_password     = "temporalpassword"
  node_type           = "dc2.large"
  cluster_type        = "single-node"
  skip_final_snapshot = true
}
