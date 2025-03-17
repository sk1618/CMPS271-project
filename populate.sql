-- Insert categories
INSERT INTO categories (id, name) VALUES 
(1, 'Electronics'),
(2, 'Clothing'),
(3, 'Books'),
(4, 'Home Appliances'),
(5, 'Toys'),
(6, 'Sports Equipment'),
(7, 'Furniture'),
(8, 'Beauty & Personal Care');

-- Insert items
INSERT INTO items (id, name, category_id, bought_date, cost, sale_price, quantity) 
VALUES 
(1, 'Laptop', 1, '2024-03-15', 800, 1200, 5),
(2, 'Smartphone', 1, '2024-03-18', 600, 950, 10),
(3, 'Headphones', 1, '2024-03-12', 50, 100, 15),
(4, 'T-shirt', 2, '2024-03-10', 10, 20, 50),
(5, 'Jeans', 2, '2024-03-11', 30, 60, 25),
(6, 'Novel', 3, '2024-02-20', 15, 30, 20),
(7, 'Cookbook', 3, '2024-01-10', 20, 40, 10),
(8, 'Microwave', 4, '2024-02-28', 100, 180, 8),
(9, 'Blender', 4, '2024-03-05', 40, 75, 12),
(10, 'Action Figure', 5, '2024-02-15', 25, 50, 30),
(11, 'Doll', 5, '2024-02-18', 15, 35, 40),
(12, 'Basketball', 6, '2024-03-01', 30, 55, 20),
(13, 'Treadmill', 6, '2024-01-30', 500, 900, 3),
(14, 'Sofa', 7, '2024-03-20', 300, 600, 4),
(15, 'Dining Table', 7, '2024-02-22', 400, 800, 2),
(16, 'Shampoo', 8, '2024-03-02', 5, 15, 50),
(17, 'Face Cream', 8, '2024-03-08', 20, 45, 30);

-- Insert transactions
INSERT INTO transactions (id, name, amount) 
VALUES 
(1, 'Laptop Sale', 1200),
(2, 'Smartphone Sale', 950),
(3, 'Headphones Sale', 100),
(4, 'T-shirt Sale', 20),
(5, 'Jeans Sale', 60),
(6, 'Novel Sale', 30),
(7, 'Cookbook Sale', 40),
(8, 'Microwave Sale', 180),
(9, 'Blender Sale', 75),
(10, 'Action Figure Sale', 50),
(11, 'Doll Sale', 35),
(12, 'Basketball Sale', 55),
(13, 'Treadmill Sale', 900),
(14, 'Sofa Sale', 600),
(15, 'Dining Table Sale', 800),
(16, 'Shampoo Sale', 15),
(17, 'Face Cream Sale', 45);
