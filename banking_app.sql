CREATE DATABASE banking_app;
USE banking_app;

-- Create table user
CREATE TABLE banking_app.`user` (
	id BIGINT auto_increment NOT NULL,
	name VARCHAR(255) NULL,
	address VARCHAR(255) NULL,
	CONSTRAINT user_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

-- Insert new row in table user
INSERT INTO banking_app.`user` (name, address)
VALUES ('Hendrin', 'Malang')

INSERT INTO banking_app.`user` (name, address)
VALUES ('Naomi', 'Japan')

-- Create table transaction
CREATE TABLE banking_app.`transaction` (
	id BIGINT auto_increment NOT NULL,
	user_id BIGINT NOT NULL,
	type ENUM('income', 'expense') NOT NULL,
	amount DOUBLE NOT NULL,
	CONSTRAINT transaction_PK PRIMARY KEY (id),
	CONSTRAINT transaction_FK_user FOREIGN KEY (user_id) REFERENCES `user`(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

-- Insert new row in table transaction
INSERT INTO banking_app.`transaction` (`type`, amount, user_id)
VALUES ('income', 500000, 2)