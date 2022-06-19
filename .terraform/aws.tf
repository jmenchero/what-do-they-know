
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
  database_name       = "wdtk_db"
  master_username     = "wdtkfront"
  master_password     = "1Temporalpassword"
  node_type           = "dc2.large"
  cluster_type        = "single-node"
  skip_final_snapshot = true
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.front.bucket_regional_domain_name
    origin_id = "wdtk-front.s3-website.eu-west-3.amazonaws.com"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "wdtk-cdn"
  default_root_object = "index.html"
  default_cache_behavior {
    target_origin_id = "wdtk-front.s3-website.eu-west-3.amazonaws.com"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "ES"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
