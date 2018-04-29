-- DDL Statements
DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
	department_id INT NOT NULL auto_increment,
    department_name VARCHAR(100),
    over_head_costs numeric(15,2),
    PRIMARY KEY (department_id)
);
ALTER TABLE departments AUTO_INCREMENT = 10000;
DROP TABLE IF EXISTS products;
CREATE TABLE products (
	item_id INT NOT NULL auto_increment,	
	product_name VARCHAR(100) NOT NULL,	
    department_id INT NOT NULL,
    price numeric(15,2) NOT NULL,
    stock INT NOT NULL,
    PRIMARY KEY (item_id),
    FOREIGN KEY (department_id)
		REFERENCES departments(department_id)
);
ALTER TABLE products AUTO_INCREMENT = 10000;

DROP PROCEDURE IF EXISTS usp_getAllBamazonData;
DELIMITER $$
CREATE PROCEDURE usp_getAllBamazonData()
BEGIN
SELECT item_id AS id,
	   product_name AS name,
	   price AS price
FROM products
ORDER BY product_name;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS usp_getAllBamazonManagerData;
DELIMITER $$
CREATE PROCEDURE usp_getAllBamazonManagerData()
BEGIN
SELECT p.item_id AS id,
	   p.product_name AS name,
       d.department_name AS deptName,
	   p.price AS price,
       p.stock AS stock
FROM products AS p
INNER JOIN departments AS d
ON p.department_id = d.department_id
ORDER BY d.department_name, p.product_name;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS usp_getLowInventory;
DELIMITER $$
CREATE PROCEDURE usp_getLowInventory()
BEGIN
SELECT p.item_id AS id,
	   p.product_name AS name,
       d.department_name AS deptName,
	   p.price AS price,
       p.stock AS stock
FROM products AS p
INNER JOIN departments AS d
ON p.department_id = d.department_id
WHERE p.stock < 5
ORDER BY d.department_name, p.product_name;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS usp_checkStock;
DELIMITER $$
CREATE PROCEDURE usp_checkStock(
	id int
)
BEGIN
SELECT stock 
FROM products 
WHERE item_id = id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS usp_addToStock;
DELIMITER $$
CREATE PROCEDURE usp_addToStock(
	id INT,
    qty INT
)
BEGIN
UPDATE products
SET stock = stock + qty
WHERE item_id = id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS usp_updateStock;
DELIMITER $$
CREATE PROCEDURE usp_updateStock(
	id INT,
    qty INT
)
BEGIN
UPDATE products
SET stock = stock - qty
WHERE item_id = id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS usp_insertInventory;
DELIMITER $$
CREATE PROCEDURE usp_insertInventory(
	prodName VARCHAR(100),
    deptId VARCHAR(25),
    price decimal(15,2),
    stock INT    
)
BEGIN
INSERT INTO products (product_name, department_id, price, stock) VALUES
(  prodName
 , CASE WHEN deptId = "Electronics" THEN 10000
		WHEN deptId = "Clothing" THEN 10001
        WHEN deptId = "HomeGoods" THEN 10002
        END
 , price
 ,stock);
END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS usp_getTotal;
DELIMITER $$
CREATE PROCEDURE usp_getTotal(
	id INT,
    qty INT
)
BEGIN
SELECT price * qty AS total
FROM products
WHERE item_id = id;
END$$
DELIMITER ;

-- DML statements
INSERT INTO departments (department_name, over_head_costs) VALUES
('Electronics', 12999.55) , ('Clothing', 6697.5), ('HomeGoods', 116670);

INSERT INTO products(product_name, department_id, price, stock) VALUES
('LG 24 Class 720p 60Hz LED HDTV',10000,119.99,25),
('Nintendo Switch with Neon Blue and Neon Red Joy-Con',10000,299.99,10),
('Canon EOS Rebel T6i EF-S 18-55mm IS STM Kit - Black (0591C003)',10000,699.99,10),
('Emerson Straight Rapid Movement Chino ',10001,98.00,10),
('Todd & Duncan Waffle-Knit Full-Zip Hoodie',10001,398.00,10),
('Grant Slim-Fit Luxe Poplin Plaid Shirt',10001,69.5,25),
('Como 80" Sofa',10002,8195.00,5),
('Cross Extension Table',10002,4950,5),
('MLF Eames Lounge Chair & Ottoman Red Aniline Leather',10002,1599.00,4),
('Herman Miller Eames Lounge, Walnut, Black Leather',10002,4295.00,2);

