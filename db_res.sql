-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 01, 2024 at 05:08 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_res`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `role`) VALUES
(1, 'test', 'zerryboy28@gmail.com', '$2b$10$3g8w9co2El9N3JxhmFOT4.Kd46rNZIAMqDSGNjy/ZbsjLlaCw9qvG', '2024-09-18 05:36:50', 'user'),
(3, 'test', '', '$2a$10$Cvki0SjwGuF2ZIFyet3B/OudxrSZduyPqKCjXekAfxlo5sik4K57a', '2024-09-18 05:45:37', 'user'),
(5, 'test', 'wooyoumarketing@gmail.com', '$2a$10$We.7vrMv/JUv4DmrrJ1yKev9Z3Y8dVVv/DKZggKLLEz4lLmIgvu3m', '2024-09-18 05:51:23', 'user'),
(6, 'test33', 'devwooyou@gmail.com', '$2a$10$RXuzkArsb6g.1rgydbtE2e4O4Cz9ShIHuf5svF3fSnTs96Tgcn2q6', '2024-09-18 06:00:33', 'user'),
(9, 'sompong', 'zzza@gmail.com', '$2a$10$jV1txTWJu.aNjPgsiWDYJetWlgS0eJYPFhh/nV0SHgFuH4aAJ00Cu', '2024-09-27 09:24:55', 'user'),
(13, 'somsri', 'wooyoudeave@gmail.com', '$2a$10$omnqNwMWkYslu/utnT0LQeuGXU.k4et4hvB40/m8DQzNgomtljQf2', '2024-09-27 09:39:53', 'user');

--
-- Indexes for dumped tables
--

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
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
