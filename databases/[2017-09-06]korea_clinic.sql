-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 103.68.68.151    Database: khoanguyen_clinic
-- ------------------------------------------------------
-- Server version	5.5.57

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_id` int(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,1,'2','3','0000-00-00','00:00:03','active',NULL,NULL,NULL,NULL,NULL,NULL),(2,2,'test321','test','1970-01-01',NULL,'active','2017-08-25 23:17:45',NULL,'2017-08-25 23:26:12',NULL,NULL,NULL);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language_code` varchar(2) NOT NULL DEFAULT 'en',
  `item_key` varchar(150) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `content` longtext,
  `image` text,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (1,'vi','150368069482022','test 1','<p>test description 001</p>','<p>test content 001</p>','{\"filename\":\"White Clinic logo-06.png\",\"filepath\":\"20170905\\/White_Clinic_logo_06_1504580217175.png\"}','active','2017-08-25 23:54:44',NULL,'2017-09-05 09:56:57',NULL,NULL,NULL),(2,'vi','150368068748258','test title 002','test description 002','test content 002',NULL,'active','2017-08-25 23:54:48',NULL,'2017-08-29 09:02:08',NULL,NULL,NULL),(3,'en','150368068748258','test title 001','test description 001','test content 001',NULL,'active','2017-08-26 00:04:47',NULL,NULL,NULL,NULL,NULL),(4,'en','150368069482022','test 2','test description 001','test content 001',NULL,'active','2017-08-26 00:04:54',NULL,'2017-08-30 16:18:25',NULL,NULL,NULL),(5,'en','150389431858215','test title 001','test description 001','test content 001',NULL,'delete','2017-08-28 11:25:19',NULL,'2017-08-28 13:55:15',NULL,NULL,NULL),(6,'en','150390473958429','Angular Material Layout','test','test',NULL,'active','2017-08-28 14:18:59',NULL,NULL,NULL,NULL,NULL),(7,'vi','150400117417389','Dem kinh hoang, ngay mat mat','<p>Superman qua doi</p>','<p>Superman qua doi</p>',NULL,'delete','2017-08-29 17:06:14',NULL,'2017-08-30 16:13:39',NULL,NULL,NULL),(8,'en','150400117417389','Night of terror morning of loss','<p>Superman dead</p>','<p>Superman dead</p>',NULL,'delete','2017-08-29 17:06:14',NULL,'2017-08-30 16:13:39',NULL,NULL,NULL),(9,'vi','150406493192831','Angular Material Layout vietnam','<p>test</p>','<p>test</p>',NULL,'active','2017-08-30 10:48:52',NULL,NULL,NULL,NULL,NULL),(10,'en','150406493192831','Angular Material Layout english','<p>test</p>','<p>test</p>',NULL,'active','2017-08-30 10:48:52',NULL,NULL,NULL,NULL,NULL),(11,'vi','150400117477145','Huong dan hoc Angular 2','<p>Chuong trinh gom 22 chuong</p>','<p>Chuong trinh gom 22 chuong</p>',NULL,'delete','2017-08-30 11:00:31',NULL,'2017-08-30 16:00:06',NULL,NULL,NULL),(12,'en','150400117477145','guide to learn Angular 2','<p>This exam is about 22&nbsp;lessons</p>','<p>This exam is about 22&nbsp;lessons</p>',NULL,'delete','2017-08-30 11:00:31',NULL,'2017-08-30 16:00:06',NULL,NULL,NULL),(13,'vi','150406493120621','Dem king hoang ngay mat mat','<p>Superman da qua doi!</p>','<p>Superman da qua doi!</p>','{\"filename\":\"amount.jpg\",\"filepath\":\"20170905\\/amount_1504576145304.jpg\"}','active','2017-08-30 11:38:48',NULL,'2017-09-05 08:49:05',NULL,NULL,NULL),(14,'en','150406493120621','Night of terror morning of loss','<p>Superman dead!</p>','<p>Superman dead!</p>','{\"filename\":\"amount.jpg\",\"filepath\":\"20170905\\/amount_1504576181877.jpg\"}','active','2017-08-30 11:38:48',NULL,'2017-09-05 08:49:41',NULL,NULL,NULL);
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language_code` char(2) NOT NULL DEFAULT 'en',
  `item_key` varchar(150) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `description` text,
  `content` longtext,
  `image` text,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,'en','150368100632711','test title 001',NULL,'test description 001','test content 001',NULL,'active','2017-08-26 00:10:06',NULL,NULL,NULL,NULL,NULL),(2,'en','15036810189984','test title 001',NULL,'test description 001','test content 001',NULL,'active','2017-08-26 00:10:18',NULL,NULL,NULL,NULL,NULL),(3,'vi','1504669551658','[VN]test title 001',NULL,'<p>[VN]test description 001</p>','<p>[VN]test content 001</p>',NULL,'active','2017-09-06 10:45:51',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `image` text,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` VALUES (1,'test title 001','test description 001',NULL,'active','2017-08-26 00:17:36',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `news_category_id` int(11) NOT NULL,
  `language_code` char(2) NOT NULL DEFAULT 'en',
  `item_key` varchar(150) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `content` longtext,
  `image` text,
  `date` datetime DEFAULT NULL,
  `feature_flag` tinyint(4) DEFAULT '0' COMMENT '0: normal | 1: special',
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (49,1,'en','150368211947091','test title 001','test description 001','test content 001',NULL,NULL,0,'active','2017-08-26 00:28:39',NULL,NULL,NULL,NULL,NULL),(50,1,'en','150368223486012','test title 001','test description 001','test content 001',NULL,'2017-08-26 00:30:34',0,'active','2017-08-26 00:30:34',NULL,NULL,NULL,NULL,NULL),(51,1,'en','150368280478856','test title 001','test description 001','test content 001',NULL,NULL,0,'active','2017-08-26 00:40:04',NULL,NULL,NULL,NULL,NULL),(52,1,'en','150368281482987','test title 001','test description 001','test content 001',NULL,NULL,0,'active','2017-08-26 00:40:14',NULL,NULL,NULL,NULL,NULL),(53,1,'en','150368284054382','test title 001','test description 001','test content 001',NULL,NULL,0,'active','2017-08-26 00:40:40',NULL,NULL,NULL,NULL,NULL),(54,1,'en','150368289510714','test title 001','test description 001','test content 001',NULL,'2017-09-05 08:43:49',0,'active','2017-08-26 00:41:35',NULL,'2017-09-05 08:43:49',NULL,NULL,NULL);
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_category`
--

DROP TABLE IF EXISTS `news_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_key` varchar(150) DEFAULT NULL,
  `language_code` char(2) DEFAULT 'en',
  `title` varchar(150) DEFAULT NULL,
  `description` text,
  `parent` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_category`
--

LOCK TABLES `news_category` WRITE;
/*!40000 ALTER TABLE `news_category` DISABLE KEYS */;
INSERT INTO `news_category` VALUES (1,'150368301072915','vi','123','test description 001',0,1,'active','2017-08-26 00:43:30',NULL,'2017-09-01 09:04:02',NULL,NULL,NULL),(2,'150368313844401','vi','test title 001','test description 001',0,1,'active','2017-08-26 00:45:38',NULL,NULL,NULL,NULL,NULL),(3,'150368314713331','vi','test title 001','test description 001',2,2,'active','2017-08-26 00:45:47',NULL,NULL,NULL,NULL,NULL),(4,'150368315983084','vi','test title 001','test description 001',2,2,'active','2017-08-26 00:45:59',NULL,NULL,NULL,NULL,NULL),(5,'150368316845220','vi','test title 001','<p>test description 001</p>',4,3,'active','2017-08-26 00:46:08',NULL,'2017-09-01 09:42:37',NULL,NULL,NULL),(6,'150368412222304','vi','test title 001','test description 001',3,3,'active','2017-08-26 01:02:02',NULL,NULL,NULL,NULL,NULL),(7,'150406508449272','vi','test title 001','test description 001',3,3,'active','2017-08-30 10:51:24',NULL,NULL,NULL,NULL,NULL),(8,'150368301072915','vi','12',NULL,0,1,'active','2017-09-01 08:57:08',NULL,'2017-09-01 09:04:25',NULL,NULL,NULL),(9,'150423212048480','vi','456e2vi',NULL,1,2,'active','2017-09-01 09:15:27',NULL,'2017-09-01 09:22:57',NULL,NULL,NULL),(10,'150423212048480','en','234e14en',NULL,1,2,'active','2017-09-01 09:15:27',NULL,'2017-09-01 09:22:57',NULL,NULL,NULL),(11,'150423300165588','en','test en',NULL,0,1,'active','2017-09-01 09:30:13',NULL,NULL,NULL,NULL,NULL),(12,'150423300165588','vi','test vi',NULL,0,1,'active','2017-09-01 09:30:13',NULL,NULL,NULL,NULL,NULL),(13,'150368313844401','en','ee',NULL,0,1,'active','2017-09-01 09:32:17',NULL,NULL,NULL,NULL,NULL),(14,'150368316845220','en','e',NULL,0,1,'active','2017-09-01 09:42:37',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `news_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_category_id` int(11) NOT NULL,
  `language_code` varchar(2) NOT NULL DEFAULT 'en',
  `item_key` varchar(150) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `content` longtext,
  `image` text,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (1,0,'en',NULL,'Data processing','Upon the request of using the data from the clients, Vision Vietnam will design and manage the database efficiently, provide the clients the data source accurately and in time. Our company ensure the smooth operation of the data system, data protection, information security, backup and quick technical support.',NULL,'data-processing.jpg','active','2016-10-31 15:51:27',1,'2017-04-05 15:13:59',1,NULL,NULL),(2,0,'en',NULL,'Consulting the Solutions to Set up the System','With a young and dynamic workforce, Vietnam Vision can catch the clients\' demand and provide the automation solution for the complex and time-consuming jobs. Our company ensure the convenience and sufficient information in the operational processes and can help the enterprises manage the time fund and save the cost.',NULL,'system.jpg','active','2016-10-31 15:51:27',1,'2017-04-05 15:13:48',1,NULL,NULL),(3,0,'en',NULL,'BPO (Business Process Outsourcing)','To minimize the cost of operation and wasting time during management process of the enterprises, BPO is the best choice to ensure the maintenance control on their project become easiest. Vision Vietnam guarantees that the construction of new processes will be minimized the cost for enterprises.',NULL,'BPO.jpeg','active','2016-10-31 15:51:58',1,'2017-04-05 15:13:42',1,NULL,NULL),(4,0,'en',NULL,'Producing software','With experienced staffs in the IT sector, Vision Vietnam is confidents in our projects and assure the clients’ satisfaction for the software developed. The clients will approach and apply the lastest modern application software systems, security and integrity with the most competitive expense.',NULL,'1488181683_d93d9d90a7a5a557b191d9df87f80475.jpg','active','2016-11-01 09:06:00',1,'2017-04-05 15:13:34',1,NULL,NULL),(5,0,'ja',NULL,'データー処理','お客様からデーターを利用している要求に基づいて、ビジョンベトナムは最も能率的な方法にデザインし、データベースを管理し、お客様にタイミングと正確なデーターを供給します。ビジョンベトナムはシステムの動きが継続していることが保障を維持して、データーを守って、完全セキュリティ、バックアップと障害対応は迅速が出来ます。',NULL,'1488181683_d93d9d90a7a5a557b191d9df87f80475.jpg','active','2016-11-17 15:09:24',1,'2017-06-20 09:49:22',83,NULL,NULL),(6,0,'vi',NULL,'Sản xuất phần mềm','Với đội ngũ nhân viên có nhiều năm kinh nghiệm trong lĩnh vực CNTT, Vision Việt Nam tự tin trong các dự án của mình và đảm bảo sự hài lòng của khách hàng đối với các phần mềm được cung cấp theo yêu cầu. Khách hàng sẽ được tiếp cận, áp dụng các phần mềm với hệ thống ứng dụng hiện đại, bảo mật, toàn vẹn và chi phí cạnh tranh nhất.',NULL,'1488181683_d93d9d90a7a5a557b191d9df87f80475.jpg','active','2016-11-30 14:00:32',1,'2017-04-05 11:32:25',57,NULL,NULL),(7,0,'ja',NULL,'BPO (Business Process Outsourcing)','運用中のコストを最小限に抑えて、企業手順管理の為の時間を無駄にしないように、BPOは最良の選択でございます。それを得るため、BPOは自分たちのプロジェクトに対しての管理することを一番簡単になっております。ビジョンベトナムは対してコストを最小限に抑える設置したばかりの手順を確保いたします。',NULL,'BPO.jpeg','active','2017-02-27 17:38:01',1,'2017-06-20 09:50:23',83,NULL,NULL),(8,0,'ja',NULL,'システム設定方法についての顧問 ','ダイナミックな若者のおかげで、ビジョンベトナムはお客様の要求をつかむことができます。それに基づいて、時間のかかり、複雑なことは自動的になる為、お客様にいろんな方法を提出いたします。\r\n協力中に、営業を時間管理だけで、省コストもできることに手伝う為、我が社は利便性で、十分な情報を提供することを確保いたします。 ',NULL,'system.jpg','active','2017-02-27 17:38:19',1,'2017-06-20 10:38:57',83,NULL,NULL),(9,0,'ja',NULL,'データー処理','お客様からデーターを利用している要求に基づいて、ビジョンベトナムは最も能率的な方法にデザインし、データベースを管理し、お客様にタイミングと正確なデーターを供給します。ビジョンベトナムはシステムの動きが継続していることが保障を維持して、データーを守って、完全セキュリティ、バックアップと障害対応は迅速が出来ます。',NULL,'data-processing.jpg','active','2017-02-27 17:41:59',1,'2017-06-20 10:39:44',83,NULL,NULL),(10,0,'vi',NULL,'BPO (Business Process Outsourcing)','Để giảm thiểu các chi phí trong quá trình hoạt động và tránh lãng phí quỹ thời gian cho các quy trình quản lý của doanh nghiệp, BPO là sự lựa chọn tốt nhất để đảm bảo việc duy trì sự kiểm soát đối với các dự án của mình sao cho việc quản lý là dễ dàng nhất. Vision Việt Nam đảm bảo các quy trình mới được xây dựng sẽ giảm thiểu tối đa chi phí cho doanh nghiệp.',NULL,'BPO.jpeg','active','2017-04-05 11:33:28',57,NULL,NULL,NULL,NULL),(11,0,'vi',NULL,'Tư vấn giải pháp thiết lập hệ thống','Nhờ nguồn nhân lực trẻ và năng động, Vision Việt Nam có thể nắm bắt được nhu cầu của khách hàng và đưa ra các giải pháp nhằm \"tự động hóa\" hệ thống các công việc có tính chất phức tạp, tốn thời gian. Công ty đảm bảo sự tiện lợi và cung cấp đầy đủ thông tin trong quá trình hoạt động, giúp các doanh nghiệp có thể linh động trong việc quản lý quỹ thời gian và tiết kiệm chi phí.',NULL,'system.jpg','active','2017-04-05 11:34:47',57,'2017-04-05 15:13:48',1,NULL,NULL),(12,0,'vi','150368451028396','Xử lý dữ liệu','Theo yêu cầu sử dụng dữ liệu từ khách hàng, Vision Việt Nam sẽ thiết kế và quản lý các cơ sở dữ liệu một cách hiệu quả nhất, cung cấp cho khách hàng nguồn dữ liệu chính xác và đúng thời điểm. Công ty đảm bảo duy trì sự hoạt động xuyên suốt của hệ thống, dữ liệu được bảo vệ, bảo mật toàn vẹn, sao lưu và xử lý các sự cố nhanh chóng.',NULL,'data-processing.jpg','active','2017-04-05 11:35:41',57,NULL,NULL,NULL,NULL),(13,1,'en','150368451028396','test title 001','test description 001','test content 001',NULL,'active','2017-08-26 01:08:30',NULL,NULL,NULL,NULL,NULL),(14,1,'en','150389459877188','test title 001','test description 001','test content 001',NULL,'active','2017-08-28 11:29:58',NULL,NULL,NULL,NULL,NULL),(15,11,'en','150417687778553','Angular Material Layout','<p>english</p>','<p>english</p>',NULL,'active','2017-08-31 17:58:56',NULL,NULL,NULL,NULL,NULL),(16,11,'vi','150417687778553','Angular Material Layout','<p>tieng viet</p>','<p>tieng viet</p>',NULL,'active','2017-08-31 17:58:56',NULL,NULL,NULL,NULL,NULL),(17,1,'en','150459525766086','test title 001','test description 001','test content 001',NULL,'active','2017-09-05 14:07:37',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_category`
--

DROP TABLE IF EXISTS `service_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_key` varchar(150) DEFAULT NULL,
  `language_code` char(2) DEFAULT 'en',
  `title` varchar(150) DEFAULT NULL,
  `description` text,
  `parent` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_category`
--

LOCK TABLES `service_category` WRITE;
/*!40000 ALTER TABLE `service_category` DISABLE KEYS */;
INSERT INTO `service_category` VALUES (1,'150368511241966','vi','123','<p>test description 001</p>',0,1,'active','2017-08-26 01:18:32',NULL,'2017-08-31 09:30:51',NULL,NULL,NULL),(2,'150368520535077','vi','test title 002','test description 002',0,1,'active','2017-08-26 01:20:05',NULL,NULL,NULL,NULL,NULL),(3,'1503685205350771','vi','contest title 001','test description 002',1,2,'active','2017-08-26 01:20:05',NULL,NULL,NULL,NULL,NULL),(4,'1503685205350772','vi','contest title 001','test description 002',1,2,'active','2017-08-26 01:20:05',NULL,NULL,NULL,NULL,NULL),(5,'1503685205350773','vi','contest title 001','test description 002',1,2,'active','2017-08-26 01:20:05',NULL,NULL,NULL,NULL,NULL),(6,'150411192787707','en','89',NULL,0,1,'delete','2017-08-30 23:52:07',NULL,'2017-08-31 09:16:34',NULL,NULL,NULL),(7,'150411214990350','en','test123',NULL,0,1,'delete','2017-08-30 23:55:49',NULL,'2017-08-31 09:16:32',NULL,NULL,NULL),(8,'150411255086758','en','85',NULL,0,1,'delete','2017-08-31 00:02:30',NULL,'2017-08-31 09:16:27',NULL,NULL,NULL),(9,'15041142625985','en','89',NULL,0,1,'delete','2017-08-31 00:31:02',NULL,'2017-08-31 09:16:13',NULL,NULL,NULL),(10,'150368511241966','en','ewqewqewq',NULL,3,3,'delete','2017-08-31 00:34:53',NULL,'2017-08-31 09:16:19',NULL,NULL,NULL),(11,'150368511241966','en','test 1234',NULL,0,1,'active','2017-08-31 09:19:11',NULL,'2017-08-31 09:30:51',NULL,NULL,NULL),(12,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:16',NULL,NULL,NULL,NULL,NULL),(13,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:17',NULL,NULL,NULL,NULL,NULL),(14,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:17',NULL,NULL,NULL,NULL,NULL),(15,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:23',NULL,NULL,NULL,NULL,NULL),(16,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:47',NULL,NULL,NULL,NULL,NULL),(17,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:47',NULL,NULL,NULL,NULL,NULL),(18,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:47',NULL,NULL,NULL,NULL,NULL),(19,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:48',NULL,NULL,NULL,NULL,NULL),(20,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:48',NULL,NULL,NULL,NULL,NULL),(21,'150368511241966','en','test',NULL,0,1,'active','2017-08-31 09:19:54',NULL,NULL,NULL,NULL,NULL),(22,'150368511241966','en','test',NULL,0,1,'delete','2017-08-31 09:19:56',NULL,'2017-08-31 09:33:15',NULL,NULL,NULL),(23,'1503685205350771','en','789',NULL,0,1,'active','2017-09-01 09:43:31',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `service_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(40) NOT NULL,
  `previous_id` varchar(40) NOT NULL,
  `user_agent` text NOT NULL,
  `ip_hash` char(32) NOT NULL,
  `created` int(10) NOT NULL DEFAULT '0',
  `updated` int(10) NOT NULL DEFAULT '0',
  `payload` longtext NOT NULL,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `PREVIOUS` (`previous_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('2057ec54c75748c386a9b1472afa2394','3d19ed32d968a57ed378a07a7731432b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36','1ba0d4508441bcdb896203d32d573632',1501828896,1501829126,'a:3:{i:0;a:7:{s:10:\"session_id\";s:32:\"2057ec54c75748c386a9b1472afa2394\";s:11:\"previous_id\";s:32:\"3d19ed32d968a57ed378a07a7731432b\";s:7:\"ip_hash\";s:32:\"1ba0d4508441bcdb896203d32d573632\";s:10:\"user_agent\";s:115:\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36\";s:7:\"created\";i:1501828896;s:7:\"updated\";i:1501829126;s:7:\"payload\";s:0:\"\";}i:1;a:1:{s:5:\"email\";s:25:\"k_nguyen@vision-net.co.jp\";}i:2;a:1:{s:29:\"flash::__session_identifier__\";a:2:{s:5:\"state\";s:6:\"expire\";s:5:\"value\";s:40:\"7db65296dfbc37b09c7c2eba16849a4dcabcdc81\";}}}'),('93a862a3704fb65d6b7206d064bccee9','93a862a3704fb65d6b7206d064bccee9','','1ba0d4508441bcdb896203d32d573632',1501829126,1501829126,'a:3:{i:0;a:7:{s:10:\"session_id\";s:32:\"93a862a3704fb65d6b7206d064bccee9\";s:11:\"previous_id\";s:32:\"93a862a3704fb65d6b7206d064bccee9\";s:7:\"ip_hash\";s:32:\"1ba0d4508441bcdb896203d32d573632\";s:10:\"user_agent\";s:0:\"\";s:7:\"created\";i:1501829126;s:7:\"updated\";i:1501829126;s:7:\"payload\";s:0:\"\";}i:1;a:0:{}i:2;a:1:{s:29:\"flash::__session_identifier__\";a:2:{s:5:\"state\";s:6:\"expire\";s:5:\"value\";s:40:\"be3caa6df57caec727b09cbf5f18dee7d5c3df17\";}}}'),('bd172fa3f00e45a7d30a82b53f81454c','bd172fa3f00e45a7d30a82b53f81454c','','1ba0d4508441bcdb896203d32d573632',1501828901,1501828901,'a:3:{i:0;a:7:{s:10:\"session_id\";s:32:\"bd172fa3f00e45a7d30a82b53f81454c\";s:11:\"previous_id\";s:32:\"bd172fa3f00e45a7d30a82b53f81454c\";s:7:\"ip_hash\";s:32:\"1ba0d4508441bcdb896203d32d573632\";s:10:\"user_agent\";s:0:\"\";s:7:\"created\";i:1501828901;s:7:\"updated\";i:1501828901;s:7:\"payload\";s:0:\"\";}i:1;a:0:{}i:2;a:1:{s:29:\"flash::__session_identifier__\";a:2:{s:5:\"state\";s:6:\"expire\";s:5:\"value\";s:40:\"eaee4190c842be6a3bc8cc1d28f734adb5f16151\";}}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slide`
--

DROP TABLE IF EXISTS `slide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slide` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language_code` char(2) NOT NULL DEFAULT 'en',
  `item_key` varchar(150) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `image` text,
  `url` text,
  `position` enum('main') DEFAULT 'main' COMMENT 'main|about-us',
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slide`
--

LOCK TABLES `slide` WRITE;
/*!40000 ALTER TABLE `slide` DISABLE KEYS */;
INSERT INTO `slide` VALUES (1,'en',NULL,'','','slide3.jpg','','','active','2016-10-31 11:38:33',1,'2017-04-05 15:12:21',1,NULL,NULL),(2,'vi',NULL,'','','slide3.jpg','','','active','2016-10-31 11:38:33',1,'2017-04-05 15:12:22',1,'2016-10-31 11:40:54',1),(3,'en',NULL,'','','slide2.jpg','','','active','2016-10-31 13:53:32',1,'2017-04-05 15:11:59',1,NULL,NULL),(4,'en',NULL,'','','slide5.jpg','','','active','2016-10-31 14:06:07',1,'2017-04-05 15:11:40',1,NULL,NULL),(5,'en',NULL,'','','slide4.jpg','','','active','2016-10-31 14:07:13',1,'2017-04-05 15:11:25',1,NULL,NULL),(6,'vi',NULL,'','','slide2.jpg','','','active','2016-10-31 14:33:18',1,'2017-04-05 15:11:59',1,NULL,NULL),(7,'en',NULL,'','','feature_img9.jpg','','','active','2016-10-31 14:40:46',1,'2017-04-05 15:10:48',1,NULL,NULL),(8,'th',NULL,'wt','','core-value.jpg','','','active','2016-10-31 14:40:46',1,'2016-11-08 14:33:48',1,NULL,NULL),(9,'ja',NULL,'','','slide5.jpg','','','active','2016-11-11 14:01:22',1,'2017-04-05 15:11:40',1,NULL,NULL),(10,'en',NULL,'test','','1480488444_8c61db629033cacb472d9fa15e18e7da.png','dhklshdl','','delete','2016-11-30 13:47:24',1,'2017-02-27 14:30:40',1,'2017-02-27 14:30:40',1),(11,'vi',NULL,'','','slide4.jpg','','','active','2016-11-30 13:52:25',1,'2017-04-05 15:04:14',57,NULL,NULL),(12,'en',NULL,'dsad','dsda','1488182268_3f5f1c26888c40f2268a952a3a035a22.jpg','dsda','','delete','2017-02-27 14:57:48',1,'2017-04-05 15:03:06',57,'2017-04-05 15:03:06',57),(13,'en',NULL,'','','1488182405_b248ae0e2d958427ba6ba63030798667.jpg','','','active','2017-02-27 15:00:05',1,'2017-04-05 15:10:23',1,NULL,NULL),(14,'ja',NULL,'','','slide4.jpg','','','active','2017-02-27 17:26:24',1,'2017-04-05 15:11:25',1,NULL,NULL),(15,'ja',NULL,'','','slide2.jpg','','','active','2017-02-27 17:28:16',1,'2017-04-05 15:11:59',1,NULL,NULL),(16,'ja',NULL,'','','slide3.jpg','','','active','2017-02-27 17:28:30',1,'2017-04-05 15:12:22',1,NULL,NULL),(17,'en',NULL,'','','1488191443_7ab7e2d4ac6151cb8200cdadf7bda105.jpg','','','delete','2017-02-27 17:30:43',1,'2017-04-05 11:12:33',57,'2017-04-05 11:12:33',57),(18,'ja',NULL,'','','1488191443_7ab7e2d4ac6151cb8200cdadf7bda105.jpg','','','active','2017-02-27 17:30:43',1,'2017-02-27 17:31:13',1,NULL,NULL),(19,'en',NULL,'','','1488191512_c89f969e7013fc0f8d4339cd95b6e705.jpg','','','active','2017-02-27 17:31:52',1,'2017-04-05 15:10:39',1,NULL,NULL),(20,'ja',NULL,'','','1488191512_c89f969e7013fc0f8d4339cd95b6e705.jpg','','','active','2017-02-27 17:31:52',1,NULL,NULL,NULL,NULL),(21,'en',NULL,'','','1491366454_9513989c46d54eb114769c4bfe404f7d.jpg','','','delete','2017-04-05 11:27:34',57,'2017-04-05 15:01:42',57,'2017-04-05 15:01:42',57),(22,'vi',NULL,'','','1491366454_9513989c46d54eb114769c4bfe404f7d.jpg','','','active','2017-04-05 11:27:34',57,NULL,NULL,NULL,NULL),(23,'vi',NULL,'','','1488191512_c89f969e7013fc0f8d4339cd95b6e705.jpg','','','active','2017-04-05 15:02:09',57,NULL,NULL,NULL,NULL),(24,'vi',NULL,'dadas','','1488182405_b248ae0e2d958427ba6ba63030798667.jpg','','','active','2017-04-05 15:02:46',57,NULL,NULL,NULL,NULL),(25,'vi',NULL,'','','feature_img9.jpg','','','active','2017-04-05 15:03:24',57,'2017-04-05 15:03:33',57,NULL,NULL),(26,'vi',NULL,'','','slide5.jpg','','','active','2017-04-05 15:04:32',57,NULL,NULL,NULL,NULL),(27,'ja',NULL,'','','feature_img9.jpg','','','active','2017-04-05 15:11:10',1,NULL,NULL,NULL,NULL),(28,'en','150368548092426','test title 001','test description 001',NULL,NULL,'main','active','2017-08-26 01:24:40',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `slide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language_code` char(2) NOT NULL DEFAULT 'en',
  `item_key` varchar(150) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `description` text,
  `position` varchar(255) DEFAULT NULL,
  `content` longtext,
  `image` text,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (29,'en','150368569654318','Le minh teo','test description 001','Leader',NULL,NULL,'active','2017-08-26 01:28:16',NULL,NULL,NULL,NULL,NULL),(30,'en','150425905972476','Justice League','<p>The greatest superhero team</p>','Protectors','<p>The greatest superhero team</p>',NULL,'active','2017-09-01 16:46:43',NULL,NULL,NULL,NULL,NULL),(31,'vi','150425905972476','Lien Minh Cong Ly','<p>Biet doi sieu anh hung vi dai nhat</p>','Nguoi bao ve','<p>Biet doi sieu anh hung vi dai nhat</p>',NULL,'active','2017-09-01 16:46:43',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_group`
--

DROP TABLE IF EXISTS `vsvn_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text,
  `parent` int(11) DEFAULT '0',
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_group`
--

LOCK TABLES `vsvn_group` WRITE;
/*!40000 ALTER TABLE `vsvn_group` DISABLE KEYS */;
INSERT INTO `vsvn_group` VALUES (1,'Staff','',0,'active','2016-02-08 00:01:01',1,'2016-06-03 11:46:23',1,NULL,NULL),(2,'Team Leader','',0,'active','2016-02-08 00:01:01',1,'2016-06-03 11:46:27',1,NULL,NULL),(3,'Leader','',0,'active','2016-02-08 00:01:01',1,'2016-06-03 11:46:19',1,NULL,NULL),(4,'Director','',0,'active','2016-02-08 00:01:01',1,'2016-06-03 11:46:08',1,NULL,NULL),(5,'System','',0,'active','2016-02-08 00:01:01',1,'2016-06-03 11:46:25',1,NULL,NULL),(6,'Statistic','',0,'active','2016-08-08 17:41:09',1,NULL,NULL,NULL,NULL),(7,'Notification','',0,'active','2016-09-09 10:10:22',1,NULL,NULL,NULL,NULL),(8,'Accounting','',0,'active','2016-09-09 10:10:31',1,'2016-09-12 12:00:28',1,NULL,NULL);
/*!40000 ALTER TABLE `vsvn_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_group_role`
--

DROP TABLE IF EXISTS `vsvn_group_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_group_role` (
  `group_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_group_role`
--

LOCK TABLES `vsvn_group_role` WRITE;
/*!40000 ALTER TABLE `vsvn_group_role` DISABLE KEYS */;
INSERT INTO `vsvn_group_role` VALUES (1,1),(2,1),(2,5),(3,1),(3,4),(4,1),(4,2),(5,1),(5,2),(6,1),(6,3),(7,1),(8,1),(8,6);
/*!40000 ALTER TABLE `vsvn_group_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_language`
--

DROP TABLE IF EXISTS `vsvn_language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(2) NOT NULL,
  `name` varchar(150) NOT NULL,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_language`
--

LOCK TABLES `vsvn_language` WRITE;
/*!40000 ALTER TABLE `vsvn_language` DISABLE KEYS */;
INSERT INTO `vsvn_language` VALUES (1,'en','English','active','2016-02-26 06:24:29',1,'2016-05-12 12:13:43',1,NULL,NULL),(2,'ja','日本語','active','2016-02-26 06:24:35',1,'2017-03-01 13:05:08',83,NULL,NULL),(3,'vi','Vietnam','active','2016-02-26 06:24:59',1,'2017-04-05 15:10:52',1,'2016-03-07 12:59:19',1),(4,'fr','France','inactive','2016-03-07 12:45:24',1,'2016-08-01 16:27:14',57,NULL,NULL),(5,'th','Thailan','inactive','2016-03-31 17:45:45',NULL,'2016-07-19 11:45:16',11,'2016-03-31 17:48:10',NULL),(7,'cn','Chinaa','delete','2016-04-25 11:01:14',5,'2016-04-25 11:02:03',5,'2016-04-25 11:02:03',15),(8,'sg','Singapore','inactive','2016-05-12 12:15:34',1,'2016-08-18 15:45:41',1,NULL,NULL);
/*!40000 ALTER TABLE `vsvn_language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_list_mca`
--

DROP TABLE IF EXISTS `vsvn_list_mca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_list_mca` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `type` varchar(45) NOT NULL COMMENT 'module|controller|action',
  `parent` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_list_mca`
--

LOCK TABLES `vsvn_list_mca` WRITE;
/*!40000 ALTER TABLE `vsvn_list_mca` DISABLE KEYS */;
INSERT INTO `vsvn_list_mca` VALUES (1,'checkin','module',0),(2,'calendar','controller',1),(3,'index','action',2),(4,'sync_calendar','action',2),(5,'socket_sync_calendar','action',2),(6,'default','controller',1),(7,'login','action',6),(8,'reset_password','action',6),(9,'logout','action',6),(10,'active','action',6),(11,'page_no_found','action',6),(12,'grenerate_avatar_url','action',6),(13,'export','controller',1),(14,'timesheet','action',13),(15,'member_csv','action',13),(16,'overtime_member_csv','action',13),(17,'absence_member_csv','action',13),(18,'index','controller',1),(19,'login','action',18),(20,'logout','action',18),(21,'response','action',18),(22,'member','controller',1),(23,'index','action',22),(24,'profile','action',22),(25,'notification','controller',1),(26,'index','action',25),(27,'organization','controller',1),(28,'index','action',27),(29,'test','action',27),(30,'statistical','controller',1),(31,'index','action',30),(32,'timesheet','controller',1),(33,'index','action',32),(34,'import','action',32),(35,'deploy','module',0),(36,'index','controller',35),(37,'index','action',36),(38,'details','action',36),(39,'load_item_data','action',36),(40,'getdeployhistory','action',36),(41,'deploy','action',36),(42,'project','controller',35),(43,'index','action',42),(44,'create','action',42),(45,'update','action',42),(46,'load_item_data','action',42),(47,'status_item','action',42),(48,'main','module',0),(49,'index','controller',48),(50,'index','action',49),(51,'test','action',49),(52,'test_image','action',49),(53,'login','action',49),(54,'response','action',49),(55,'sync','controller',48),(56,'user','action',55),(57,'form_absence','action',55),(58,'form_overtime','action',55),(59,'update_form_with_organization','action',55),(60,'calendar','action',55),(61,'mcalendar','action',55),(62,'system','module',0),(63,'default','controller',62),(64,'login','action',63),(65,'logout','action',63),(66,'response','action',63),(67,'group','controller',62),(68,'index','action',67),(69,'create','action',67),(70,'update','action',67),(71,'status_item','action',67),(72,'load_item_data','action',67),(73,'index','controller',62),(74,'index','action',73),(75,'language','controller',62),(76,'index','action',75),(77,'create','action',75),(78,'update','action',75),(79,'status_item','action',75),(80,'load_item_data','action',75),(81,'import_translate','action',75),(82,'generate_translate','action',75),(83,'options','controller',62),(84,'index','action',83),(85,'form','action',83),(86,'status_item','action',83),(87,'load_item_data','action',83),(88,'role','controller',62),(89,'index','action',88),(90,'create','action',88),(91,'update','action',88),(92,'status_item','action',88),(93,'load_item_data','action',88),(94,'script','controller',62),(95,'test','action',94),(96,'change_language','action',94),(97,'update_mca','action',94),(98,'export_language','action',94),(99,'image','action',94),(100,'download','action',94),(101,'translate','controller',62),(102,'index','action',101),(103,'form','action',101),(104,'status_item','action',101),(105,'load_item_data','action',101),(106,'user','controller',62),(107,'index','action',106),(108,'create','action',106),(109,'update','action',106),(110,'load_item_data','action',106),(111,'status_item','action',106),(112,'vacation_days_csv','action',13),(113,'chart','action',27),(114,'project','controller',1),(115,'index','action',114),(116,'forge_login','action',6),(117,'config','action',6),(118,'project','module',0),(119,'default','controller',118),(120,'index','action',119),(121,'mformapproval','controller',1),(122,'index','action',121),(123,'asset','module',0),(124,'assetcategory','controller',123),(125,'index','action',124),(126,'assetdetail','controller',123),(127,'index','action',126),(128,'detail','action',126),(129,'qrcode','action',126),(130,'assethandover','controller',123),(131,'index','action',130),(132,'form','action',130),(133,'assetreturn','controller',123),(134,'index','action',133),(135,'form','action',133),(136,'export','controller',123),(137,'asset_csv','action',136),(138,'statistical','controller',123),(139,'index','action',138),(140,'test_orm','action',55),(141,'syncasset','controller',48),(142,'category','action',141),(143,'detail','action',141),(144,'handover','action',141),(145,'olddetail','action',126);
/*!40000 ALTER TABLE `vsvn_list_mca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_options`
--

DROP TABLE IF EXISTS `vsvn_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `value` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_options`
--

LOCK TABLES `vsvn_options` WRITE;
/*!40000 ALTER TABLE `vsvn_options` DISABLE KEYS */;
INSERT INTO `vsvn_options` VALUES (1,'background_home_page','1472624610_3bb73cd589d512eeb6df2610111bade1.jpg');
/*!40000 ALTER TABLE `vsvn_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_role`
--

DROP TABLE IF EXISTS `vsvn_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `content` text NOT NULL,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_role`
--

LOCK TABLES `vsvn_role` WRITE;
/*!40000 ALTER TABLE `vsvn_role` DISABLE KEYS */;
INSERT INTO `vsvn_role` VALUES (1,'Basic','Basic Role To Access System, such as: login, logout, change password...etc...','{\"checkin\":{\"calendar\":[\"index\",\"sync_calendar\",\"socket_sync_calendar\"],\"default\":[\"login\",\"reset_password\",\"logout\",\"active\",\"page_no_found\",\"grenerate_avatar_url\",\"forge_login\"],\"export\":[\"timesheet\"],\"index\":[\"login\",\"logout\",\"response\"],\"member\":[\"profile\"],\"notification\":[\"index\"],\"organization\":[\"index\",\"test\",\"chart\"],\"statistical\":[\"index\"],\"timesheet\":[\"index\"]},\"main\":{\"index\":[\"index\",\"test\",\"test_image\",\"login\",\"response\"],\"sync\":[\"user\",\"form_absence\",\"form_overtime\",\"update_form_with_organization\",\"calendar\",\"mcalendar\"]},\"system\":{\"script\":[\"test\",\"change_language\",\"update_mca\",\"export_language\",\"image\",\"download\"]}}','active','2016-06-03 11:45:51',1,'2016-08-31 14:25:32',1,NULL,NULL),(2,'System','Full Access','{\"checkin\":{\"calendar\":[\"index\",\"sync_calendar\",\"socket_sync_calendar\"],\"default\":[\"login\",\"reset_password\",\"logout\",\"active\",\"page_no_found\",\"grenerate_avatar_url\",\"forge_login\",\"config\"],\"export\":[\"timesheet\",\"member_csv\",\"overtime_member_csv\",\"absence_member_csv\",\"vacation_days_csv\"],\"index\":[\"login\",\"logout\",\"response\"],\"member\":[\"index\",\"profile\"],\"notification\":[\"index\"],\"organization\":[\"index\",\"test\",\"chart\"],\"statistical\":[\"index\"],\"timesheet\":[\"index\",\"import\"],\"project\":[\"index\"],\"mformapproval\":[\"index\"]},\"deploy\":{\"index\":[\"index\",\"details\",\"load_item_data\",\"getdeployhistory\",\"deploy\"],\"project\":[\"index\",\"create\",\"update\",\"load_item_data\",\"status_item\"]},\"main\":{\"index\":[\"index\",\"test\",\"test_image\",\"login\",\"response\"],\"sync\":[\"user\",\"form_absence\",\"form_overtime\",\"update_form_with_organization\",\"calendar\",\"mcalendar\",\"test_orm\"],\"syncasset\":[\"category\",\"detail\",\"handover\"]},\"system\":{\"default\":[\"login\",\"logout\",\"response\"],\"group\":[\"index\",\"create\",\"update\",\"status_item\",\"load_item_data\"],\"index\":[\"index\"],\"language\":[\"index\",\"create\",\"update\",\"status_item\",\"load_item_data\",\"import_translate\",\"generate_translate\"],\"options\":[\"index\",\"form\",\"status_item\",\"load_item_data\"],\"role\":[\"index\",\"create\",\"update\",\"status_item\",\"load_item_data\"],\"script\":[\"test\",\"change_language\",\"update_mca\",\"export_language\",\"image\",\"download\"],\"translate\":[\"index\",\"form\",\"status_item\",\"load_item_data\"],\"user\":[\"index\",\"create\",\"update\",\"load_item_data\",\"status_item\"]},\"project\":{\"default\":[\"index\"]},\"asset\":{\"assetcategory\":[\"index\"],\"assetdetail\":[\"index\",\"detail\",\"qrcode\",\"olddetail\"],\"assethandover\":[\"index\",\"form\"],\"assetreturn\":[\"index\",\"form\"],\"export\":[\"asset_csv\"],\"statistical\":[\"index\"]}}','active','2016-07-06 13:21:22',57,'2016-10-06 15:36:31',4,NULL,NULL),(3,'Statistic','','{\"checkin\":{\"calendar\":[\"index\",\"sync_calendar\",\"socket_sync_calendar\"],\"default\":[\"login\",\"reset_password\",\"logout\",\"active\",\"page_no_found\",\"grenerate_avatar_url\"],\"export\":[\"timesheet\",\"member_csv\",\"overtime_member_csv\",\"absence_member_csv\",\"vacation_days_csv\"],\"index\":[\"login\",\"logout\",\"response\"],\"member\":[\"profile\"],\"notification\":[\"index\"],\"organization\":[\"index\",\"test\"],\"statistical\":[\"index\"],\"timesheet\":[\"index\"]},\"main\":{\"index\":[\"index\",\"test\",\"test_image\",\"login\",\"response\"],\"sync\":[\"user\",\"form_absence\",\"form_overtime\",\"update_form_with_organization\",\"calendar\",\"mcalendar\"]}}','active','2016-08-09 15:06:34',1,'2016-08-26 16:47:22',4,NULL,NULL),(4,'Leader','','{\"checkin\":{\"timesheet\":[\"import\"]}}','active','2016-08-18 11:31:55',1,NULL,NULL,NULL,NULL),(5,'Team Leader','','{\"checkin\":{\"timesheet\":[\"import\"]}}','active','2016-08-18 11:32:11',1,NULL,NULL,NULL,NULL),(6,'Accounting','','{\"checkin\":{\"calendar\":[\"index\",\"sync_calendar\",\"socket_sync_calendar\"],\"default\":[\"login\",\"reset_password\",\"logout\",\"active\",\"page_no_found\",\"grenerate_avatar_url\",\"forge_login\",\"config\"],\"export\":[\"timesheet\",\"member_csv\",\"overtime_member_csv\",\"absence_member_csv\",\"vacation_days_csv\"],\"index\":[\"login\",\"logout\",\"response\"],\"member\":[\"index\",\"profile\"],\"notification\":[\"index\"],\"organization\":[\"test\",\"chart\"],\"statistical\":[\"index\"],\"timesheet\":[\"index\",\"import\"],\"project\":[\"index\"],\"mformapproval\":[\"index\"]}}','active','2016-09-12 15:39:47',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `vsvn_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_translate`
--

DROP TABLE IF EXISTS `vsvn_translate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_translate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` text,
  `value` text,
  `language_code` varchar(2) DEFAULT NULL,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_code` (`language_code`)
) ENGINE=InnoDB AUTO_INCREMENT=627 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_translate`
--

LOCK TABLES `vsvn_translate` WRITE;
/*!40000 ALTER TABLE `vsvn_translate` DISABLE KEYS */;
INSERT INTO `vsvn_translate` VALUES (1,'User ID','ユーザーID','ja','active','2016-07-25 11:58:34',57,NULL,NULL,NULL,NULL),(2,'Date','日付','ja','active','2016-07-25 11:58:34',57,NULL,NULL,NULL,NULL),(3,'Date Type','日付形式','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(4,'Date Leave','欠勤日','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(5,'Date Return','戻る日','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(6,'Pay','支払い','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(7,'The Form Absence exists. You cant create a new form.','欠勤申請は既に存在しています。新しい申請を作成できません。','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(8,'Organization ID','組織ID','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(9,'Form Type','申請種類','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(10,'Order','順番','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(11,'From','','ja','active','2016-07-25 11:58:35',57,'2016-07-26 14:05:15',11,NULL,NULL),(12,'To','～','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(13,'The Time is over. You cant create a OT form.','時間が過ぎました。残業申請を作成できません','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(14,'The Form OT exists. You cant create a new form.','残業申請は既に存在しています。新しい申請を作成できません。','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(15,'Form ID','申請ID','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(16,'Status','ステータス','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(17,'The Data of Calendar is existed. Please edit the other Events on next month.','カレンダーのデータは既に存在しています。来月にイベントを追加してください。','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(18,'Name','名前','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(19,'Group ID','グループID','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(20,'Role ID','権限ID','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(21,'Code','コード','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(22,'Type','タイプ','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(23,'Parent','Parent','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(24,'Target Type','目標タイプ','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(25,'Target ID','目標ID','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(26,'Target Date','目標日付','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(27,'Members','メンバー','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(28,'Content','内容','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(29,'Origin Content','元の内容','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(30,'Translate Content','翻訳の内容','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(31,'Language Code','言語コード','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(32,'Staff No','社員番号','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(33,'Email','メールアドレス','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(34,'Username','ユーザー名','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(35,'Password','パスワード','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(36,'Department','部門','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(37,'Group','グループ','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(38,'Position ID','役職ID','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(39,'An unexpected error occurred','An unexpected error occurred','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(40,'Your new password is actived!','新しいパスワードは有効になりました！','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(41,'Oops','Oops','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(42,'Sorry','Sorry','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(43,'Checkin-out','チェックイン・アウト','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(44,'TimeSheet','勤怠','ja','active','2016-07-25 11:58:35',57,'2016-07-26 11:34:02',11,NULL,NULL),(45,'Working Time (hour)','勤務（時間）','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(46,'Overtime (hour)','残業（時間）','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(47,'Checkin out','チェックイン・アウト','ja','active','2016-07-25 11:58:35',57,NULL,NULL,NULL,NULL),(48,'Tháng','月','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(49,'CÔNG TY TNHH MTV VISION  VIỆT NAM','ビジョンベトナム','ja','active','2016-07-25 11:58:36',57,'2016-07-26 11:34:41',11,NULL,NULL),(50,'Địa chỉ: Tầng 4','住所：４階','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(51,'BẢNG CHẤM CÔNG CHO NHÂN VIÊN TOÀN THỜI GIAN (TIME SHEET FOR FULL-TIME LABOR)','正社員の勤怠表','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(52,'$dateTime','$dateTime','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(53,'Số TT/ No.','順番','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(54,'Mã NV/ Code','社員番号','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(55,'Họ tên/ Name','名前','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(56,'Bộ phận/ Depart.','所属部署','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(57,'Sumary','サマリ','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(58,'Work Time','勤務時間','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(59,'Work Day','勤務日','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(60,'Overtime','残業','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(61,'Work Day (off)','勤務日（休暇）','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(62,'Overtime (off)','残業（休暇）','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(63,'Overtime (off except paid)','残業（祭日休暇）','ja','active','2016-07-25 11:58:36',57,NULL,NULL,NULL,NULL),(64,'Đơn vị (Unit): Ngày (Day)','単位：日','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(65,'Ngày nghỉ (day off)','休暇','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(66,'Nghỉ có lương/結婚休暇 (Nghỉ đám hiếu hỉ','慶弔休暇','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(67,'Nghỉ không lương/ 無給休暇','無給休暇','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(68,'Nghỉ phép/ 有給休暇','有給休暇','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(69,'Nghỉ toàn công ty/ 全社休暇','全社休暇','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(70,'Số ngày công hưởng lương/ 有給出勤日','有給出勤日','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(71,'Tp. Hồ Chí Minh','ホーチミン市','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(72,'$placeDate','$placeDate','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(73,'TỔNG GIÁM ĐỐC','社長','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(74,'NGƯỜI CHẤM CÔNG','作成者','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(75,'HOÀNG THỊ HUYỀN','HOÀNG THỊ HUYỀN','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(76,'TRẦN THỊ MỸ TIÊN','TRẦN THỊ MỸ TIÊN','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(77,'Employee Timesheet','社員勤怠','ja','active','2016-07-25 11:58:37',57,'2016-07-26 11:34:51',11,NULL,NULL),(78,'Active Password','パスワードを有効にします','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(79,'Welcome to Vision company','株式会社ビジョンへようこそ','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(80,'Forget password','パスワードを忘れる','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(81,'Reset password','パスワードをリセットする','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(82,'Reset','リセット','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(83,'Back','戻る','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(84,'Staff Id','社員番号','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(85,'Name Kana','名前カナ','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(86,'Position','役職','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(87,'Phone','電話番号','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(88,'Identity Number','身分証明書','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(89,'Identity Issued Date','身分証明書発行日','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(90,'Identity Issued Place','身分証明書発行地','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(91,'Address','住所','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(92,'Family Phone','家族電話番号','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(93,'Birthday','誕生日','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(94,'Birthplace','出身地','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(95,'Add New','追加','ja','active','2016-07-25 11:58:37',57,'2016-07-26 11:35:04',11,NULL,NULL),(96,'Update','更新','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(97,'View','閲覧','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(98,'Payment','支払い','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(99,'Hour Leave','欠勤時間','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(100,'Hour Return','戻る時間','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(101,'Date(From)','日付から','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(102,'Date(To)','日付まで','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(103,'Total Day','日数合計','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(104,'Reason','理由','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(105,'Check in/out Time','出勤・退勤','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(106,'From/To','から・まで','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(107,'Total Hour','時間合計','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(108,'check-in time','出勤','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(109,'check-out time','退勤','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(110,'work-time','勤務時間','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(111,'ot-real','実際残業','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(112,'ot-approve','残業承認','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(113,'form-ot','残業申請','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(114,'leave of absence','欠勤申請','ja','active','2016-07-25 11:58:37',57,'2016-07-26 11:37:46',11,NULL,NULL),(115,'note','備考','ja','active','2016-07-25 11:58:37',57,'2016-07-26 11:38:18',11,NULL,NULL),(116,'Project management','プロジェクト管理','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(117,'Display Data','表示データ','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(118,'Details Infomation','詳細情報','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(119,'Active','有効','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(120,'Inactive','無効','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(121,'View Details','詳細閲覧','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(122,'Create Data','データ作成','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(123,'Update Data','データ更新','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(124,'Repository Url','リポジトリーURL','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(125,'Account','アカウント','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(126,'Record Created Successfully','レコードを作成しました','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(127,'Record Updated Successfully','レコードを更新しました','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(128,'Delete','削除','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(129,'Record Deleted Successfully','レコードを削除しました','ja','active','2016-07-25 11:58:37',57,NULL,NULL,NULL,NULL),(130,'Project Infomation','プロジェクト情報','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(131,'Project Name','プロジェクト名','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(132,'Enviroment','環境','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(133,'Enviroment Infomation','環境情報','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(134,'History','履歴','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(135,'Enviroment Name','環境名','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(136,'Server IP','サーバーIP','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(137,'Git Branch','Git Branch','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(138,'Directory','ディレクトリ','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(139,'Enviroment not deploy','Enviroment not deploy','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(140,'View More','もっと見る','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(141,'Deploy','デプロイ','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(142,'Deploy Process','Deploy Process','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(143,'Deploy Success','Deploy Success','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(144,'Deploy History','デプロイ履歴','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(145,'Deployed','Deployed','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(146,'Branch','Branch','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(147,'Server','サーバー','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(148,'Description','説明','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(149,'All','全て','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(150,'Select','選択','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(151,'Add','追加','ja','active','2016-07-25 11:58:38',57,'2016-07-26 11:35:08',11,NULL,NULL),(152,'Port','ポート','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(153,'Server Account','サーバーアカウント','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(154,'Server Password','サーバーパスワード','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(155,'Save','保存','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(156,'Are you sure to delete this row?','この行を削除します、よろしいでしょうか？','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(157,'Create','作成','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(158,'Forbidden!','Forbidden!','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(159,'Internal server error!','Internal server error!','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(160,'Service unavailable!','Service unavailable!','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(161,'System offline!','System offline!','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(162,'Page not found!','Page not found!','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(163,'Back to Previous Page','前へ進む','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(164,'Return to Homepage','ホームページに戻る','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(165,'Group management','グループ管理','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(166,'Role','権限','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(167,'Language management','言語管理','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(168,'Export','出力','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(169,'Record Import Successfully','レコードをインポートしました','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(170,'Import Data','データインポート','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(171,'Options management','オプション管理','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(172,'Option Name','オプション名','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(173,'Role management','権限管理','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(174,'Translate management','翻訳管理','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(175,'This key has been existed in database.','このキーは既にデータベースに存在しています。','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(176,'User management','ユーザー管理','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(177,'Organaztion','組織','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(178,'Login to your account','あなたのアカウントにログインする','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(179,'Enter your credentials below','以下にあなたのクレデンシャルを入力してください。','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(180,'Sign in','サインイン','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(181,'Forgot password?','パスワードを忘れましたか？','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(182,'Go to dashboard','ダッシュボードへ行く','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(183,'Member','メンバー','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(184,'Vision Vietnam','ビジョンベトナム','ja','active','2016-07-25 11:58:38',57,'2016-07-26 11:35:18',11,NULL,NULL),(185,'Language File','言語ファイル','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(186,'Submit','申請','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(187,'Import','インポート','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(188,'Option Value','オプション値','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(189,'Permission Area','権限エリア','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(190,'Update Area','更新エリア','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(191,'Language','言語','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(192,'Lanaguage','言語','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(193,'Full Name','フールネーム','ja','active','2016-07-25 11:58:38',57,'2016-07-26 11:35:29',11,NULL,NULL),(194,'User Name','ユーザー名','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(195,'Enter Password','パスワード入力','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(196,'Organization','組織','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(197,'Incorrect account information','アカウント情報は正しくない','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(198,'Login success!','ログインしました','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(199,'Exist other session! Please logout before login other account!','他のセクションが存在しています。他のアカウントにログインする前にログアウトしてください。','ja','active','2016-07-25 11:58:38',57,NULL,NULL,NULL,NULL),(200,'Logout success!','ログアウトしました','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(201,'Accepted','受け付けました','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(202,'Missing Primary Key','プライマリーキーはありません','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(203,'Can Not Find This Record','このレコードが見つかりません','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(204,'Validation Errors','Validation Errors','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(205,'Invalid or expired token','Invalid or expired token','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(206,':value has been existed','値は既に存在しています','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(207,'Your re-password is not correct.','旧パスワードは正しくない','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(208,'Your current password is not correct.','現在のパスワードは正しくない','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(209,'Vision Vietnam System','ビジョンベトナムシステム','ja','active','2016-07-25 11:58:39',57,'2016-07-26 11:35:39',11,NULL,NULL),(210,'Home','ホームページ','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(211,'Profile','プロファイル','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(212,'Notification','通知','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(213,'Management','管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(214,'Users','ユーザー','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(215,'Master Calendar','マスタカレンダー','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(216,'Change Password','パスワード変更','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(217,'Logout & Checkout','ログアウト及びチェックアウト','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(218,'Vision Vietnam Management','ビジョンベトナム管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(219,'System','システム','ja','active','2016-07-25 11:58:39',57,'2016-07-26 11:36:00',11,NULL,NULL),(220,'Human Resouce','人事部','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(221,'User Management','ユーザー管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(222,'Group Management','グループ管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(223,'Permission','権限','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(224,'Role Management','権限管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(225,'Language Management','言語管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(226,'Translate Management','翻訳管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(227,'Project Management','プロジェクト管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(228,'List User Project','ユーザーリスト管理','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(229,'No data available in table','データはありません','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(230,'Please check out!!','チェックアウトしてください！','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(231,'Are you sure logout & checkout system?','ログアウトしてチェックアウトします、よろしいでしょうか？','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(232,'Yes','はい','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(233,'No','いいえ','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(234,'Current password','現在のパスワード','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(235,'New password','新しいパスワード','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(236,'Confirm password','パスワード確認','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(237,'Cancel','キャンセル','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(238,'Change Password is successfull','パスワードが変更されました','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(239,'message','メッセージ','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(240,'Checkin at:','～にチェックイン','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(241,'user_name + ’s  + targetType +  form is waiting for approving','user_name + ’s  + targetType +  form　承認待ち','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(242,'Enter Year Month','月、年を入力する','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(243,'Please enter month to export data!','月を入力してデータを出力します','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(244,'Export Timesheet is successfull.','勤怠が出力されました','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(245,'Year','年','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(246,'Previous Year','前の年','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(247,'Next Year','次の年','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(248,'Jump Forward 12 Years','12年後へ進む','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(249,'Jump Back 12 Years','12年前へ戻る','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(250,'Next','次','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(251,'Prev','前','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(252,'Open Month Chooser','月を選択してください','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(253,'Jump Years','進む','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(254,'Back to','戻る','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(255,'Jan.','1月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(256,'Feb.','2月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(257,'Mar.','3月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(258,'Apr.','4月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(259,'May','5月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(260,'June','6月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(261,'July','7月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(262,'Aug.','8月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(263,'Sep.','9月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(264,'Oct.','10月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(265,'Nov.','11月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(266,'Dec.','12月','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(267,'Work','通勤','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(268,'Off','休暇','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(269,'Off Paid','有給休暇','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(270,'Off Unpaid','無給休暇','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(271,'Off Except Paid','祭日休暇','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(272,'Overtime Form','残業申請','ja','active','2016-07-25 11:58:39',57,NULL,NULL,NULL,NULL),(273,'Total','合計','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(274,'hour','時間','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(275,'hours','時間','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(276,'Comment','コメント','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(277,'Approve','承認','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(278,'Deny','否認','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(279,'Update OT Form is successfull.','残業申請が更新されました','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(280,'Approve OT Form is successfull.','残業申請が承認されました','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(281,'Deny OT Form is successfull.','残業申請が否認されました','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(282,'From must be less than To','終了日時は開始日時より大きい','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(283,'Vacation Day','有給休暇','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(284,'Overtime In','残業時間(現時点) ','ja','active','2016-07-25 11:58:40',57,'2016-07-26 15:29:55',11,NULL,NULL),(285,'Absence Paid In','有給休暇日数(現時点)','ja','active','2016-07-25 11:58:40',57,'2016-07-26 15:31:26',11,NULL,NULL),(286,'Absence Unpaid In','無給休暇日数(現時点)','ja','active','2016-07-25 11:58:40',57,'2016-07-26 15:31:39',11,NULL,NULL),(287,'Leave Of Absence Form','欠勤申請','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(288,'You have','残り','ja','active','2016-07-25 11:58:40',57,'2016-07-26 11:40:15',11,NULL,NULL),(289,'Paid','有給','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(290,'Unpaid','無給','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(291,'Absence From','欠勤申請','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(292,'Hours of leave','欠勤時間','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(293,'day','日','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(294,'days','日','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(295,'left','があります','ja','active','2016-07-25 11:58:40',57,'2016-07-26 11:40:24',11,NULL,NULL),(296,'Update Absence Form is successfull.','欠勤申請が更新されました。','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(297,'Begin leave of absence must be less than date of return','戻る日は欠勤開始日より大きい','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(298,'Apply','適用','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(299,'Update Calendars is successfull.','カレンダーを更新しました','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(300,'Update Calendars is unsuccessfull.','カレンダーを更新できません','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(301,'Update Calendar','カレンダーが更新されました','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(302,'Note','備考','ja','active','2016-07-25 11:58:40',57,'2016-07-26 11:38:22',11,NULL,NULL),(303,'Update Event is successfull.','イベントが更新されました','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(304,'Unable to copy obj! Its type isnt supported.','コピーできません！このタイプを対応できません。','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(305,'Reset your password is successfull. Please check your email!','パスワードがリセットされました。メールをチェックしてください。','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(306,'Ok','確認','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(307,'Hide Filter','フィルター非表示','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(308,'Show Filter','フィルター表示','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(309,'Update Member','メンバー更新','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(310,'Add New Member','新しいメンバーを更新','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(311,'View Member','メンバー閲覧','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(312,'More','もっと見る','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(313,'Hide','非表示','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(314,'Clear','クリア','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(315,'User Information','ユーザー情報','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(316,'Add New User','新規ユーザー追加','ja','active','2016-07-25 11:58:40',57,'2016-07-26 11:36:13',11,NULL,NULL),(317,'Create a member is successfull.','メンバーを作成しました','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(318,'UPDATE USER','ユーザー更新','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(319,'Edit a member is successfull.','メンバーを編集しました','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(320,'Gender','性別','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(321,'Male','男','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(322,'Female','女','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(323,'Approval Form','申請承認','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(324,'Not Allow','同意しません','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(325,'Allow','同意','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(326,'cancel','キャンセル','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(327,'Skype','スカイプ','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(328,'Talk Note','トークノート','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(329,'PC Account','PCアカウント','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(330,'Date Start','開始日','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(331,'Date End','終了日','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(332,'Probation Date','試用日','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(333,'Contract Date','契約日','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(334,'Nation','国籍','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(335,'Degree','学位','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(336,'Specialized','専攻','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(337,'Permanent Address','本籍地','ja','active','2016-07-25 11:58:40',57,NULL,NULL,NULL,NULL),(338,'Distance House Company','家から会社までの距離','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(339,'Tax Number','税番号','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(340,'Tax Issued Date','税番号発行日','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(341,'Insurance Number','保険番号','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(342,'Banking Number','口座番号','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(343,'Banking Branch','銀行支店','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(344,'Domain Account','ドメインアカウント','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(345,'Inprogress','処理中','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(346,'Labour Contract','労働契約','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(347,'Contract Extension','契約延長','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(348,'Social Insurance','社会保険','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(349,'Health Care','健康保険','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(350,'Trade Union','組合','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(351,'Absence','欠勤申請','ja','active','2016-07-25 11:58:41',57,'2016-07-26 11:37:56',11,NULL,NULL),(352,'Member Info','社員情報','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(353,'Please select form to view member info.','社員情報を閲覧するために、申請を選択してください','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(354,'Are you sure?','よろしいでしょうか？','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(355,'Seen','既読','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(356,'You have already seen this event.','このイベントを閲覧しました','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(357,'UnPaid','無給','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(358,'You have some request to process theses form.','あなたの承認が必要な申請があります。','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(359,'Descriptions','説明','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(360,'Color','色','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(361,'Hide All','全て非表示','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(362,'Show All','全て表示','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(363,'Update Organization','組織更新','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(364,'Please select department to update.','部門を選択してください','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(365,'Add New Organization','新しい組織を追加','ja','active','2016-07-25 11:58:41',57,'2016-07-26 11:36:26',11,NULL,NULL),(366,'Create a organization is successfull.','組織を作成しました','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(367,'Update a organization is successfull.','組織が更新されました','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(368,'Staff Information','社員情報','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(369,'Working Time','通勤時間','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(370,'Edit Timesheet','勤怠編集','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(371,'Create Form-OT','残業申請作成','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(372,'Create Form-Absence','欠勤申請作成','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(373,'View Recent Forms','最近申請閲覧','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(374,'Checkin','出勤','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(375,'Checkout','退勤','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(376,'Edit a timesheet is successfull.','勤怠を編集しました','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(377,'Hour','時間','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(378,'Hours','時間','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(379,'Create a OT Form is successfull.','残業申請を作成しました','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(380,'Days of leave','欠勤日数','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(381,'Create a Absence Form is successfull.','欠勤申請を作成しました','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(382,'origin_content','元の内容','ja','active','2016-07-25 11:58:41',57,NULL,NULL,NULL,NULL),(383,':user_name has birthday on :date',':dateは:user_nameさんの誕生日です。','ja','active','2016-07-25 14:38:35',57,NULL,NULL,NULL,NULL),(384,'The probation contract of :user_name will be expired on :date',':dateに:user_nameさんの試用契約が切れます。','ja','active','2016-07-25 14:38:50',57,NULL,NULL,NULL,NULL),(385,'The labour contract of :user_name will be expired on :date',':dateに:user_nameさんの雇用契約が切れます。','ja','active','2016-07-25 14:39:01',57,NULL,NULL,NULL,NULL),(386,'Make the Social Insurance Registration for :user_name',':user_nameさんに社会保険を登録します。','ja','active','2016-07-25 14:39:14',57,NULL,NULL,NULL,NULL),(387,'Make the Heath Care Insurance Registration for :user_name',':user_nameさんに健康保険を登録します。','ja','active','2016-07-25 14:39:24',57,NULL,NULL,NULL,NULL),(388,':user_name join the Trade Union',':user_nameさんは組合に加入します。','ja','active','2016-07-25 14:39:36',57,NULL,NULL,NULL,NULL),(389,':user_name\'s overtime form is waiting for approving',':user_nameさんの残業申請は承認待ちの状態です。','ja','active','2016-07-25 14:39:46',57,NULL,NULL,NULL,NULL),(390,':user_name\'s absence form is waiting for approving',':user_nameさんの欠勤申請は承認待ちの状態です。','ja','active','2016-07-25 14:39:57',57,NULL,NULL,NULL,NULL),(391,'Exit','ログアウト','ja','active','2016-07-25 14:54:50',57,'2016-10-06 09:50:48',1,NULL,NULL),(392,'Are you sure logout system?','ログアウトします、よろしいでしょうか？','ja','active','2016-07-25 16:20:00',11,NULL,NULL,NULL,NULL),(393,'Are you sure checkout system?','チェックアウトします、よろしいでしょうか？','ja','active','2016-07-25 16:20:09',11,NULL,NULL,NULL,NULL),(394,'Checkout successfull!','チェックアウトしました。','ja','active','2016-07-25 16:20:17',11,NULL,NULL,NULL,NULL),(395,'Hi :user_name, checkin successfull. Have a nice day!','おはようございます。:user_name、チェックインしました。今日も一日よろしくお願いします！','ja','active','2016-07-25 16:20:28',11,NULL,NULL,NULL,NULL),(397,'năm','年','ja','active','2016-07-25 16:29:55',57,NULL,NULL,NULL,NULL),(398,'Tháng :month năm :year','月:month 年:year','ja','active','2016-07-25 16:34:09',57,NULL,NULL,NULL,NULL),(399,'Nghỉ có lương/結婚休暇 (Nghỉ đám hiếu hỉ, tang gia, .đươc nghỉ theo quy định của pháp luật)','結婚休暇','ja','active','2016-07-25 16:35:49',57,NULL,NULL,NULL,NULL),(400,'Checkout at: :time',':timeにチェックアウト','ja','active',NULL,NULL,NULL,NULL,NULL,NULL),(401,'Checkin at: :time',':timeにチェックイン','ja','active',NULL,NULL,NULL,NULL,NULL,NULL),(402,'Team Leader','チームリーダー','ja','active','2016-07-26 15:29:12',11,NULL,NULL,NULL,NULL),(403,'Leader','リーダー','ja','active','2016-07-26 15:29:23',11,NULL,NULL,NULL,NULL),(404,'Staff','一般','ja','active','2016-07-26 15:29:31',11,'2016-07-26 15:58:05',11,NULL,NULL),(405,'Director','社長','ja','active','2016-07-26 15:29:40',11,NULL,NULL,NULL,NULL),(406,'Overtime On','業時間(今月)','ja','active','2016-07-26 15:33:34',11,NULL,NULL,NULL,NULL),(407,'Japan','日本語','ja','delete','2016-07-26 15:38:04',11,'2016-08-04 12:00:39',57,'2016-08-04 12:00:39',57),(408,'Vietnam','ベトナム語','ja','delete','2016-07-26 15:38:12',11,'2016-07-26 15:38:39',11,'2016-07-26 15:38:39',11),(409,'IT Team 1','開発チーム１','ja','active','2016-07-26 16:14:09',11,'2016-07-26 16:16:35',11,NULL,NULL),(410,'IT Team 2','開発チーム２','ja','active','2016-07-26 16:14:18',11,'2016-07-26 16:16:44',11,NULL,NULL),(411,'SP Team','サポートチーム','ja','active','2016-07-26 16:14:27',11,'2016-07-26 16:17:10',11,NULL,NULL),(412,'FM Team','FMチーム','ja','active','2016-07-26 16:14:41',11,'2016-07-26 16:17:23',11,NULL,NULL),(413,'Admin Team','管理','ja','active','2016-07-26 16:14:48',11,'2016-07-26 16:17:42',11,NULL,NULL),(414,'Accounting Team','ベトナム経理チーム','ja','active','2016-07-26 16:14:54',11,'2016-07-26 16:17:54',11,NULL,NULL),(415,'VM Team','ベトナムVMチーム','ja','active','2016-07-26 16:15:00',11,'2016-07-26 16:18:02',11,NULL,NULL),(416,'BPO Team','BPOチーム','ja','active','2016-07-26 16:15:11',11,'2016-07-26 16:18:13',11,NULL,NULL),(417,'Web Marketing Team','ベトナムWEBチーム','ja','active','2016-07-26 16:15:19',11,'2016-07-26 16:18:21',11,NULL,NULL),(418,'Design Team','設計チーム','ja','active','2016-07-26 16:15:26',11,'2016-07-26 16:18:30',11,NULL,NULL),(419,'Check','チェック','ja','active','2016-07-26 16:36:59',57,'2016-07-26 16:37:38',57,NULL,NULL),(420,'Staff ID','社員番号','en','delete','2016-07-29 13:36:28',4,'2016-08-01 11:37:06',57,'2016-08-01 11:37:06',57),(421,'Work Start Date','入社日','ja','active','2016-07-29 14:04:34',4,NULL,NULL,NULL,NULL),(422,'Worked Days','勤続日数','ja','active','2016-07-29 14:04:45',4,NULL,NULL,NULL,NULL),(423,'Age','年齢','ja','active','2016-07-29 14:04:54',4,NULL,NULL,NULL,NULL),(424,'Date End Work','退社日','ja','active','2016-07-29 14:05:03',4,NULL,NULL,NULL,NULL),(425,'Probation Contract Date','試用契約日','ja','active','2016-07-29 14:05:14',4,NULL,NULL,NULL,NULL),(426,'Newest Contract Date','最新契約日','ja','active','2016-07-29 14:05:23',4,NULL,NULL,NULL,NULL),(427,'Allow Approve','承認可能','ja','active','2016-07-29 14:05:34',4,NULL,NULL,NULL,NULL),(428,'Please choose right format image and limit size <= 2MB','２MB制限で、正しい拡張子の写真を選択してください','ja','active','2016-08-01 11:37:22',57,'2016-08-01 11:43:57',57,NULL,NULL),(429,'Drop images here or click to upload','ここに写真を入れて、クリックしてアップロードします','ja','active','2016-08-01 11:38:28',57,NULL,NULL,NULL,NULL),(430,'Total Time','合計時間','ja','active','2016-08-01 16:09:16',57,NULL,NULL,NULL,NULL),(431,'Total Time (hour)','合計時間（時間）','ja','active','2016-08-01 16:09:46',57,NULL,NULL,NULL,NULL),(432,'Created Date','作成日','ja','active','2016-08-01 17:39:24',57,NULL,NULL,NULL,NULL),(433,'Your absence form on :date is approved successful',':dateの欠勤申請が承認されました','ja','active','2016-08-04 11:51:20',57,NULL,NULL,NULL,NULL),(434,'Your absence form on :date is denied',':dateの欠勤申請が否認されました','ja','active','2016-08-04 11:51:37',57,NULL,NULL,NULL,NULL),(435,'Your overtime form on :date is approved successful',':dateの残業申請が承認されました','ja','active','2016-08-04 11:51:57',57,NULL,NULL,NULL,NULL),(436,'Your overtime form on :date is denied',':dateの残業申請が否認されました','ja','active','2016-08-04 11:52:13',57,NULL,NULL,NULL,NULL),(437,'Cancel the Trade Union Registration for :user_name',':user_nameさんの組合登録をキャンセルします','ja','active','2016-08-05 15:41:55',57,NULL,NULL,NULL,NULL),(438,'Cancel the Heath Care Insurance for :user_name',':user_nameさんの健康保険をキャンセルします','ja','active','2016-08-05 15:42:07',57,NULL,NULL,NULL,NULL),(439,'Collect the Health Insurance card, cancel the Social Insurance for :user_name',':user_nameさんの健康保険カードを回収して、社会保険をキャンセルします','ja','active','2016-08-05 15:42:16',57,NULL,NULL,NULL,NULL),(440,'Cancel Trade Union','組合キャンセル','ja','active','2016-08-05 15:42:26',57,NULL,NULL,NULL,NULL),(441,'Cancel Health Care','健康保険キャンセル','ja','active','2016-08-05 15:42:50',57,NULL,NULL,NULL,NULL),(442,'Collect Health Insurance','健康保険カード回収','ja','active','2016-08-05 15:43:00',57,NULL,NULL,NULL,NULL),(443,'You don\'t have any notification','通知はありません','ja','active','2016-08-05 17:17:33',57,NULL,NULL,NULL,NULL),(444,'Whole Company','全社','ja','active','2016-08-10 11:50:52',1,NULL,NULL,NULL,NULL),(445,'General Data','概要情報','ja','active','2016-08-10 11:51:07',1,NULL,NULL,NULL,NULL),(446,'Statistical Chart','チャート集計','ja','active','2016-08-10 11:51:49',1,NULL,NULL,NULL,NULL),(447,'Monthly Overtime','月次残業','ja','active','2016-08-10 11:52:01',1,NULL,NULL,NULL,NULL),(448,'Monthly Absence','月次欠勤','ja','active','2016-08-10 11:52:15',1,NULL,NULL,NULL,NULL),(449,'Monthly Employee Start Work','月次新入社員','ja','active','2016-08-10 11:52:27',1,NULL,NULL,NULL,NULL),(450,'Monthly Employee End Work','月次退社社員','ja','active','2016-08-10 11:52:40',1,NULL,NULL,NULL,NULL),(451,'Click to view statistics of this month','今月の集計をクリックして、閲覧します','ja','active','2016-08-10 11:52:50',1,'2016-08-10 11:55:27',1,NULL,NULL),(452,'People','人','ja','active','2016-08-10 11:53:05',1,NULL,NULL,NULL,NULL),(453,'Person','人','ja','active','2016-08-10 11:53:11',1,NULL,NULL,NULL,NULL),(454,'Statistic','集計','ja','active','2016-08-10 11:53:35',1,NULL,NULL,NULL,NULL),(455,'Print chart','チャート印刷','ja','active','2016-08-10 11:53:47',1,NULL,NULL,NULL,NULL),(456,'Download PNG image','PNG画像ダウンロード','ja','active','2016-08-10 11:53:57',1,NULL,NULL,NULL,NULL),(457,'Download JPEG image','JPEG画像ダウンロード','ja','active','2016-08-10 11:54:09',1,NULL,NULL,NULL,NULL),(458,'Download PDF document','PDFドキュメントダウンロード','ja','active','2016-08-10 11:54:19',1,NULL,NULL,NULL,NULL),(459,'Download SVG vector image','SVG画像ダウンロード','ja','active','2016-08-10 11:54:30',1,NULL,NULL,NULL,NULL),(460,'Employee Last Updated','最新更新社員','ja','active','2016-08-10 11:54:42',1,NULL,NULL,NULL,NULL),(461,'Time Last Updated','最新更新時間','ja','active','2016-08-10 11:54:54',1,NULL,NULL,NULL,NULL),(462,'Update notification successful.','通知を更新しました','ja','active','2016-08-10 11:55:05',1,NULL,NULL,NULL,NULL),(463,'Don\'t have data in this month. Please select another month.','今月はデータがありません。別の月を選択してください','ja','active','2016-08-10 17:11:10',1,NULL,NULL,NULL,NULL),(464,'Statistical Data in','集計データ','ja','active','2016-08-10 17:12:52',1,NULL,NULL,NULL,NULL),(465,'OT','残業','ja','active','2016-08-10 17:19:09',1,NULL,NULL,NULL,NULL),(466,'Shinsei resignation, make the resignation decision and liquidation contract for :user_name',':user_nameさんの退社申請を作成します','ja','active','2016-08-16 13:52:00',1,NULL,NULL,NULL,NULL),(467,'Collect the Health Insurance card, PVI Card, Asset Handover Of :user_name',':user_nameさんの健康保険カード、PVIカード、引き渡した資産を回収します','ja','active','2016-08-16 13:52:10',1,NULL,NULL,NULL,NULL),(468,'Work Handover with :user_name',':user_nameさんの仕事を引き継ぎます','ja','active','2016-08-16 13:52:26',1,NULL,NULL,NULL,NULL),(469,'Work Handover','仕事引き継ぐ','ja','active','2016-08-16 13:52:33',1,NULL,NULL,NULL,NULL),(470,'Collect Resource','資産回収','ja','active','2016-08-16 13:52:43',1,NULL,NULL,NULL,NULL),(471,'Shinsei Resignation','退社申請','ja','active','2016-08-16 13:52:51',1,NULL,NULL,NULL,NULL),(472,'Done','完了','ja','active','2016-08-16 13:52:58',1,NULL,NULL,NULL,NULL),(473,'Export Employees','社員出力','ja','active','2016-08-16 13:53:07',1,NULL,NULL,NULL,NULL),(474,'Select field to export','出力項目を選択します','ja','active','2016-08-16 13:53:15',1,NULL,NULL,NULL,NULL),(475,'Work End Date','退社日','ja','active','2016-08-16 13:53:27',1,NULL,NULL,NULL,NULL),(476,'Please select fields to export','出力項目を選択してください','ja','active','2016-08-16 13:53:36',1,NULL,NULL,NULL,NULL),(477,'Export member is successful','メンバーを出力しました','ja','active','2016-08-16 13:53:46',1,NULL,NULL,NULL,NULL),(478,'Statistical Data in','集計データ','en','delete','2016-08-16 13:53:55',1,'2016-08-18 11:10:10',1,'2016-08-18 11:10:10',1),(479,'Statistical Chart :type ON :month',':monthの:typeの集計チャート','ja','active','2016-08-16 15:31:25',1,NULL,NULL,NULL,NULL),(480,'Employee End Work','退社社員','ja','active','2016-08-16 15:31:51',1,NULL,NULL,NULL,NULL),(481,'Employee Start Work','入社社員','ja','active','2016-08-16 15:32:11',1,NULL,NULL,NULL,NULL),(482,'Import Timesheet','勤怠インポート','ja','active','2016-08-18 11:11:43',1,NULL,NULL,NULL,NULL),(483,'Import File','ファイルインポート','ja','active','2016-08-18 11:11:57',1,NULL,NULL,NULL,NULL),(484,'Sample file ( Template CSV )','サンプルファイル(テンプレートCSV)','ja','active','2016-08-18 11:12:12',1,NULL,NULL,NULL,NULL),(485,'Please choose right CSV format file','CSVフォーマットファイルを選択してください','ja','active','2016-08-18 11:12:28',1,NULL,NULL,NULL,NULL),(486,'Download','ダウンロード','ja','active','2016-08-18 11:14:46',1,NULL,NULL,NULL,NULL),(487,'No file selected','選択したファイルはありません','ja','active','2016-08-18 11:21:34',1,NULL,NULL,NULL,NULL),(488,'Choose File','ファイル選択','ja','active','2016-08-18 11:21:49',1,NULL,NULL,NULL,NULL),(489,'Employee','社員','ja','active','2016-08-18 14:42:45',1,NULL,NULL,NULL,NULL),(490,'Export Fields in Member','メンバー出力項目','ja','active','2016-08-18 14:43:54',1,NULL,NULL,NULL,NULL),(491,'Export Overtime of Member','メンバー残業出力','ja','active','2016-08-18 14:44:10',1,NULL,NULL,NULL,NULL),(492,'Year month','年月','ja','active','2016-08-18 14:44:19',1,NULL,NULL,NULL,NULL),(493,'Export overtime is successful','残業を出力しました','ja','active','2016-08-18 15:40:45',1,NULL,NULL,NULL,NULL),(494,'Export Absence of Member','メンバー欠勤出力','ja','active','2016-08-19 11:14:38',1,NULL,NULL,NULL,NULL),(495,'Please choose right the point time to export','時点を選択して出力します','ja','active','2016-08-19 11:25:54',1,NULL,NULL,NULL,NULL),(496,'Export absence is successful','欠勤を出力しました','ja','active','2016-08-19 11:26:13',1,NULL,NULL,NULL,NULL),(497,'Absence (Paid)','欠勤(有給)','ja','active','2016-08-19 11:26:29',1,NULL,NULL,NULL,NULL),(498,'Absence (Unpaid)','欠勤(無給)','ja','active','2016-08-19 11:26:41',1,NULL,NULL,NULL,NULL),(499,'Seniority','勤続年数','ja','active','2016-08-25 11:38:59',4,NULL,NULL,NULL,NULL),(500,'Salary Transfer Date','給料変換有給休暇','ja','active','2016-08-25 11:39:14',4,NULL,NULL,NULL,NULL),(501,'Vacation Day Remain','残り有給休暇','ja','active','2016-08-25 11:39:58',4,NULL,NULL,NULL,NULL),(502,'Export vacation day is successful','有給休暇を出力しました。','ja','active','2016-08-25 16:15:42',4,NULL,NULL,NULL,NULL),(503,'Drag & drop or choose photo to upload','ドラグドロプもしくは画像を選択してアップロードします','ja','active','2016-09-01 13:36:19',1,NULL,NULL,NULL,NULL),(504,'Background login page','ログイン画面の背景','ja','active','2016-09-01 13:36:33',1,NULL,NULL,NULL,NULL),(505,'General','一般','ja','active','2016-09-01 13:36:40',1,NULL,NULL,NULL,NULL),(506,'Change login background successful','ログイン画面の背景を変更しました','ja','active','2016-09-01 13:36:48',1,NULL,NULL,NULL,NULL),(507,'You can\'t remove background image','背景画像を削除できません','ja','active','2016-09-01 13:37:05',1,NULL,NULL,NULL,NULL),(508,'Are you sure to delete this image','この画像を削除して、よろしいですか？','ja','active','2016-09-01 13:37:14',1,NULL,NULL,NULL,NULL),(509,'Delete image successful','画像を削除しました','ja','active','2016-09-01 13:37:25',1,'2016-09-01 13:38:45',1,NULL,NULL),(510,'Configuration','設定','ja','active','2016-09-01 13:37:31',1,'2016-09-01 13:38:58',1,NULL,NULL),(511,'STT','順番','ja','active','2016-09-01 13:37:37',1,'2016-09-01 13:39:03',1,NULL,NULL),(512,'Họ và Tên','名前','ja','active','2016-09-01 13:37:44',1,'2016-09-01 13:39:07',1,NULL,NULL),(513,'Ngày ký hợp đồng chính thức','雇用契約締結日','ja','active','2016-09-01 13:37:51',1,'2016-09-01 13:39:12',1,NULL,NULL),(514,'Ngày nghỉ việc','退社日','ja','active','2016-09-01 13:37:57',1,'2016-09-01 13:39:17',1,NULL,NULL),(515,'Ngày phép thâm niên','勤続有給休暇','ja','active','2016-09-01 13:38:04',1,'2016-09-01 13:39:21',1,NULL,NULL),(516,'Số ngày phép đã sử dụng','使用済有給休暇','ja','active','2016-09-01 13:38:11',1,'2016-09-01 13:39:26',1,NULL,NULL),(517,'Tổng số ngày phép đã sử dụng','使用済有給休暇合計','ja','active','2016-09-01 13:38:17',1,'2016-09-01 13:39:30',1,NULL,NULL),(518,'Số ngày phép còn lại thực tế','残り有給休暇','ja','active','2016-09-01 13:38:24',1,'2016-09-01 13:39:34',1,NULL,NULL),(519,'THEO DÕI NGÀY NGHỈ PHÉP NĂM :year',':year年の有給休暇使用状況表','ja','active','2016-09-01 13:38:32',1,'2016-09-01 13:39:39',1,NULL,NULL),(520,'Ngày phép được hưởng năm :year',':year年の所有有給休暇','ja','active','2016-09-01 13:38:38',1,'2016-09-01 13:39:44',1,NULL,NULL),(521,'Intership ID','インターンシップID','ja','active','2016-09-13 09:10:30',1,NULL,NULL,NULL,NULL),(522,'Special Skill','特別なスキル','ja','active','2016-09-13 09:10:40',1,NULL,NULL,NULL,NULL),(523,'Route Approval Form','決裁ルート','ja','active','2016-09-13 09:14:25',1,'2016-10-10 17:26:59',1,NULL,NULL),(524,'Choose Department to set route','ルートの設定に部門を選択します','ja','active','2016-09-13 09:14:33',1,NULL,NULL,NULL,NULL),(525,'List Users','ユーザーリスト','ja','active','2016-09-13 09:14:53',1,NULL,NULL,NULL,NULL),(526,'Please choose Department to set route','ルートの設定に部門を選択してください','ja','active','2016-09-13 09:15:02',1,NULL,NULL,NULL,NULL),(527,'List Route Users','ルートユーザーリスト','ja','active','2016-09-13 09:15:11',1,NULL,NULL,NULL,NULL),(528,'Load Default Route','デフォールトルートをロードします','ja','active','2016-09-13 09:15:20',1,NULL,NULL,NULL,NULL),(529,'Create list route users is successful','ルートユーザーリストを作成しました','ja','active','2016-09-13 09:15:29',1,NULL,NULL,NULL,NULL),(530,'Are you sure to remove this user','このユーザーを削除します、よろしいでしょうか？','ja','active','2016-09-13 09:15:38',1,NULL,NULL,NULL,NULL),(531,'Asset Management','資産管理','ja','active','2016-10-07 08:58:30',1,NULL,NULL,NULL,NULL),(532,'Code Accounting','勘定科目','ja','active','2016-10-07 08:59:39',1,NULL,NULL,NULL,NULL),(533,'User','ユーザー','ja','active','2016-10-07 08:59:49',1,NULL,NULL,NULL,NULL),(534,'Handover By','引渡担当者','ja','active','2016-10-07 09:00:02',1,NULL,NULL,NULL,NULL),(535,'Category','カテゴリ','ja','active','2016-10-07 09:00:12',1,NULL,NULL,NULL,NULL),(536,'Price','値段','ja','active','2016-10-07 09:00:20',1,NULL,NULL,NULL,NULL),(537,'Store','購入先','ja','active','2016-10-07 09:00:29',1,NULL,NULL,NULL,NULL),(538,'Code Accounting','勘定科目','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(539,'User','ユーザー','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(540,'Handover By','引渡担当者','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(541,'Category','カテゴリ','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(542,'Price','値段','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(543,'Store','購入先','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(544,'Warranty','保証','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(545,'Expire Warranty Date','保証終了日','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(546,'Vat','付加価値','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(547,'Tax Price','税金','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(548,'Buying Date','購入日','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(549,'Allocation Date','割当日','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(550,'Expire Allocation Date','割当終了日','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(551,'Asset Detail','資産詳細','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(552,'Add New Asset Detail','資産詳細追加','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(553,'Update Asset Detail','資産詳細更新','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(554,'View Asset Detail','資産詳細閲覧','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(555,'Delete Asset Detail','資産詳細削除','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(556,'Print QR Code','QRコード印刷','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(557,'Quantity','数量','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(558,'Asset Category','資産カテゴリ','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(559,'Asset Handover','資産引渡','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(560,'Handover By','引渡担当者','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(561,'Handover Date','引渡日','ja','active','2016-10-07 09:01:42',1,NULL,NULL,NULL,NULL),(562,'View Handover Detail','引渡詳細閲覧','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(563,'SN','順番','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(564,'Please click \"Add Item\" to add new an item.','アイテムを追加するのに、「アイテム追加をクリックしてください」','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(565,'Add Item','アイテム追加','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(566,'Device','設備','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(567,'Asset Handover List','資産引渡リスト','ja','active','2016-10-07 09:01:43',1,'2016-10-07 09:03:13',1,NULL,NULL),(568,'Handover Form','引渡申請','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(569,'Asset Return','資産返却','ja','active','2016-10-07 09:01:43',1,'2016-10-07 09:03:32',1,NULL,NULL),(570,'Asset Return List','資産返却リスト','ja','active','2016-10-07 09:01:43',1,'2016-10-07 09:02:58',1,NULL,NULL),(571,'Return By','返却者','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(572,'Return Date','返却日','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(573,'View Return Detail','返却詳細閲覧','ja','active','2016-10-07 09:01:43',1,'2016-10-07 09:06:22',1,NULL,NULL),(574,'Return Form','返却申請','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(575,'Company\'s Asset','会社資産','ja','active','2016-10-07 09:01:43',1,'2016-10-07 09:04:09',1,NULL,NULL),(576,'Export CSV','CSV出力','ja','active','2016-10-07 09:01:43',1,NULL,NULL,NULL,NULL),(577,'Expire Allocation','割当終了日','ja','active','2016-10-07 09:21:00',1,NULL,NULL,NULL,NULL),(578,'Password doesn\'t exist','パスワードが存在していません','ja','active','2016-10-10 17:27:12',1,NULL,NULL,NULL,NULL),(579,'Not the same','重複しないでください','ja','active','2016-10-10 17:27:22',1,NULL,NULL,NULL,NULL),(580,'The password is at least 6 characters. It should contain number and uppercase character.','パスワードは最低6桁の限定で数字と大文字は必須です。','ja','active','2016-10-10 17:27:30',1,NULL,NULL,NULL,NULL),(581,'Please enter the new password.','新しいパスワードを入力してください','ja','active','2016-10-10 17:27:36',1,NULL,NULL,NULL,NULL),(582,'Your overtime form on :date is approved successfully',':dateの残業申請が承認されました','ja','active','2016-10-10 17:27:42',1,NULL,NULL,NULL,NULL),(583,'Not set','設定無し','ja','active','2016-10-10 17:27:48',1,NULL,NULL,NULL,NULL),(584,'List Return Form','返却申請リスト','ja','active','2016-10-10 17:27:55',1,NULL,NULL,NULL,NULL),(585,'List Handover Form','引渡申請リスト','ja','active','2016-10-10 17:28:05',1,NULL,NULL,NULL,NULL),(586,'List Assets','資産リスト','ja','active','2016-10-10 17:28:12',1,NULL,NULL,NULL,NULL),(587,'Assets','資産','ja','active','2016-10-10 17:28:19',1,NULL,NULL,NULL,NULL),(588,'Receive By','受領の方','ja','active','2016-10-10 17:28:27',1,NULL,NULL,NULL,NULL),(589,'Please choose category and select a device.','カテゴリと設備を選択してください','ja','active','2016-10-10 17:28:45',1,NULL,NULL,NULL,NULL),(590,'Delete Asset Category','資産削除カテゴリ','ja','active','2016-10-10 17:28:52',1,NULL,NULL,NULL,NULL),(591,'Update Asset Category','資産更新カテゴリ','ja','active','2016-10-10 17:28:59',1,NULL,NULL,NULL,NULL),(592,'Add New Asset Category','資産追加カテゴリ','ja','active','2016-10-10 17:29:06',1,NULL,NULL,NULL,NULL),(593,'Total Devices','合計設備','ja','active','2016-10-10 17:29:12',1,NULL,NULL,NULL,NULL),(594,'Useless Devices','不要設備','ja','active','2016-10-10 17:29:19',1,NULL,NULL,NULL,NULL),(595,'Available Devices','有効設備','ja','active','2016-10-10 17:29:27',1,NULL,NULL,NULL,NULL),(596,'Handover Devices','引渡設備','ja','active','2016-10-10 17:29:35',1,NULL,NULL,NULL,NULL),(597,'Địa chỉ: Tầng 4, tòa nhà Sài Gòn Prime, số 107-109-111, đường Nguyễn Đình Chiểu, P.6, Q.3, Tp. Hồ Chí Minh','住所：Sai Gon Primeビル4階、107-109-111、Nguyen Dinh Chieu通り、3区、ホーチミン市','ja','active','2016-10-24 09:50:59',1,NULL,NULL,NULL,NULL),(598,'Tp. Hồ Chí Minh, ngày   tháng :month năm :year','ホーチミン市:year年:month月   日','ja','active','2016-10-24 09:51:05',1,NULL,NULL,NULL,NULL),(599,'Làm ngoài giờ/ Over time (Hours)','残業(時間)','ja','active','2016-10-24 09:51:15',1,NULL,NULL,NULL,NULL),(600,'Over time on weekdays (150%)','平日残業 (150%)','ja','active','2016-10-24 09:51:20',1,NULL,NULL,NULL,NULL),(601,'Over time on weekly day-off (200%)','休日残業 (200%)','ja','active','2016-10-24 09:51:27',1,NULL,NULL,NULL,NULL),(602,'Over time on holiday (300%)','祝日残業 (300%)','ja','active','2016-10-24 09:51:34',1,NULL,NULL,NULL,NULL),(603,'Số ngày tăng ca','残業日数','ja','active','2016-10-24 09:51:39',1,NULL,NULL,NULL,NULL),(604,'Ghi chú (Note)','備考','ja','active','2016-10-24 09:51:45',1,NULL,NULL,NULL,NULL),(605,'Day Of Week','曜日','ja','active','2016-10-24 09:51:50',1,NULL,NULL,NULL,NULL),(606,'Department Code','部門コード','ja','active','2016-10-24 09:51:56',1,NULL,NULL,NULL,NULL),(607,'Department Name','部門名','ja','active','2016-10-24 09:52:02',1,NULL,NULL,NULL,NULL),(608,'BẢNG CHẤM CÔNG CHO NHÂN VIÊN LÀM NGOÀI GIỜ (TIME SHEET FOR OVER TIME)','残業社員の勤怠','ja','active','2016-10-28 11:19:04',1,NULL,NULL,NULL,NULL),(609,'TỔNG CỘNG (TOTAL)','合計','ja','active','2016-10-28 11:19:19',1,NULL,NULL,NULL,NULL),(610,'Create Form-Leave-Job','退職申請作成','ja','active','2017-03-22 09:07:34',1,NULL,NULL,NULL,NULL),(611,'Leave Job Form','退職申請','ja','active','2017-03-22 09:07:43',1,NULL,NULL,NULL,NULL),(612,'This form will be deleted.','この申請が削除される','ja','active','2017-03-22 09:07:50',1,NULL,NULL,NULL,NULL),(613,'Create a Leave Job Form is successfull.','退職申請を作成しました','ja','active','2017-03-22 09:08:00',1,NULL,NULL,NULL,NULL),(614,'Update Leave Job Form is successfull.','退職申請を更新しました','ja','active','2017-03-22 09:08:08',1,NULL,NULL,NULL,NULL),(615,'Approve Leave Job Form is successfull.','退職申請を承認しました','ja','active','2017-03-22 09:08:18',1,NULL,NULL,NULL,NULL),(616,'Deny Leave Job Form is successfull.','退職申請を否認しました','ja','active','2017-03-22 09:08:26',1,NULL,NULL,NULL,NULL),(617,'Destroy Form Leave Job','退職申請を破棄します','ja','active','2017-03-22 09:08:35',1,NULL,NULL,NULL,NULL),(618,'Leave Job','退職','ja','active','2017-03-22 09:08:43',1,NULL,NULL,NULL,NULL),(619,'Your leave job form on :date is approved successfully',':dateの退職申請は承認されました','ja','active','2017-03-22 09:08:51',1,NULL,NULL,NULL,NULL),(620,'Your leave job form on :date is denied',':dateの退職申請は否認されました','ja','active','2017-03-22 09:08:59',1,NULL,NULL,NULL,NULL),(621,'Your leave job form on :date is destroyed',':dateの退職申請は破棄されました','ja','active','2017-03-22 09:09:08',1,NULL,NULL,NULL,NULL),(622,'The Form Leave Job exists. You cant create a new form.','退職申請は既に存在していますので、新規申請を作成できません','ja','active','2017-03-22 09:09:16',1,NULL,NULL,NULL,NULL),(623,':user_name\'s leave job form is waiting for approving',':user_nameの退職申請は承認待ちの状態です','ja','active','2017-03-22 09:16:57',1,NULL,NULL,NULL,NULL),(624,'Your absence form on :date is approved successfully',':dateの欠勤申請は承認されました','ja','active','2017-03-22 09:23:26',1,NULL,NULL,NULL,NULL),(625,'Check In','出勤','ja','active','2017-06-08 10:19:26',1,NULL,NULL,NULL,NULL),(626,'Check Out','退勤','ja','active','2017-06-08 10:19:38',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `vsvn_translate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_user`
--

DROP TABLE IF EXISTS `vsvn_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) DEFAULT NULL,
  `username` varchar(150) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(150) NOT NULL,
  `avatar` text,
  `sex` enum('male','female') DEFAULT NULL COMMENT '0:female|1:male',
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `register_date` datetime DEFAULT NULL,
  `register_ip` varchar(50) DEFAULT NULL,
  `active_code` varchar(100) DEFAULT NULL,
  `last_change_password` datetime DEFAULT NULL,
  `token_access` varchar(150) DEFAULT NULL,
  `last_access` datetime DEFAULT NULL,
  `item_status` enum('active','inactive','delete') DEFAULT 'active' COMMENT 'active|inactive|delete',
  `created_at` datetime DEFAULT NULL,
  `created_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_user`
--

LOCK TABLES `vsvn_user` WRITE;
/*!40000 ALTER TABLE `vsvn_user` DISABLE KEYS */;
INSERT INTO `vsvn_user` VALUES (1,'Administrator','admin','admin@vision-net.co.jp','16a231d91cdfddf596caa4074e90896b',NULL,'male',NULL,NULL,'2016-02-08 00:01:01','192.168.153.27',NULL,'2017-08-03 13:48:05',NULL,NULL,'active','2016-02-08 00:01:01',NULL,'2017-08-03 13:48:05',1,NULL,NULL);
/*!40000 ALTER TABLE `vsvn_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_user_group`
--

DROP TABLE IF EXISTS `vsvn_user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_user_group` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_user_group`
--

LOCK TABLES `vsvn_user_group` WRITE;
/*!40000 ALTER TABLE `vsvn_user_group` DISABLE KEYS */;
INSERT INTO `vsvn_user_group` VALUES (1,5),(1,7),(2,1),(4,4),(4,5),(4,7),(5,2),(11,2),(13,1),(15,1),(19,1),(20,2),(21,4),(22,3),(23,3),(24,4),(24,6),(25,2),(31,1),(32,1),(33,1),(35,2),(36,1),(37,1),(38,1),(39,5),(43,3),(44,1),(48,1),(50,1),(52,1),(53,1),(57,1),(57,5),(57,7),(58,1),(59,1),(60,2),(62,3),(63,1),(63,2),(64,1),(65,1),(66,1),(67,1),(68,1),(69,1),(70,1),(70,5),(70,8),(71,1),(72,1),(73,1),(74,1),(75,1),(76,3),(77,2),(78,1),(79,1),(80,1),(81,1),(82,1),(83,1),(83,5),(83,7),(84,1),(84,3),(85,1),(86,1),(87,1),(88,1),(89,1),(90,1),(91,1),(92,1),(93,2),(96,1),(98,1),(99,1),(102,1),(103,1),(104,1),(105,1),(108,5),(108,6),(109,1),(110,1),(111,1),(112,1),(113,1),(114,1),(115,1),(116,1),(117,1),(118,1),(119,1),(120,1),(121,1),(122,1),(123,1),(124,1),(125,1),(126,1),(127,1),(128,1);
/*!40000 ALTER TABLE `vsvn_user_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsvn_user_role`
--

DROP TABLE IF EXISTS `vsvn_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vsvn_user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsvn_user_role`
--

LOCK TABLES `vsvn_user_role` WRITE;
/*!40000 ALTER TABLE `vsvn_user_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `vsvn_user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-09-06 11:05:30
