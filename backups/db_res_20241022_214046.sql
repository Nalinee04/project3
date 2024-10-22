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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_history`
--

DROP TABLE IF EXISTS `order_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderhistory_id` varchar(255) NOT NULL,
  `order_number` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `delivery_time` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `is_rainy` tinyint(1) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_history`
--

LOCK TABLES `order_history` WRITE;
/*!40000 ALTER TABLE `order_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=514 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (311,95,'Espresso',55.00,2,'/images/Espresso.jpg'),(312,95,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(313,95,'Americano',60.00,2,'/images/americano.jpg'),(314,95,'Mocha',70.00,1,'/images/mocha.jpg'),(315,96,'Espresso',55.00,2,'/images/Espresso.jpg'),(316,96,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(317,96,'Americano',60.00,2,'/images/americano.jpg'),(318,96,'Mocha',70.00,1,'/images/mocha.jpg'),(319,97,'Espresso',55.00,2,'/images/Espresso.jpg'),(320,97,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(321,97,'Americano',60.00,2,'/images/americano.jpg'),(322,97,'Mocha',70.00,1,'/images/mocha.jpg'),(323,98,'Espresso',55.00,2,'/images/Espresso.jpg'),(324,98,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(325,98,'Americano',60.00,2,'/images/americano.jpg'),(326,98,'Mocha',70.00,1,'/images/mocha.jpg'),(327,99,'Espresso',55.00,2,'/images/Espresso.jpg'),(328,99,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(329,99,'Americano',60.00,2,'/images/americano.jpg'),(330,99,'Mocha',70.00,1,'/images/mocha.jpg'),(331,100,'Espresso',55.00,2,'/images/Espresso.jpg'),(332,100,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(333,100,'Americano',60.00,2,'/images/americano.jpg'),(334,100,'Mocha',70.00,1,'/images/mocha.jpg'),(335,101,'Espresso',55.00,2,'/images/Espresso.jpg'),(336,101,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(337,101,'Americano',60.00,2,'/images/americano.jpg'),(338,101,'Mocha',70.00,1,'/images/mocha.jpg'),(339,102,'Espresso',55.00,1,'/images/Espresso.jpg'),(340,102,'Mocha',70.00,1,'/images/mocha.jpg'),(341,102,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(342,102,'Americano',60.00,1,'/images/americano.jpg'),(343,102,'Cold Brew',75.00,1,'/images/Cold Brew.jpg'),(344,102,'Latte',65.00,1,'/images/Latte.jpg'),(345,103,'Espresso',55.00,1,'/images/Espresso.jpg'),(346,103,'Mocha',70.00,1,'/images/mocha.jpg'),(347,103,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(371,111,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(372,111,'Americano',60.00,1,'/images/americano.jpg'),(373,111,'Espresso',55.00,1,'/images/Espresso.jpg'),(374,112,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(375,112,'Americano',60.00,1,'/images/americano.jpg'),(376,112,'Espresso',55.00,1,'/images/Espresso.jpg'),(377,113,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(378,113,'Americano',60.00,1,'/images/americano.jpg'),(379,113,'Espresso',55.00,1,'/images/Espresso.jpg'),(380,114,'Mocha',70.00,1,'/images/mocha.jpg'),(381,114,'Espresso',55.00,1,'/images/Espresso.jpg'),(382,114,'Affogato',90.00,1,'/images/Affogato.webp'),(383,115,'Mocha',70.00,1,'/images/mocha.jpg'),(384,115,'Espresso',55.00,1,'/images/Espresso.jpg'),(385,115,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(386,115,'Americano',60.00,1,'/images/americano.jpg'),(387,116,'Mocha',70.00,1,'/images/mocha.jpg'),(388,116,'Espresso',55.00,1,'/images/Espresso.jpg'),(389,116,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(390,116,'Americano',60.00,1,'/images/americano.jpg'),(391,117,'Mocha',70.00,1,'/images/mocha.jpg'),(392,117,'Espresso',55.00,1,'/images/Espresso.jpg'),(393,117,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(394,117,'Americano',60.00,1,'/images/americano.jpg'),(414,123,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(415,123,'Espresso',55.00,1,'/images/Espresso.jpg'),(416,123,'Mocha',70.00,1,'/images/mocha.jpg'),(417,124,'Espresso',55.00,1,'/images/Espresso.jpg'),(418,124,'Mocha',70.00,1,'/images/mocha.jpg'),(419,125,'Espresso',55.00,1,'/images/Espresso.jpg'),(420,125,'Mocha',70.00,1,'/images/mocha.jpg'),(421,126,'Espresso',55.00,1,'/images/Espresso.jpg'),(422,126,'Mocha',70.00,1,'/images/mocha.jpg'),(423,127,'Espresso',55.00,1,'/images/Espresso.jpg'),(424,127,'Mocha',70.00,1,'/images/mocha.jpg'),(425,128,'Espresso',55.00,1,'/images/Espresso.jpg'),(426,128,'Mocha',70.00,1,'/images/mocha.jpg'),(427,129,'Espresso',55.00,1,'/images/Espresso.jpg'),(428,129,'Mocha',70.00,1,'/images/mocha.jpg'),(429,130,'Espresso',55.00,1,'/images/Espresso.jpg'),(430,130,'Mocha',70.00,1,'/images/mocha.jpg'),(431,131,'Espresso',60.00,1,'/images/Espresso.jpg'),(432,131,'Mocha',170.00,1,'/images/mocha.jpg'),(433,132,'Cappuccino',65.00,4,'/images/capuccino.jpg.jpeg'),(434,132,'Espresso',55.00,6,'/images/Espresso.jpg'),(435,132,'Mocha',70.00,8,'/images/mocha.jpg'),(436,133,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(437,133,'Espresso',55.00,2,'/images/Espresso.jpg'),(438,133,'Mocha',70.00,2,'/images/mocha.jpg'),(439,134,'Espresso',55.00,1,'/images/Espresso.jpg'),(440,134,'Mocha',70.00,1,'/images/mocha.jpg'),(441,134,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(442,135,'Espresso',55.00,1,'/images/Espresso.jpg'),(443,135,'Mocha',70.00,1,'/images/mocha.jpg'),(444,135,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(445,135,'Americano',60.00,1,'/images/americano.jpg'),(446,135,'Caramel Macchiato',80.00,1,'/images/Caramel Macchiato.jpg'),(447,136,'Espresso',55.00,2,'/images/Espresso.jpg'),(448,136,'Americano',60.00,1,'/images/americano.jpg'),(449,136,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(450,136,'Mocha',70.00,1,'/images/mocha.jpg'),(451,136,'Latte',65.00,1,'/images/Latte.jpg'),(452,136,'Cold Brew',75.00,1,'/images/Cold Brew.jpg'),(453,137,'Espresso',55.00,1,'/images/Espresso.jpg'),(454,137,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(455,138,'Espresso',55.00,2,'/images/Espresso.jpg'),(456,138,'Cappuccino',65.00,2,'/images/capuccino.jpg.jpeg'),(457,138,'Mocha',70.00,1,'/images/mocha.jpg'),(458,138,'Americano',60.00,1,'/images/americano.jpg'),(459,138,'Latte',65.00,1,'/images/Latte.jpg'),(460,138,'Cold Brew',75.00,1,'/images/Cold Brew.jpg'),(461,138,'Caramel Macchiato',80.00,1,'/images/Caramel Macchiato.jpg'),(462,138,'Affogato',90.00,1,'/images/Affogato.webp'),(463,138,'Virgin Mojito',120.00,2,'/images/Virgin Mojito.jpg'),(464,138,'Shirley Temple',110.00,1,'/images/Shirley Temple.jpg'),(465,139,'Espresso',55.00,2,'/images/Espresso.jpg'),(466,139,'Mocha',70.00,2,'/images/mocha.jpg'),(467,139,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(468,139,'Americano',60.00,1,'/images/americano.jpg'),(469,139,'Latte',65.00,1,'/images/Latte.jpg'),(470,139,'Cold Brew',75.00,1,'/images/Cold Brew.jpg'),(471,139,'Caramel Macchiato',80.00,1,'/images/Caramel Macchiato.jpg'),(472,139,'Affogato',90.00,1,'/images/Affogato.webp'),(473,140,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(474,140,'Espresso',55.00,1,'/images/Espresso.jpg'),(475,140,'Mocha',70.00,1,'/images/mocha.jpg'),(476,141,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(477,141,'Espresso',55.00,1,'/images/Espresso.jpg'),(478,142,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(479,142,'Espresso',55.00,1,'/images/Espresso.jpg'),(480,142,'Mocha',70.00,1,'/images/mocha.jpg'),(481,143,'Mocha',70.00,1,'/images/mocha.jpg'),(482,144,'Mocha',70.00,1,'/images/mocha.jpg'),(483,144,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(484,144,'Espresso',55.00,1,'/images/Espresso.jpg'),(485,145,'Berry Bliss',150.00,1,'/images/berry.avif'),(486,145,'Tropical Twist',140.00,1,'/images/Tropical Twist.webp'),(487,145,'Sunrise Surprise',130.00,1,'/images/Sunrise Surprise.jpg'),(488,145,'กะเพราหมึกไข่',120.00,1,'/images/กะเพราหมึกไข่.jpg'),(489,145,'Caramel Macchiato',80.00,1,'/images/Caramel Macchiato.jpg'),(490,145,'Affogato',90.00,1,'/images/Affogato.webp'),(491,146,'Berry Bliss',150.00,1,'/images/berry.avif'),(492,146,'Tropical Twist',140.00,1,'/images/Tropical Twist.webp'),(493,146,'Sunrise Surprise',130.00,1,'/images/Sunrise Surprise.jpg'),(494,146,'กะเพราหมึกไข่',120.00,1,'/images/กะเพราหมึกไข่.jpg'),(495,146,'Caramel Macchiato',80.00,1,'/images/Caramel Macchiato.jpg'),(496,146,'Affogato',90.00,1,'/images/Affogato.webp'),(497,147,'Berry Bliss',150.00,1,'/images/berry.avif'),(498,147,'Tropical Twist',140.00,1,'/images/Tropical Twist.webp'),(499,147,'Sunrise Surprise',130.00,1,'/images/Sunrise Surprise.jpg'),(500,147,'กะเพราหมึกไข่',120.00,1,'/images/กะเพราหมึกไข่.jpg'),(501,147,'Caramel Macchiato',80.00,1,'/images/Caramel Macchiato.jpg'),(502,147,'Affogato',90.00,1,'/images/Affogato.webp'),(503,148,'ข้าวกะเพรากุ้ง',130.00,2,'/images/กะเพรากุ้ง.jpg'),(504,148,'พาสต้าเบค่อน',130.00,1,'/images/พาสต้าเบค่อน.webp'),(505,148,'พาสต้าเพสโต้',140.00,1,'/images/เพลโต้.webp'),(506,149,'Espresso',55.00,1,'/images/Espresso.jpg'),(507,149,'Mocha',70.00,1,'/images/mocha.jpg'),(508,150,'Espresso',55.00,2,'/images/Espresso.jpg'),(509,150,'Mocha',70.00,2,'/images/mocha.jpg'),(510,150,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(511,151,'Cappuccino',65.00,1,'/images/capuccino.jpg.jpeg'),(512,151,'Espresso',55.00,1,'/images/Espresso.jpg'),(513,151,'Mocha',70.00,1,'/images/mocha.jpg');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
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
  `shipping_address` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL COMMENT 'Pending,Shipping,Prepare,Completed',
  `is_rainy` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deliveryTime` datetime DEFAULT NULL,
  `totalAmount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_number` (`order_number`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (95,'Task-1729406459409','user10ii','จ.สุราษฎร์ธานี อ.ท่าชนะ ต.ประสงค์ 84170,','Completed',0,'2024-10-20 06:40:59','2024-10-22 11:13:16',430.00),(96,'Task-1729406486380','user10ii','จ.สุราษฎร์ธานี อ.ท่าชนะ ต.ท่าชนะ 84170, 24','Completed',0,'2024-10-20 06:41:26','2024-10-22 11:13:17',430.00),(97,'Task-1729406530481','user10ii','จ.สุราษฎร์ธานี อ.ท่าชนะ ต.ท่าชนะ 84170, 24','Completed',0,'2024-10-20 06:42:10','2024-10-22 11:59:53',430.00),(98,'Task-1729406927821','user10ii','จ.สุราษฎร์ธานี อ.ท่าชนะ ต.ประสงค์ 84170, 241','Completed',0,'2024-10-20 06:48:47','2024-10-22 13:23:28',430.00),(99,'Task-1729406953173','user10ii','จ.สุราษฎร์ธานี อ.พุนพิน ต.มะลวน 84130,','Completed',0,'2024-10-20 06:49:13','2024-10-22 13:25:16',430.00),(100,'Task-1729411989538','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100, อาคาร2','Completed',0,'2024-10-20 08:13:09','2024-10-22 13:25:18',430.00),(101,'Task-1729412269560','user10ii','จ.สุราษฎร์ธานี อ.ท่าชนะ ต.คันธุลี 84170,','Completed',0,'2024-10-20 08:17:49','2024-10-22 13:25:18',430.00),(102,'Task-1729412362023','user10ii','จ.ระนอง อ.สุขสำราญ ต.นาคา 85120,','Completed',0,'2024-10-20 08:19:22','2024-10-22 13:25:19',390.00),(103,'Task-1729423512836','user10ii','จ.สุราษฎร์ธานี อ.บ้านตาขุน ต.พะแสง 84230, 244','Completed',0,'2024-10-20 11:25:12','2024-10-22 13:25:20',190.00),(111,'Task-1729479847562','user10ii','จ.สุราษฎร์ธานี อ.กาญจนดิษฐ์ ต.ป่าร่อน 84160, (((','Completed',0,'2024-10-21 03:04:07','2024-10-22 13:25:21',180.00),(112,'Task-1729479860138','user10ii','จ.สุราษฎร์ธานี อ.กาญจนดิษฐ์ ต.ป่าร่อน 84160,','Completed',0,'2024-10-21 03:04:20','2024-10-22 20:09:46',180.00),(113,'Task-1729479905034','user10ii','Sumatra South Sumatra Banyuasin รหัสไปรษณีย์ไม่ระบุ,','Completed',0,'2024-10-21 03:05:05','2024-10-22 20:09:55',180.00),(114,'Task-1729489276796','user10ii','จ.สุราษฎร์ธานี อ.กาญจนดิษฐ์ ต.ป่าร่อน 84160, qw','Pending',0,'2024-10-21 05:41:16','2024-10-22 12:08:36',215.00),(115,'Task-1729491257903','user10ii','จ.สุราษฎร์ธานี อ.กาญจนดิษฐ์ ต.ป่าร่อน 84160, อาคาร24','Completed',0,'2024-10-21 06:14:17','2024-10-22 20:17:51',250.00),(116,'Task-1729491276917','user10ii','จ.สุราษฎร์ธานี อ.กาญจนดิษฐ์ ต.ป่าร่อน 84160, ไำไำ','Completed',0,'2024-10-21 06:14:36','2024-10-22 20:11:46',250.00),(117,'Task-1729494975477','user10ii','จ.สุราษฎร์ธานี อ.กาญจนดิษฐ์ ต.ป่าร่อน 84160,','Completed',0,'2024-10-21 07:16:15','2024-10-22 20:19:06',250.00),(123,'Task-1729512226345','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100, 121','Pending',0,'2024-10-21 12:03:46','2024-10-22 13:02:35',190.00),(124,'Task-1729515988091','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100, 21','Pending',0,'2024-10-21 13:06:28','2024-10-22 13:02:38',125.00),(125,'Task-1729516037992','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100, 23','Pending',0,'2024-10-21 13:07:18','2024-10-22 13:02:39',125.00),(126,'Task-1729518642470','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 13:50:42','2024-10-22 13:02:40',125.00),(127,'Task-1729518749379','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 13:52:29','2024-10-22 13:07:07',125.00),(128,'Task-1729518784392','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 13:53:04','2024-10-22 13:20:51',125.00),(129,'Task-1729518846162','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 13:54:06','2024-10-22 13:07:20',125.00),(130,'Task-1729520354593','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 14:19:14','2024-10-22 13:07:23',125.00),(131,'Task-1729524214343','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 15:23:34','2024-10-22 13:20:53',230.00),(132,'Task-1729524790808','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 15:33:10','2024-10-22 13:20:54',1150.00),(133,'Task-1729524889581','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 15:34:49','2024-10-22 13:20:54',315.00),(134,'Task-1729526071197','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 15:54:31','2024-10-22 13:20:55',190.00),(135,'Task-1729526189696','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 15:56:29','2024-10-22 13:20:56',330.00),(136,'Task-1729528655771','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Pending',0,'2024-10-21 16:37:35','2024-10-22 13:20:56',510.00),(137,'Task-1729530569279','cha','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Completed',0,'2024-10-21 17:09:29','2024-10-22 13:25:27',120.00),(138,'Task-1729539061572','cha','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ขุนทะเล 84100,','Completed',0,'2024-10-21 19:31:01','2024-10-22 13:25:25',1030.00),(139,'Task-1729563973610','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ตลาด 84000,','Completed',0,'2024-10-22 02:26:13','2024-10-22 13:25:25',685.00),(140,'Task-1729566817950','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ตลาด 84000, หห','Completed',0,'2024-10-22 03:13:37','2024-10-22 13:25:24',190.00),(141,'Task-1729567511152','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ตลาด 84000,','Completed',0,'2024-10-22 03:25:11','2024-10-22 13:25:24',120.00),(142,'Task-1729569237854','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ตลาด 84000,','Completed',0,'2024-10-22 03:53:57','2024-10-22 13:23:35',190.00),(143,'Task-1729578448221','user10ii','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ตลาด 84000,','Pending',0,'2024-10-22 06:27:28',NULL,70.00),(144,'Task-1729578562232','user10ii','จ.สุราษฎร์ธานี อ.ท่าฉาง ต.ปากฉลุย 84150,','Pending',0,'2024-10-22 06:29:22',NULL,190.00),(145,'Task-1729592857444','test','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ตลาด 84000,','Completed',0,'2024-10-22 10:27:37','2024-10-22 17:28:40',710.00),(146,'Task-1729592972498','test','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.บางใบไม้ 84000, 240','Pending',0,'2024-10-22 10:29:32',NULL,710.00),(147,'Task-1729593825098','test','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ตลาด 84000,','Pending',1,'2024-10-22 10:43:45',NULL,710.00),(148,'Task-1729594186835','peetredw','จ.สุราษฎร์ธานี อ.เมืองสุราษฎร์ธานี ต.ตลาด 84000, ซอย1 ตึก4','Completed',0,'2024-10-22 10:49:46','2024-10-22 17:50:30',530.00),(149,'Task-1729594300766','peetredw','จ.ชุมพร อ.สวี ต.เขาทะลุ 86130, อาคาร2','Pending',0,'2024-10-22 10:51:40',NULL,125.00),(150,'Task-1729602564680','peetredw','จ.สุราษฎร์ธานี อ.กาญจนดิษฐ์ ต.ท่าอุแท 84160,','Completed',0,'2024-10-22 13:09:24','2024-10-22 20:12:24',315.00),(151,'Task-1729603596051','peetredw','จ.สุราษฎร์ธานี อ.กาญจนดิษฐ์ ต.ท่าอุแท 84160,','Pending',0,'2024-10-22 13:26:36',NULL,190.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) DEFAULT 'user',
  `address` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'newUsername','newEmail@example.com','$2a$10$3ZaHMXKhz6r89Jy.1PELie.BWlubXzzER0PAhb.3KYrUfVHQNCDmC','2024-10-01 05:33:34','user',NULL,NULL,NULL),(21,'user2','user2@gmail.com','$2a$10$g1G9b4PAof/spvZczMtcledtbmTCNj8DQg7QA7AhfAm2oYrgpVNtO','2024-10-01 05:57:53','user',NULL,NULL,NULL),(22,'user3','user3@gmail.com','$2a$10$LRQ2zyAABLoWlpf3XD9ra.KIFgsEVwcJbSi8UEh9tg6tlgXrB2mL2','2024-10-01 06:04:05','user',NULL,NULL,NULL),(23,'ีuser4ii','user4@gmail.com','$2a$10$1EEnNwQH7gjKCK/.IKrhieTU673.Iyebqs4XGnp8BFP6cxc9UdPz2','2024-10-01 06:08:36','user',NULL,'/Avatars/avataaars13.png',NULL),(26,'user5','user5@gmail.com','$2a$10$UCsHlqauZ8chkTY5FvQ52uiAO2C4boB1NdS7Y9DGyh8P8NPauVOTe','2024-10-01 06:10:32','user',NULL,NULL,NULL),(32,'user7','user7@gmail.com','$2a$10$mxm8Gpon3DyiV1n8PbdNC.Ps0qOpcRBxYu4O9FCzqwe3YZElsFQxK','2024-10-01 06:52:33','user',NULL,NULL,NULL),(34,'cha','cha@gmail.com','$2a$10$hDsK1F1qXEPQSc388NHnxu9xJ.ceUSRz4HMoQOZktgFl8N3BIwEBC','2024-10-01 07:08:50','admin',NULL,NULL,NULL),(35,'peem','peem@gmail.com','$2a$10$IruwEwDDErIwwFL2GqNy7egIaiS0We3y.NNYGZTJ0jLeMC4rQ/aNe','2024-10-01 07:12:39','user',NULL,NULL,NULL),(36,'admin','admin@gmail.com','$2a$10$fTbQ8X2cVxkzMqRLXFWfEO4HqtEVfvKkRz7TMRs8VDWjWT/BoAwsy','2024-10-01 07:57:06','admin',NULL,'/Avatars/avataaars13.png',NULL),(37,'user10ii','user10@gmail.com','$2a$10$eud8N0mwgzLtzExEvL/oG.ej1URT9FaU0SJC2kn.Bn0WwFAbX3EG.','2024-10-02 03:14:46','user',NULL,'/Avatars/avataaars13.png',NULL),(38,'user12','user12@gmail.com','$2a$10$M7NnpRFZaXz9r52uFqjbDuk.pND0QvLf4iFbgLPEE6OcjUCi1DRUi','2024-10-02 05:24:18','user',NULL,NULL,NULL),(43,'user21','user21@gmail.com','$2a$10$gG/nUD8VCmeSRuNl4H7tbedfsd.XabTR5N2BJIi2/CsCD60iFRBp.','2024-10-02 15:54:55','user',NULL,NULL,NULL),(44,'user19','user19@gmail.com','$2a$10$TJj0.2puRfMxPNEgWUrdFu9Vj/ewgHYNCtekjlC7pFLcXMcXQsaVi','2024-10-02 15:57:30','user',NULL,NULL,NULL),(46,'user24','user24@gmail.com','$2a$10$xqwHma/Jg5nNjxGfNQ80GOgrkfWYlbe12JfOaeVKuYn9tXUvsOVIu','2024-10-02 16:43:10','user',NULL,NULL,NULL),(47,'user25','user25@gmail.com','$2a$10$X0oD1GZnGQymWuHnkS1HdurQDq8R1jCHoT6xxry4gXQru5/fz/ZlW','2024-10-02 16:45:37','user',NULL,NULL,NULL),(49,'cha123','cha123@gmail.com','$2a$10$abLUm8cza6VOO9HTy7ucEeHvedPHPuoW8RHM.Xf.z94Kx8ClB3W0y','2024-10-08 02:40:09','user',NULL,NULL,NULL),(50,'new_username','new_email@example.com','$2a$10$Xs2sm9Aia99HjUw2GMJqHu60KkwYNt9b.ipuXNIfopjMm86UDFIFW','2024-10-08 09:43:43','user',NULL,'new_image_url',NULL),(51,'user45','user45@gmail.com','$2a$10$QF1Jn8FIITPv1Tkk7z.HIuhyEb5ID3pUosHdhRJ9KbJz3GaUKhme2','2024-10-08 09:48:48','user',NULL,NULL,NULL),(52,'user52','user52@gmail.com','$2a$10$jESkvGXGIP6Ij.7SRIFoFOQrOcBbeQ.yZh6bd3CSLZfarzbaDzMhi','2024-10-08 09:50:05','user',NULL,NULL,NULL),(53,'cha1111','cha1111@gmail.com','$2a$10$YulLpmc6LMYJrw.18.v4Se9CMkAW2x.DSx4NpK3tsNgDjWnnkhaie','2024-10-11 02:44:50','user',NULL,NULL,NULL),(54,'Domemyhoney','Dome@gmail.com','$2a$10$W0feirPfMB.qM0kOe0VyoeU.stYwabMkSjCjU0i7UDyEzjz7V1SzW','2024-10-13 03:37:11','user',NULL,NULL,NULL),(55,'Cha1234','Cha1234@gmail.com','$2a$10$GinykXJkbESX8fihmOKMr.w.r6HpLj80l6PSKyurD0rnD1oroVgeu','2024-10-13 03:42:15','user',NULL,NULL,NULL),(56,'chaluv','chaluv@gmail.com','$2a$10$QqfboLYxawX3nteWsJ67/..trZU171AL.axBgDPtde8I.XlEMzdzu','2024-10-13 03:46:08','user',NULL,NULL,NULL),(57,'cha04','6304305001042@student.sru.ac.th','$2a$10$cVd0iJ7B1r8/Lacnk3as0uByyopYndmoycwNdemGNwlGXMYOVbUvO','2024-10-20 08:44:37','user',NULL,NULL,NULL),(58,'buddy','buddyfluezy@gmail.com','$2a$10$YmS1.woCQD7F3aqKadsCyOSlfoRbm.DM7G3veMA1BbSy4y7pmLzBC','2024-10-20 11:11:37','user',NULL,NULL,NULL),(59,'peemza','peemza@gmail.com','$2a$10$oRB4Qy6yPXST6FIixhM1XuqdoLRoadDEanFUqaddo2uMVMmKvblzO','2024-10-21 04:22:02','user',NULL,NULL,NULL),(60,'peemza123','gamermantvv1@gmail.com','$2a$10$FG.OeUP017xD6qn9LCeI/.jzED8u1x6uWPNO3YIWQIejrg3Hn00a6','2024-10-21 04:22:31','user',NULL,NULL,NULL),(61,'test','test@gmail.com','$2a$10$d/h3op6sLsj.NxL3Ms7AWuOxAZvbku6d2MoV0f558s.Nr08Fr1DYK','2024-10-22 10:23:58','user',NULL,NULL,NULL),(62,'peetredw','peetredw@gmail.com','$2a$10$NihXfb9NwsfEq7NWMFP7OOsFbTG8PUaTXsSDzJEH/u9cupK9dQYTK','2024-10-22 10:46:18','user',NULL,'/Avatars/avataaars2.png',NULL);
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

-- Dump completed on 2024-10-22 21:40:46
