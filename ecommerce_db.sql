-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2025 at 04:32 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL COMMENT 'Contoh: Rumah, Kantor',
  `recipient_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `full_address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `label`, `recipient_name`, `phone_number`, `full_address`, `city`, `postal_code`, `is_primary`) VALUES
(3, 1, 'Rumah', 'Pembeli 1', '08123456789', 'Buah Batu', 'Bandung', '45221', 1);

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `buyer_id`, `seller_id`, `product_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 3, '2025-07-16 12:49:30', '2025-07-16 12:49:30'),
(2, 1, 3, 4, '2025-07-16 14:43:13', '2025-07-16 14:43:13');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message_text` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `receiver_id`, `message_text`, `is_read`, `created_at`) VALUES
(1, 1, 1, 0, 'Halo, stok ada?', 0, '2025-07-16 13:46:37'),
(2, 1, 2, 0, 'ada, silahkan kak', 0, '2025-07-16 13:46:50'),
(3, 1, 1, 0, 'okey makasi kak', 0, '2025-07-16 13:47:08'),
(4, 1, 1, 0, 'untuk ukuranya, ready size apa kak?', 0, '2025-07-16 13:47:33'),
(5, 2, 1, 0, 'halo kak', 0, '2025-07-16 14:43:18'),
(6, 2, 3, 0, 'iya kak bagaimana?', 0, '2025-07-16 14:58:39'),
(7, 2, 1, 0, 'a35 cocok untuk game kak?', 0, '2025-07-16 15:06:57'),
(8, 2, 3, 0, 'kurang kak', 0, '2025-07-16 15:11:11');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `payment_method` enum('cod','bank_transfer','payment_gateway') NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_address` text NOT NULL,
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending' COMMENT 'Status spesifik untuk pembayaran',
  `status` enum('pending','processing','shipped','completed','cancelled') NOT NULL DEFAULT 'pending' COMMENT 'Status keseluruhan pesanan',
  `payment_details` text DEFAULT NULL COMMENT 'Bisa untuk menyimpan detail payment gateway atau note lainnya',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `buyer_id`, `payment_method`, `total_amount`, `shipping_address`, `payment_status`, `status`, `payment_details`, `created_at`, `updated_at`) VALUES
(1, 1, 'payment_gateway', 84000.00, 'Address ID: 3', 'pending', 'completed', 'Card ID: 2', '2025-07-12 14:41:43', '2025-07-12 16:14:02'),
(2, 1, 'payment_gateway', 111000.00, 'Address ID: 3', 'pending', 'completed', 'Card ID: 2', '2025-07-12 16:48:48', '2025-07-12 17:05:53'),
(3, 1, 'payment_gateway', 91000.00, 'Address ID: 3', 'pending', 'completed', 'Card ID: 2', '2025-07-14 05:35:49', '2025-07-14 05:36:17'),
(4, 1, 'payment_gateway', 91000.00, 'Address ID: 3', 'pending', 'cancelled', 'Card ID: 2', '2025-07-14 05:37:29', '2025-07-14 05:37:56'),
(5, 1, 'payment_gateway', 3510999.00, 'Address ID: 3', 'pending', 'completed', 'Card ID: 2', '2025-07-15 04:09:21', '2025-07-15 04:09:51');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `store_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_per_item` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `store_id`, `quantity`, `price_per_item`) VALUES
(1, 1, 1, 1, 1, 75000.00),
(2, 2, 2, 1, 1, 100000.00),
(3, 3, 3, 1, 1, 80000.00),
(4, 4, 3, 1, 1, 80000.00),
(5, 5, 4, 2, 1, 3499999.00);

-- --------------------------------------------------------

--
-- Table structure for table `payment_cards`
--

CREATE TABLE `payment_cards` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cardholder_name` varchar(255) NOT NULL,
  `masked_number` varchar(25) NOT NULL COMMENT 'Simpan hanya 4 digit terakhir, misal: **** **** **** 1234',
  `card_network` varchar(20) NOT NULL COMMENT 'Contoh: Visa, Mastercard',
  `expiry_month` varchar(2) NOT NULL,
  `expiry_year` varchar(4) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_cards`
--

INSERT INTO `payment_cards` (`id`, `user_id`, `cardholder_name`, `masked_number`, `card_network`, `expiry_month`, `expiry_year`, `is_primary`) VALUES
(2, 1, 'Pembeli1', '**** **** **** 4234', 'Other', '07', '2026', 0);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `store_id`, `name`, `description`, `price`, `stock`, `category`, `created_at`, `updated_at`) VALUES
(1, 1, 'Kaos Biru Polos', 'Tampil rapi tanpa ribet dengan kaos polo berbahan pique yang adem dan menyerap keringat. Cocok untuk acara santai atau semi-formal.', 75000.00, 4, 'Kaos & T-Shirt', '2025-07-12 10:54:51', '2025-07-12 14:41:43'),
(2, 1, 'Kemeja Biru', 'Kemeja slim fit berbahan katun stretch ini bikin penampilan semakin stylish dan rapi. Cocok untuk hangout, ngedate, atau meeting santai. Tersedia ukuran S hingga XL.', 100000.00, 4, 'Kemeja & Blus', '2025-07-12 16:47:59', '2025-07-12 16:48:48'),
(3, 1, 'Baju batik', 'Bagus', 80000.00, 3, 'Kemeja & Blus', '2025-07-14 05:35:32', '2025-07-14 05:37:29'),
(4, 2, 'Hp Samsung A35', 'Keren, Gelo, Mantap', 3499999.00, 4, 'Handphone', '2025-07-15 04:08:34', '2025-07-15 04:09:21');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`) VALUES
(1, 1, 'public\\images\\image-1752317691369-588146965.jpeg'),
(2, 2, 'public\\images\\image-1752338879407-959822915.jpeg'),
(3, 3, 'public\\images\\image-1752471332742-734300770.jpg'),
(4, 4, 'public\\images\\image-1752552514076-385551127.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL COMMENT 'Memastikan review hanya untuk produk yg sudah dipesan',
  `rating` tinyint(1) NOT NULL COMMENT 'Rating dari 1 sampai 5',
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `order_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 1, 1, 5, 'Baju nyaman dan tidak bikin gerah', '2025-07-12 16:58:20'),
(2, 1, 2, 2, 4, 'Pengiriman nya cukup lama', '2025-07-12 17:06:18'),
(3, 1, 3, 3, 1, 'Rusak', '2025-07-14 05:36:41'),
(4, 1, 4, 5, 5, 'mntafffff', '2025-07-15 04:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `user_id`, `name`, `description`, `logo_url`, `created_at`, `updated_at`) VALUES
(1, 2, 'TheClothesOne', 'Menjual Berbagai Pakaian Anak hingga Dewasa, Pria maupun Wanita', NULL, '2025-07-12 10:27:19', '2025-07-12 10:27:19'),
(2, 3, 'TopGadget', 'Menjual Berbagai Gadget', NULL, '2025-07-14 15:51:01', '2025-07-14 15:51:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Simpan password yang sudah di-hash (e.g., bcrypt)',
  `role` enum('buyer','seller') NOT NULL DEFAULT 'buyer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Pembeli 1', 'Pembeli1@gmail.com', '$2b$10$PzeeA1bII3bPkSUT4n7yD.rudPRrCraHBbyXMhVmzXrqoxZqiDLz.', 'buyer', '2025-07-11 13:10:21', '2025-07-16 08:52:55'),
(2, 'Penjual 1', 'Penjual1@gmail.com', '$2b$10$wB3wjrZGru6qboG7Vap3luz7AebE1UmryJMhJojeC22t560IqBWG6', 'seller', '2025-07-12 10:26:14', '2025-07-12 10:27:19'),
(3, 'Penjual 2', 'Penjual2@gmail.com', '$2b$10$rRpwuLg7TCNZZYtJ.V/HHuja78fW2kTNxgYthDCi0oI80QPhphsVe', 'seller', '2025-07-14 15:49:45', '2025-07-14 15:51:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `seller_id` (`seller_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_ibfk_1` (`buyer_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `payment_cards`
--
ALTER TABLE `payment_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_product_order_unique` (`user_id`,`product_id`,`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `stores_ibfk_1` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment_cards`
--
ALTER TABLE `payment_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment_cards`
--
ALTER TABLE `payment_cards`
  ADD CONSTRAINT `payment_cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
