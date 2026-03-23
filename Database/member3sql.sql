-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 24, 2026 at 11:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `college_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Placed',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `order_date`) VALUES
(2, 1, 65.00, 'Placed', '2026-02-24 10:55:36');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 10.00),
(2, 1, 2, 1, 45.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `stock`, `category`, `created_at`) VALUES
(12, 'Ball pen Blue', 5.00, 42, 'Stationary', '2026-02-24 10:42:38'),
(13, 'Pencil Set', 20.00, 8, 'Stationary', '2026-02-24 10:42:38'),
(14, 'Highlighter Set', 45.00, 3, 'Stationary', '2026-02-24 10:42:38'),
(15, 'Geometry Box', 85.00, 5, 'Stationary', '2026-02-24 10:42:38'),
(16, 'File Folder ', 25.00, 20, 'Stationary', '2026-02-24 10:42:38'),
(17, 'Ruler 30cm', 15.00, 30, 'Stationary', '2026-02-24 10:42:38'),
(18, 'Scissors', 30.00, 0, 'Stationary', '2026-02-24 10:42:38'),
(26, 'Engineering Maths(S1)', 320.00, 10, 'Books', '2026-02-24 10:42:38'),
(27, 'Physics VOL1', 280.00, 7, 'Books', '2026-02-24 10:42:38'),
(28, 'Chemistry Lab Manual', 195.00, 5, 'Books', '2026-02-24 10:42:38'),
(29, 'Graph Book', 25.00, 18, 'Books', '2026-02-24 10:42:38'),
(36, 'Instant Coffee', 9.00, 50, 'Beverages', '2026-02-24 10:42:38'),
(37, 'Cardamom Tea', 9.00, 50, 'Beverages', '2026-02-24 10:42:38'),
(38, 'Lemon Tea', 10.00, 40, 'Beverages', '2026-02-24 10:42:38'),
(39, 'Smoodh', 10.00, 30, 'Beverages', '2026-02-24 10:42:38'),
(40, 'Frooti', 10.00, 30, 'Beverages', '2026-02-24 10:42:38'),
(41, 'Maaza', 10.00, 30, 'Beverages', '2026-02-24 10:42:38'),
(42, 'Fizz', 10.00, 25, 'Beverages', '2026-02-24 10:42:38'),
(43, 'Sprite', 20.00, 25, 'Beverages', '2026-02-24 10:42:38'),
(44, 'Fanta', 10.00, 25, 'Beverages', '2026-02-24 10:42:38'),
(45, 'Egg Puffs', 15.00, 20, 'Snacks', '2026-02-24 10:42:38'),
(46, 'Samosa', 10.00, 25, 'Snacks', '2026-02-24 10:42:38'),
(47, 'Nabatti Waffer', 10.00, 30, 'Snacks', '2026-02-24 10:42:38'),
(48, 'Too Yum', 20.00, 20, 'Snacks', '2026-02-24 10:42:38'),
(49, 'Good Day', 10.00, 25, 'Snacks', '2026-02-24 10:42:38'),
(50, 'Sundae', 35.00, 20, 'Ice Cream', '2026-02-24 10:42:38'),
(51, 'Choco Bar', 20.00, 20, 'Ice Cream', '2026-02-24 10:42:38'),
(52, 'Chocolate Cone', 45.00, 15, 'Ice Cream', '2026-02-24 10:42:38'),
(53, 'Vanilla Bar', 15.00, 25, 'Ice Cream', '2026-02-24 10:42:38'),
(54, 'Gems(small)', 5.00, 60, 'Chocolate', '2026-02-24 10:42:38'),
(55, 'Gems (Big)', 10.00, 40, 'Chocolate', '2026-02-24 10:42:38'),
(56, 'Galaxy', 45.00, 20, 'Chocolate', '2026-02-24 10:42:38'),
(57, 'Kitkat', 10.00, 30, 'Chocolate', '2026-02-24 10:42:38'),
(58, 'Dairy Milk', 10.00, 35, 'Chocolate', '2026-02-24 10:42:38'),
(59, 'Snickers', 20.00, 25, 'Chocolate', '2026-02-24 10:42:38'),
(60, 'Uniform', 1700.00, 10, 'Uniform', '2026-02-24 10:42:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `admission_number` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('student','admin') DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `admission_number`, `password`, `email`, `phone`, `role`, `created_at`) VALUES
(1, 'Ruby', 'Jacob', '2023A777', 'Ruby@26', NULL, NULL, 'student', '2026-02-24 10:52:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admission_number` (`admission_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
