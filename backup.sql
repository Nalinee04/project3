-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: db_res
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `cate_id` int(11) NOT NULL AUTO_INCREMENT,
  `cate_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cate_images` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'อาหารเส้น','2025-02-21 12:27:45','/images/ก๋วย.png'),(2,'อาหารจานเดียว','2025-02-21 12:27:45','/images/จานเดียว.jpg'),(3,'น้ำ','2025-02-21 12:27:45','/images/เภทน้ำ.jpg'),(4,'ของกินเล่น','2025-02-21 12:27:45','/images/ไก่ทอดด.jpg'),(5,'อาหารตามสั่ง','2025-02-21 12:27:45','/images/จานเดียว.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_options`
--

DROP TABLE IF EXISTS `menu_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menu_id` (`menu_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `menu_options_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`menu_id`) ON DELETE CASCADE,
  CONSTRAINT `menu_options_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `option_groups` (`group_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_options`
--

LOCK TABLES `menu_options` WRITE;
/*!40000 ALTER TABLE `menu_options` DISABLE KEYS */;
INSERT INTO `menu_options` VALUES (1,1,3),(2,1,4),(3,1,5),(4,2,3),(5,2,4),(6,2,5),(7,3,3),(8,3,4),(9,3,5),(10,4,3),(11,4,4),(12,4,5),(13,5,6),(14,6,7),(15,7,7),(16,8,7),(17,9,7),(18,13,8),(19,14,8),(20,15,8),(21,16,1),(22,17,1),(23,18,1),(24,30,2),(25,31,2),(26,32,2),(27,33,2),(28,34,2),(29,35,2),(30,36,2),(31,37,2),(32,38,2),(33,58,10),(34,59,10),(35,60,10),(36,61,9),(37,61,10),(38,62,9),(39,62,10),(40,74,9),(41,74,10),(42,75,9),(43,75,10),(44,76,9),(45,76,9),(46,77,9),(47,77,9),(48,78,10),(49,79,9),(50,79,10),(51,80,9),(52,80,10);
/*!40000 ALTER TABLE `menu_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menus` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_id` int(11) NOT NULL,
  `menu_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `cate_id` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `menu_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`menu_id`),
  KEY `shop_id` (`shop_id`),
  KEY `cate_id` (`cate_id`),
  CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE,
  CONSTRAINT `menus_ibfk_2` FOREIGN KEY (`cate_id`) REFERENCES `categories` (`cate_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,11,'ข้าวไข่เจียว1ฟอง',20.00,2,1,'2025-02-21 12:55:18','/images/ไข่1ฟอง.jpg'),(2,11,'ข้าวไข่เจียว2ฟอง',25.00,2,1,'2025-02-21 12:55:18','/images/ไข่2ฟอง.jpg'),(3,11,'ข้าวไข่เจียวทรงเครื่อง1ฟอง',25.00,2,1,'2025-02-21 12:55:18','/images/ทรงเครื่อง1ฟอง.jpg'),(4,11,'ข้าวไข่เจียวทรงเครื่อง2ฟอง',30.00,2,1,'2025-02-21 12:55:18','/images/ไข่ทรงเครื่อง2ฟอง.jpg'),(5,12,'ข้าวขาหมู',40.00,2,1,'2025-02-21 13:07:25','/images/ข้าวขาหมู.webp'),(6,13,'ราดหน้าหมู',40.00,1,1,'2025-02-21 13:16:30','/images/ราดหน้าหมู.jpg'),(7,13,'ราดหน้าหมู+ไก่',40.00,1,1,'2025-02-21 13:16:30','/images/ราดหน้าไก่.jpg'),(8,13,'ราดหน้าทะเล',50.00,1,1,'2025-02-21 13:16:30','/images/ราดหน้าทะเล.webp'),(9,13,'ราดหน้าทะเลรวม',50.00,1,1,'2025-02-21 13:16:30','/images/ราดหน้าทะเลรวม.png'),(10,15,'ข้าวไก่กรอบ',15.00,2,1,'2025-02-21 13:27:11','/images/ข้าวไก่กรอบ.jpg'),(11,15,'ข้าวยำไก่แซ่บ',20.00,2,1,'2025-02-21 13:27:11','/images/ข้าวยำไก่แซ่บ.jpg'),(12,15,'ไก่ไม่มีกระดูก',10.00,4,1,'2025-02-21 13:27:11','/images/ไก่ไม่มีกระดูก.webp'),(13,20,'ข้าวมันไก่ทอด',20.00,2,1,'2025-02-21 13:39:26','/images/ข้าวมันไก่ทอด.jpg'),(14,20,'ข้าวมันไก่ย่าง',20.00,2,1,'2025-02-21 13:39:26','/images/ข้าวมันไก่ย่าง.jpg'),(15,20,'ข้าวไก่เทอริยากิ',20.00,2,1,'2025-02-21 13:39:26','/images/ข้าวไก่เทอริยากิ.jpg'),(16,17,'ข้าวมันไก่',30.00,2,1,'2025-02-21 14:02:59','/images/ข้าวมันไก่.jpg'),(17,17,'ข้าวมันไก่อบ',30.00,2,1,'2025-02-21 14:02:59','/images/ข้าวมันไก่อบ.jpg'),(18,17,'ข้าวไก่ทอด',30.00,2,1,'2025-02-21 14:02:59','/images/ข้าวหมูทอด.jpg'),(19,19,'สตอเบอร์รี่โซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(20,19,'บลูเบอร์รี่โซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(21,19,'แอปเปิ้ลโซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(22,19,'เสาวรสโซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(23,19,'แดงโซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(24,19,'เขียวโซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(25,19,'บ๊วยโซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(26,19,'มะนาวโซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(27,19,'ลิ้นจี่โซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(28,19,'บลูฮาวาย',20.00,3,1,'2025-02-21 14:13:09','NULL'),(29,19,'สับปะรดโซดา',20.00,3,1,'2025-02-21 14:13:09','NULL'),(30,14,'น้ำมะพร้าว',10.00,3,1,'2025-02-21 14:19:25','NULL'),(31,14,'โอเลี้ยง',10.00,3,1,'2025-02-21 14:19:25','NULL'),(32,14,'ชาเย็น',10.00,3,1,'2025-02-21 14:19:25','NULL'),(33,14,'ชาเขียว',10.00,3,1,'2025-02-21 14:19:25','NULL'),(34,14,'น้ำผึ้งมะนาว',10.00,3,1,'2025-02-21 14:19:25','NULL'),(35,14,'อัญชันมะนาว',10.00,3,1,'2025-02-21 14:19:25','NULL'),(36,14,'โกโก้',10.00,3,1,'2025-02-21 14:19:25','NULL'),(37,14,'น้ำเปล่า',7.00,3,1,'2025-02-21 14:19:25','NULL'),(38,14,'น้ำเปล่า3ขวด',20.00,3,1,'2025-02-21 14:19:25','NULL'),(39,18,'ยำสาหร่าย',5.00,4,1,'2025-02-21 15:07:50','NULL'),(40,18,'แซลมอน',5.00,4,1,'2025-02-21 15:07:50','NULL'),(41,18,'ยำสาหร่าย',5.00,4,1,'2025-02-21 15:08:18','NULL'),(42,18,'แซลมอน',5.00,4,1,'2025-02-21 15:08:18','NULL'),(43,18,'ยำสาหร่าย',5.00,4,1,'2025-02-21 15:08:33','NULL'),(44,18,'แซลมอน',5.00,4,1,'2025-02-21 15:08:33','NULL'),(45,18,'แฮมไก่',5.00,4,1,'2025-02-21 15:08:33','NULL'),(46,18,'ไส้กรอกไก่',5.00,4,1,'2025-02-21 15:08:33','NULL'),(47,18,'7ลูก(สุ่มไส้)',40.00,4,1,'2025-02-21 15:08:33','NULL'),(48,18,'11ลูก(สุ่มไส้)',60.00,4,1,'2025-02-21 15:08:33','NULL'),(49,18,'ปลาหมึก',5.00,4,1,'2025-02-21 15:08:33','NULL'),(50,16,'กะหล่ำปลีผัดปลา',30.00,5,1,'2025-02-21 15:28:16','NULL'),(53,16,'ข้าวลาบ',40.00,5,1,'2025-02-21 15:28:24','NULL'),(54,16,'ข้าวหมูทอด',40.00,5,1,'2025-02-21 15:28:24','NULL'),(55,16,'ข้าวไข่เจียว',25.00,5,1,'2025-02-21 15:28:24','NULL'),(56,16,'ข้าวไข่ข้น',30.00,5,1,'2025-02-21 15:28:24','NULL'),(57,16,'ข้าวไข่เจียวห่อหมก',35.00,5,1,'2025-02-21 15:28:24','NULL'),(58,16,'ผัดซีอิ๊ว',45.00,5,1,'2025-02-21 15:28:24','NULL'),(59,16,'สุกี้น้ำ',45.00,5,1,'2025-02-21 15:28:24','NULL'),(60,16,'สุกี้แห้ง',45.00,5,1,'2025-02-21 15:28:24','NULL'),(61,16,'ผัดกะเพรา',40.00,5,1,'2025-02-21 15:28:24','NULL'),(62,16,'ผัดพริกแกง',40.00,5,1,'2025-02-21 15:28:24','NULL'),(74,16,'ผัดพริก',40.00,5,1,'2025-02-21 15:28:50','NULL'),(75,16,'ผัดพริกเผา',40.00,5,1,'2025-02-21 15:28:50','NULL'),(76,16,'ผัดพริกไทยดำ',40.00,5,1,'2025-02-21 15:28:50','NULL'),(77,16,'ข้าวผัด',40.00,5,1,'2025-02-21 15:28:50','NULL'),(78,16,'ข้าวผัดต้มยำกุ้ง',40.00,5,1,'2025-02-21 15:28:50','NULL'),(79,16,'ผัดคะน้า',40.00,5,1,'2025-02-21 15:28:50','NULL'),(80,16,'ผัดผักบุ้ง',40.00,5,1,'2025-02-21 15:28:50','NULL'),(81,16,'ราดหน้าหมูนุ่ม',40.00,5,1,'2025-02-21 15:28:50','NULL'),(82,16,'ผัดซีอิ๊วขี้เมาหมูนุ่ม',40.00,5,1,'2025-02-21 15:28:50','NULL'),(83,16,'เส้นเล็กผัดกะเพราหมูสับ',40.00,5,1,'2025-02-21 15:28:50','NULL'),(84,16,'มาม่าผัดขี้เมา',40.00,5,1,'2025-02-21 15:28:50','NULL'),(85,16,'มาม่าต้มยำกุ้ง',45.00,5,1,'2025-02-21 15:28:50','NULL'),(86,11,'ข้าวไข่เจียว4ฟอง',35.00,2,1,'2025-02-23 08:16:51','/images/ไข่3ฟอง.jpg'),(87,11,'ข้าวไข่เจียว4ฟอง',35.00,2,1,'2025-02-23 08:48:32','/images/ไข่4ฟอง.jpg');
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `option_groups`
--

DROP TABLE IF EXISTS `option_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `option_groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_id` int(11) DEFAULT NULL,
  `group_name` varchar(255) NOT NULL,
  `is_required` tinyint(1) DEFAULT 0,
  `max_select` int(11) DEFAULT 1,
  PRIMARY KEY (`group_id`),
  KEY `shop_id` (`shop_id`),
  CONSTRAINT `option_groups_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `option_groups`
--

LOCK TABLES `option_groups` WRITE;
/*!40000 ALTER TABLE `option_groups` DISABLE KEYS */;
INSERT INTO `option_groups` VALUES (1,17,'ขนาด',1,1),(2,14,'ขนาด',1,1),(3,11,'เนื้อสัตว์',1,5),(4,11,'ผัก',1,5),(5,11,'เลือกซอส',1,1),(6,12,'ขนาด',1,1),(7,13,'ขนาด',1,1),(8,20,'ขนาด',1,1),(9,16,'ท็อปปิ้ง',1,1),(10,16,'เนื้อสัตว์',1,1);
/*!40000 ALTER TABLE `option_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `option_items`
--

DROP TABLE IF EXISTS `option_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `option_items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) DEFAULT NULL,
  `item_name` varchar(255) NOT NULL,
  `add_price` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`item_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `option_items_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `option_groups` (`group_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `option_items`
--

LOCK TABLES `option_items` WRITE;
/*!40000 ALTER TABLE `option_items` DISABLE KEYS */;
INSERT INTO `option_items` VALUES (1,1,'ธรรมดา',0.00),(2,1,'พิเศษ',5.00),(3,2,'เล็ก',0.00),(4,2,'ใหญ่',10.00),(5,3,'หมูสับ',0.00),(6,3,'ไส้กรอก',0.00),(7,3,'ปูอัด',0.00),(8,3,'เเฮมหมู',0.00),(9,3,'หมูยอ',0.00),(10,4,'เเครอท',0.00),(11,4,'พริกสด',0.00),(12,4,'หอมแดง',0.00),(13,4,'โหระพา',0.00),(14,4,'หอมใหญ่',0.00),(15,5,'ซอสพริก',0.00),(16,5,'ซอสมะเขือเทศ',0.00),(17,6,'ธรรมดา',0.00),(18,6,'พิเศษ',10.00),(19,7,'ธรรมดา',0.00),(20,7,'พิเศษ',10.00),(21,8,'ธรรมดา',0.00),(22,8,'พิเศษ',10.00),(23,9,'ไข่ดาว',10.00),(24,9,'ไข่เจียว',10.00),(25,10,'หมู',0.00),(26,10,'ทะเล',5.00),(27,10,'ทะเล',5.00);
/*!40000 ALTER TABLE `option_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'รอดำเนินการ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deliveryTime` datetime DEFAULT NULL,
  `totalAmount` decimal(10,2) DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_number` (`order_number`)
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shops` (
  `shop_id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_name` varchar(255) NOT NULL,
  `shop_image` varchar(255) DEFAULT NULL,
  `cate_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone_number` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) NOT NULL,
  PRIMARY KEY (`shop_id`),
  KEY `fk_category` (`cate_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`cate_id`) REFERENCES `categories` (`cate_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (11,'ไข่เจียวมาแล้วจ้า','/images/ไข่เจียวร้าน.jpg',2,'2025-02-21 12:30:36','0867861410','$2b$10$mf2mVdiCZEcRJ304YbldTe13TuJvpASgNa3.Jf2vCY8r4QyZ3q0gK','/images/qไข่เจียว.jpg','อำพร  อมาตยกุล'),(12,'ข้าวขาหมูซิ่ง','/images/ข้าวขาหมูซิ่ง.jpg',2,'2025-02-21 12:30:36','0864792239','$2b$10$7mc6bvKrHFLG/W1SFJaf.Oj4uUz7XMCef1TYYBSV9CdJ5zKpX32Ma','/images/qขาหมู.jpg','วศุธน  เรืองขนาน'),(13,'ราดหน้ายอดผัก','/images/ร้านราดหน้า.jpg',1,'2025-02-21 12:30:36','0892565069','$2b$10$HJreFtWGzeTlkHKkYtUBZuxxQvookU9AEYKXpSTHsaeIRf9o42ZBq','/images/qราดหน้า.jpg','อัจจิมา ทองสง่า'),(14,'คุณหนุ่ย','/images/คุณหนุ่ย.jpg',3,'2025-02-21 12:30:36','0840530287','$2b$10$5JCMhUmK4jyC5Tf2siKK2eMzyAY71SYzqYuqbMF7Ryt9TH3P8tzWy','/images/qร้านน้ำ.jpg','ปรางทิพย์  เงยยถิระกุล'),(15,'ไก่แซ่บมุฟลีฮุน','/images/ร้านไก่แซ่บ.jpg',4,'2025-02-21 12:30:36','0612293033','$2b$10$YMxsASNpqP8UAyaSN/mb/u7Koih94oSjv4bZ//h4rrpik0nDzq0i.','/images/qไก่แก้.png','ฮามีดี  มามะ'),(16,'พ่อกับแม่','/images/ร้านพ่อกับแม่.jpg',5,'2025-02-21 12:30:36','0988613140','$2b$10$0KduwPxMS1gc1k7rJQI4ReQxYV3rjD0Omq2cm9Ghq27NtekfvZoQC','/images/qพ่อ.jpg','ธรรญธร  บุณยรัตน์'),(17,'ป้าน้อย','/images/ร้านป้าน้อย.jpg',1,'2025-02-21 12:30:36','0802489847','$2b$10$o435lEw86HQTfH8gS6LRNOyaQtpnqv8Gt9Pxx6OjnjO/huD62RHwq','/images/qป้าน้อย.jpg','อรสา บุญอภัย'),(18,'ทาดังโกะ','/images/ทาดังโงะ.webp',4,'2025-02-21 12:30:36','0937608703','$2b$10$OB4bsNgMCPeXFjM7/5J6J.OfOweDMIphFFs6iwhHV9tD255gbOv5u','/images/qทาโก.jpg','กฤตนัย เชิดชูพันธ์เสรี'),(19,'พี่กันต์ชาชีส','/images/พี่กันต์.webp',3,'2025-02-21 12:30:36','09086554027','$2b$10$ZLrsdpV982MINgDvlHH0CejeLNAAKYAqvA1FiHiG48EumyqcUpwHe','/images/qกัน.jpg','ธัญญาลักษณ์  ลอยประเสริฐ'),(20,'ครัวตุ๊กกี้','/images/ร้านครัวตุ๊ก.jpg',5,'2025-02-21 12:30:36','0815377436','$2b$10$lT3AkGzI44PaAMS46p/b5OonOPYWw8iNhM2cXli5vM4xv9zOcs46u','/images/qตุ๊ก.jpg','พรรณ์ชนกย์  เสือมีศีล');
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) DEFAULT 'user',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (66,'นาายายมส','$2b$10$2kGi52gzEpJbeN08F2vdWOSKHhQCNjh98scbymeSCbn6glhcY8MuG','0852369588','2025-01-28 21:37:37','user',NULL),(67,'ทดสอบแปด','$2b$10$iy2CC1oP4LAt2WesSvPgTuIzE11AuPaqSQtHP4ApqixwcTAs33khW','0800800080','2025-01-28 21:50:15','user',NULL),(68,'สอบคนแรก','$2b$10$..Xj/ycPihqxoiPFgwuJguKykYqR2fKXgxCgWfjUwrRP/2WrxAdW.','0852396208','2025-01-29 05:42:59','user',NULL),(69,'ทดสอบ','$2b$10$nB5ktYpOdt/ft.cWGO23D.AggzmGMfPLvLK7CzDcome1XJQDaL9oe','0810810811','2025-01-29 07:22:58','user',NULL),(70,'ช่าเอง','$2b$10$ZyFsWh9GFnj17GcqX0dkE.DL3J7Q.XBg7UgCjbeYuIwzFOPzCek/a','0652396208','2025-02-04 19:40:44','user',NULL),(71,'saa','$2b$10$3C4k7aqdAAjhSy9d5gf8kuqOvj4bF4RzULCweh0RDQ1PkqVPRBzhm','0101000001','2025-02-06 06:05:10','user',NULL),(72,'นาอิ','$2b$10$IivQmTuh2wat5E77.OrJxuZuCWpcWOVcHM47cc1.dWn0EYn12QKCi','0123456789','2025-02-11 02:12:32','user',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-25 14:44:50
