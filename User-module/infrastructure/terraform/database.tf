# PostgreSQL database for User Management System

resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = [aws_subnet.public.id]
  tags = {
    Name = "${var.environment}-db-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier              = "${var.environment}-userdb"
  engine                  = "postgres"
  engine_version          = "14.11"
  instance_class          = "db.t3.micro"
  allocated_storage       = 20
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [aws_security_group.backend.id]
  username                = "user"
  password                = "${var.db_password}"
  db_name                 = "userdb"
  skip_final_snapshot     = true
  publicly_accessible     = false
  multi_az                = false
  storage_encrypted       = true
  tags = {
    Name = "${var.environment}-userdb"
  }
}

variable "db_password" {
  description = "Database password (should come from secrets manager)"
  type        = string
  sensitive   = true
}
