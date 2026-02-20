-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2025 at 09:12 AM
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
-- Database: `nutriscan`
--

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','warning','alert','success') DEFAULT 'info',
  `related_scan_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `related_scan_id`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 1, '📅 Product Expiring Soon', '\"Amul\" will expire in 3 day(s). Consider using it soon.', 'info', 1, 1, '2025-11-27 08:03:39', '2025-11-27 08:10:44'),
(2, 1, '📅 Product Expiring Soon', '\"Amul\" will expire in 3 day(s). Consider using it soon.', 'info', 2, 1, '2025-11-27 08:03:39', '2025-11-27 08:10:45'),
(3, 1, '📅 Product Expiring Soon', '\"Amul\" will expire in 3 day(s). Consider using it soon.', 'info', 3, 1, '2025-11-27 08:03:39', '2025-11-27 08:10:46'),
(4, 1, '📅 Product Expiring Soon', '\"Amul\" will expire in 3 day(s). Consider using it soon.', 'info', 4, 1, '2025-11-27 08:03:39', '2025-11-27 08:10:46'),
(5, 1, '📅 Product Expiring Soon', '\"Amul\" will expire in 3 day(s). Consider using it soon.', 'info', 5, 1, '2025-11-27 08:03:39', '2025-11-27 08:10:46'),
(6, 1, '📅 Product Expiring Soon', '\"Amul\" will expire in 3 day(s). Consider using it soon.', 'info', 6, 1, '2025-11-27 08:03:39', '2025-11-27 08:10:46'),
(7, 1, '📅 Product Expiring Soon', '\"Amul\" will expire in 6 day(s). Consider using it soon.', 'info', 7, 1, '2025-11-27 08:03:39', '2025-11-27 08:10:46'),
(8, 1, '🚨 Product Expired!', '\"Bourniville\" has expired today. Please discard the product.', 'alert', 9, 1, '2025-11-27 08:03:39', '2025-11-27 08:10:46');

-- --------------------------------------------------------

--
-- Table structure for table `scans`
--

CREATE TABLE `scans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `front_image_url` varchar(500) DEFAULT NULL,
  `back_image_url` varchar(500) DEFAULT NULL,
  `extracted_text_front` text DEFAULT NULL,
  `extracted_text_back` text DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `manufacturing_date` varchar(100) DEFAULT NULL,
  `expiry_date` varchar(100) DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `analysis_result` text DEFAULT NULL,
  `health_recommendations` text DEFAULT NULL,
  `suitable_ages` text DEFAULT NULL,
  `shelf_life` varchar(100) DEFAULT NULL,
  `vegan_friendly` tinyint(1) DEFAULT 0,
  `cautions` text DEFAULT NULL,
  `alternative_products` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scans`
--

INSERT INTO `scans` (`id`, `user_id`, `front_image_url`, `back_image_url`, `extracted_text_front`, `extracted_text_back`, `product_name`, `manufacturing_date`, `expiry_date`, `ingredients`, `analysis_result`, `health_recommendations`, `suitable_ages`, `shelf_life`, `vegan_friendly`, `cautions`, `alternative_products`, `created_at`) VALUES
(1, 1, NULL, NULL, 'VIDEO\nFREE\nAmul\nDARK\nCHOCOLATE\nSUGAR\n55%', 'COCOA AND CHOCOLATE PR\nINGREDIENTS:\nMALTITOL, COCOA SOLIDS, COCOA BUTTER, PERMITTED\nEMULSIFIERS (E322, E476).\nCONTAINS ADDED FLAVOURS (ARTIFICIAL FLAVOURING\nSUBSTANCES - COCOA & VANILLA).\nTHIS CONTAINS MALTITOL\nPOLYOLS MAY HAVE LAXATIVE EFFECTS\nNO SUGAR ADDED IN THE PRODUCT', 'Amul', '2025-11-27', '2025-11-30', '[\"Based on general food composition\",\"Check actual product label for specific ingredients\"]', 'Basic food safety analysis. User has: diabetes, lactose intolerance. Manufactured: 2025-11-27, Expires: 2025-11-30. For personalized recommendations, consult the product label and your healthcare provider.', '{\"suitable\":[\"Generally safe food components when consumed in moderation\"],\"not_suitable\":[\"Check for specific allergens and ingredients that may interact with your health conditions\"],\"overall_verdict\":\"Please verify with actual product information and consult healthcare provider for personalized advice\"}', '{\"below_18\":true,\"above_18\":true,\"above_60\":true,\"reason\":\"General food safety guidelines apply\"}', 'Based on provided dates', 0, '[\"Always check for allergens\",\"Consult healthcare provider if you have specific health conditions\",\"Verify ingredients list on actual product packaging\",\"Check product freshness based on provided dates\"]', '[\"Fresh fruits and vegetables\",\"Whole grain products\",\"Low-sodium alternatives\",\"Sugar-free options where applicable\"]', '2025-11-27 06:44:14'),
(2, 1, NULL, NULL, 'VIDEO\nFREE\nAmul\nDARK\nCHOCOLATE\nSUGAR\n55%', 'COCOA AND CHOCOLATE PR\nINGREDIENTS:\nMALTITOL, COCOA SOLIDS, COCOA BUTTER, PERMITTED\nEMULSIFIERS (E322, E476).\nCONTAINS ADDED FLAVOURS (ARTIFICIAL FLAVOURING\nSUBSTANCES - COCOA & VANILLA).\nTHIS CONTAINS MALTITOL\nPOLYOLS MAY HAVE LAXATIVE EFFECTS\nNO SUGAR ADDED IN THE PRODUCT', 'Amul', '2025-11-27', '2025-11-30', '[\"Based on general food composition\",\"Check actual product label for specific ingredients\"]', 'Basic food safety analysis. User has: diabetes, lactose intolerance. Manufactured: 2025-11-27, Expires: 2025-11-30. For personalized recommendations, consult the product label and your healthcare provider.', '{\"suitable\":[\"Generally safe food components when consumed in moderation\"],\"not_suitable\":[\"Check for specific allergens and ingredients that may interact with your health conditions\"],\"overall_verdict\":\"Please verify with actual product information and consult healthcare provider for personalized advice\"}', '{\"below_18\":true,\"above_18\":true,\"above_60\":true,\"reason\":\"General food safety guidelines apply\"}', 'Based on provided dates', 0, '[\"Always check for allergens\",\"Consult healthcare provider if you have specific health conditions\",\"Verify ingredients list on actual product packaging\",\"Check product freshness based on provided dates\"]', '[\"Fresh fruits and vegetables\",\"Whole grain products\",\"Low-sodium alternatives\",\"Sugar-free options where applicable\"]', '2025-11-27 06:47:29'),
(3, 1, NULL, NULL, 'Amul\nFREE\nDARK\nCHOCOLATE\nSUGAR\nCHOC\n3000', 'INGREDIENTS:\nMALTITOL, COCOA SOLIDS, COCOA BUTTER, PERMITTED\nEMULSIFIERS (E322, E476).\nCONTAINS ADDED FLAVOURS (ARTIFICIAL FLAVOURING\nSUBSTANCES -COCOA & VANILLA).\nTMIS CONTAINS MALTITOL\nPOLYOLS MAY HAVE LAXATIVE EFFECTS\nNO SUGAR ADDED IN THE PRODUCT\nNOT RECOMMENDED FOR CHILDREN\nMANUFACTURED BY:\nmh thit citit', 'Amul', '2025-11-27', '2025-11-30', '[\"MALTITOL\",\"COCOA SOLIDS\",\"COCOA BUTTER\",\"PERMITTED EMULSIFIERS (E322, E476)\",\"ADDED FLAVOURS (ARTIFICIAL FLAVOURING SUBSTANCES -COCOA & VANILLA)\"]', 'The product is a sugar-free dark chocolate made with maltitol, which is a sugar alcohol. While it does not contain added sugars, maltitol can have a laxative effect, especially in individuals with lactose intolerance. The product is fresh as it has a manufacturing date of 2025-11-27 and an expiry date of 2025-11-30, indicating it is still within its shelf life. However, the presence of maltitol may not be suitable for someone with diabetes due to its carbohydrate content, which can affect blood sugar levels.', '{\"suitable\":[\"COCOA SOLIDS\",\"COCOA BUTTER\",\"PERMITTED EMULSIFIERS (E322, E476)\"],\"not_suitable\":[\"MALTITOL - may cause digestive issues and has a laxative effect\",\"ADDED FLAVOURS - may contain allergens or additives that could affect health\"],\"overall_verdict\":\"Not recommended for consumption due to the presence of maltitol, which can affect blood sugar levels and may cause digestive discomfort.\"}', '{\"below_18\":false,\"above_18\":true,\"above_60\":true,\"reason\":\"The product is not recommended for children due to the laxative effects of maltitol. Adults can consume it with caution, especially those above 60 who may have more sensitive digestive systems.\"}', '3 days from manufacturing date until expiry date, indicating very limited shelf life.', 1, '[\"Maltitol may cause digestive discomfort and has a laxative effect, especially for those with lactose intolerance.\",\"Not recommended for individuals with diabetes due to potential blood sugar impact.\"]', '[\"Sugar-free dark chocolate with erythritol\",\"Dark chocolate with stevia\",\"Cocoa nibs\"]', '2025-11-27 06:49:51'),
(4, 1, NULL, NULL, 'Amul\nFREE\nDARK\nCHOCOLATE\nSUGAR\nCHOC\n3000', 'INGREDIENTS:\nMALTITOL, COCOA SOLIDS, COCOA BUTTER, PERMITTED\nEMULSIFIERS (E322, E476).\nCONTAINS ADDED FLAVOURS (ARTIFICIAL FLAVOURING\nSUBSTANCES -COCOA & VANILLA).\nTMIS CONTAINS MALTITOL\nPOLYOLS MAY HAVE LAXATIVE EFFECTS\nNO SUGAR ADDED IN THE PRODUCT\nNOT RECOMMENDED FOR CHILDREN\nMANUFACTURED BY:\nmh thit citit', 'Amul', '2025-11-27', '2025-11-30', '[\"Maltitol\",\"Cocoa solids\",\"Cocoa butter\",\"Permitted emulsifiers (E322, E476)\",\"Artificial flavouring substances (Cocoa & Vanilla)\"]', 'The product is a sugar-free dark chocolate made with maltitol, which is a sugar alcohol that can have a laxative effect. It does not contain any added sugars, making it potentially suitable for individuals with diabetes. However, maltitol can still impact blood sugar levels, so moderation is advised. The product is lactose-free, making it suitable for individuals with lactose intolerance. There are no gluten-containing ingredients, making it safe for those with celiac disease. The product is fresh, as it is manufactured just a few days before the expiry date.', '{\"suitable\":[\"Cocoa solids\",\"Cocoa butter\",\"Permitted emulsifiers (E322, E476)\",\"Artificial flavouring substances (Cocoa & Vanilla)\"],\"not_suitable\":[\"Maltitol - may cause digestive issues due to laxative effects, especially in larger quantities.\"],\"overall_verdict\":\"The product is suitable for the user with diabetes and lactose intolerance, but caution is advised due to the presence of maltitol.\"}', '{\"below_18\":false,\"above_18\":true,\"above_60\":true,\"reason\":\"The product is not recommended for children due to the laxative effects of maltitol, but it is suitable for adults and seniors.\"}', 'The product has a very short shelf life of 3 days, as it is manufactured on 2025-11-27 and expires o', 1, '[\"Maltitol may have a laxative effect, especially if consumed in large quantities. Monitor intake to avoid digestive discomfort.\"]', '[\"Sugar-free dark chocolate with erythritol\",\"Lactose-free chocolate bars without sugar alcohols\"]', '2025-11-27 06:52:14'),
(5, 1, NULL, NULL, 'Amul\nFREE\nDARK\nCHOCOLATE\nSUGAR\nCHOC\n3000', 'INGREDIENTS:\nMALTITOL, COCOA SOLIDS, COCOA BUTTER, PERMITTED\nEMULSIFIERS (E322, E476).\nCONTAINS ADDED FLAVOURS (ARTIFICIAL FLAVOURING\nSUBSTANCES -COCOA & VANILLA).\nTMIS CONTAINS MALTITOL\nPOLYOLS MAY HAVE LAXATIVE EFFECTS\nNO SUGAR ADDED IN THE PRODUCT\nNOT RECOMMENDED FOR CHILDREN\nMANUFACTURED BY:\nmh thit citit', 'Amul', '2025-11-27', '2025-11-30', '[\"Maltitol\",\"Cocoa solids\",\"Cocoa butter\",\"Permitted emulsifiers (E322, E476)\",\"Artificial flavouring substances (Cocoa & Vanilla)\"]', 'The product is a sugar-free dark chocolate that uses maltitol as a sweetener. Given the user\'s diabetes, this product may be suitable as it does not contain added sugars. However, maltitol can have a laxative effect, which may be a concern for some individuals. The product is lactose-free, making it suitable for the user\'s lactose intolerance. The manufacturing date is in the future, which indicates that this product is not yet available for consumption, and thus, freshness cannot be assessed at this time.', '{\"suitable\":[\"Cocoa solids\",\"Cocoa butter\",\"Permitted emulsifiers (E322, E476)\",\"Artificial flavouring substances (Cocoa & Vanilla)\"],\"not_suitable\":[\"Maltitol - may cause digestive issues due to its laxative effect, especially for individuals sensitive to polyols.\"],\"overall_verdict\":\"Not suitable for consumption as the product is not yet available. Once available, it may be suitable for the user considering their health conditions.\"}', '{\"below_18\":false,\"above_18\":true,\"above_60\":true,\"reason\":\"The product contains maltitol, which is not recommended for children due to potential laxative effects.\"}', 'The product has a shelf life of 3 days from the manufacturing date until the expiry date.', 1, '[\"Maltitol may have a laxative effect, which could be problematic for some individuals, especially those with sensitive digestive systems.\"]', '[\"Sugar-free dark chocolate with erythritol\",\"Lactose-free dark chocolate bars\"]', '2025-11-27 06:53:44'),
(6, 1, NULL, NULL, 'Amul\nFREE\nDARK\nCHOCOLATE\nSUGAR\nCHOC\n3000', 'INGREDIENTS:\nMALTITOL, COCOA SOLIDS, COCOA BUTTER, PERMITTED\nEMULSIFIERS (E322, E476).\nCONTAINS ADDED FLAVOURS (ARTIFICIAL FLAVOURING\nSUBSTANCES -COCOA & VANILLA).\nTMIS CONTAINS MALTITOL\nPOLYOLS MAY HAVE LAXATIVE EFFECTS\nNO SUGAR ADDED IN THE PRODUCT\nNOT RECOMMENDED FOR CHILDREN\nMANUFACTURED BY:\nmh thit citit', 'Amul', '2025-11-27', '2025-11-30', '[\"MALTITOL\",\"COCOA SOLIDS\",\"COCOA BUTTER\",\"PERMITTED EMULSIFIERS (E322, E476)\",\"ADDED FLAVOURS (ARTIFICIAL FLAVOURING SUBSTANCES -COCOA & VANILLA)\"]', 'The product is a sugar-free dark chocolate made with maltitol, which is a sugar alcohol. This is beneficial for individuals with diabetes as it does not raise blood sugar levels significantly. However, maltitol can have a laxative effect, especially in larger quantities. The product does not contain any dairy, making it suitable for someone with lactose intolerance. The manufacturing date is in the future, indicating that the product is not yet available for consumption, and thus, the analysis of freshness is not applicable at this time.', '{\"suitable\":[\"COCOA SOLIDS\",\"COCOA BUTTER\",\"PERMITTED EMULSIFIERS (E322, E476)\"],\"not_suitable\":[\"MALTITOL - may cause laxative effects, especially for individuals with sensitive digestive systems.\"],\"overall_verdict\":\"Not suitable for consumption as the product is not yet manufactured. Once available, it may be suitable for the user considering their health conditions, but caution should be taken due to the presence of maltitol.\"}', '{\"below_18\":false,\"above_18\":true,\"above_60\":true,\"reason\":\"The product is not recommended for children due to the laxative effects of maltitol.\"}', 'The product has a very short shelf life of 3 days, which is unusual and may indicate a need for care', 1, '[\"Maltitol may cause digestive discomfort in sensitive individuals.\",\"Not recommended for children.\"]', '[\"Sugar-free dark chocolate with erythritol\",\"Dark chocolate with stevia\"]', '2025-11-27 06:56:40'),
(7, 1, NULL, NULL, 'FREE\nAmul\nDARK\nCHOCOLATE\nSUGAR\nDARH', 'INGREDIENTS:\nMALTITOL, COCOA SOLIDS, COCOA BUTTER, PERMITTED\nEMULSIFIERS (E322, E476).\nCONTAINS ADDED FLAVOURS (ARTIFICIAL FLAVOURING\nSUBSTANCES - COCOA & VANILLA).\nTHIS CONTAINS MALTITOL\nPOLYOLS MAY HAVE LAXATIVE EFFECTS\nNO SUGAR ADDED IN THE PRODUCT\nNOT RECOMMENDED FOR CHILDREN', 'Amul', '2025-11-27', '2025-12-03', '[\"Maltitol\",\"Cocoa solids\",\"Cocoa butter\",\"Permitted emulsifiers (E322, E476)\",\"Artificial flavouring substances - cocoa & vanilla\"]', 'The product is a dark chocolate with maltitol as a sweetener, which is suitable for individuals with diabetes as it does not contain sugar. However, maltitol can have a laxative effect, which may be a concern for some users. The product is lactose-free, making it suitable for individuals with lactose intolerance. There are no gluten-containing ingredients, so it is safe for those with celiac disease. The product is fresh, as it is manufactured just a few days before the expiry date.', '{\"suitable\":[\"Maltitol\",\"Cocoa solids\",\"Cocoa butter\",\"Permitted emulsifiers (E322, E476)\",\"Artificial flavouring substances - cocoa & vanilla\"],\"not_suitable\":[],\"overall_verdict\":\"The product is suitable for the user considering their health conditions, but they should consume it in moderation due to the potential laxative effect of maltitol.\"}', '{\"below_18\":false,\"above_18\":true,\"above_60\":true,\"reason\":\"The product is not recommended for children due to the laxative effects of maltitol.\"}', 'The product has a shelf life of 6 days from the manufacturing date, which is quite short, indicating', 1, '[\"Maltitol may have laxative effects, especially if consumed in large quantities.\"]', '[\"Sugar-free dark chocolate\",\"Lactose-free chocolate bars\"]', '2025-11-27 06:59:53'),
(8, 1, NULL, NULL, 'Cabury\nBournville\nFRUIT & NUT\n50%', 'Ingredients\nSugar, Cocoa Butter (24%*), Cocoa Solids (18%*), Raisins\n(7.5%*), Cashew Nuts (4%,*), Apricot Kernels (4%*), Milk\nSolids, Emulsifiers (442, 476), Nature Identical Flavouring\nSubstances. Allergen Information: Contains Milk, Apricot\nKernals, Sulphites. May Contain other Tree Nuts, Soy.', 'Cabury', '2025-11-27', '2025-12-10', '[\"Sugar\",\"Cocoa Butter\",\"Cocoa Solids\",\"Raisins\",\"Cashew Nuts\",\"Apricot Kernels\",\"Milk Solids\",\"Emulsifiers\",\"Nature Identical Flavouring Substances\"]', 'The product contains sugar, which can significantly affect blood glucose levels, making it unsuitable for individuals with diabetes. Additionally, it contains milk solids, which are not suitable for those with lactose intolerance. The presence of cashew nuts and apricot kernels may pose a risk for individuals with nut allergies. The product is within its shelf life, as the manufacturing date is in the future, and the expiry date is shortly after that.', '{\"suitable\":[],\"not_suitable\":[\"Sugar - can spike blood glucose levels for diabetics.\",\"Milk Solids - not suitable for lactose intolerant individuals.\",\"Cashew Nuts - potential allergen for those with nut allergies.\",\"Apricot Kernels - potential allergen for those with nut allergies.\"],\"overall_verdict\":\"Not suitable for the user due to diabetes and lactose intolerance.\"}', '{\"below_18\":false,\"above_18\":true,\"above_60\":false,\"reason\":\"While the product is not suitable for the user due to health conditions, it is generally suitable for adults above 18 without specific health concerns.\"}', 'The product is not yet manufactured, thus it cannot be consumed until the manufacturing date of 2025', 0, '[\"Contains sugar which can affect blood sugar levels.\",\"Contains milk solids which are not suitable for lactose intolerant individuals.\",\"Contains cashew nuts and apricot kernels which may trigger allergic reactions.\"]', '[\"Dark chocolate with no added sugar\",\"Nut-free chocolate bars\",\"Lactose-free chocolate options\"]', '2025-11-27 07:10:15'),
(9, 1, NULL, NULL, 'Ingredients\nSugar, Cocoa Butter (29%*), Cocoa Solids (22%*), Milk\nsolids, Emulsifiers (442, 476), Nature Identical Flavouring\nSubstances. Allergen Information: Contains Milk May\nContain Tree Nuts, Soy.', 'Surendranagar, Gujarat 30 va.\nF - Packed At. N/s Ameya Plastics, G. No: 258/. Kharabwadi Lic. No. 10019022010548\n(Pawar Basti), Taluka: Khed, District: Pune- 410 501.\nPkg Material Mfd by: Parksons Packaging Ltd. Regn. No. PR-09-MAH-03-AABCP6598E-23\nNet Wt.:\n75 g\n20195260\nCode.:\nPkd.:\nUse. By.:\nMRP RS.\n(Incl, of all taxes)\n7\n622202 325991>\nSCAN QR CODE TO\nUNLOCK THE WORLD\nOF CHOCOLATE\nRECIPES.\nFUN\nFACTS &\nMORE!', 'Bourniville', '2024-04-04', '2025-11-27', '[\"Sugar\",\"Cocoa Butter\",\"Cocoa Solids\",\"Milk solids\",\"Emulsifiers\",\"Nature Identical Flavouring Substances\"]', 'The product contains sugar, which can significantly impact blood sugar levels, making it unsuitable for someone with diabetes. Additionally, it contains milk solids, which are not suitable for individuals with lactose intolerance. The product is within its shelf life, having been manufactured recently in April 2024 and expiring in November 2025.', '{\"suitable\":[\"Cocoa Butter\",\"Cocoa Solids\",\"Emulsifiers\",\"Nature Identical Flavouring Substances\"],\"not_suitable\":[\"Sugar\",\"Milk solids\",\"Reason: Sugar can raise blood glucose levels, and milk solids can cause discomfort for those with lactose intolerance.\"],\"overall_verdict\":\"Not suitable for consumption due to high sugar content and presence of milk solids.\"}', '{\"below_18\":false,\"above_18\":true,\"above_60\":false,\"reason\":\"While the product is not suitable for the user due to health conditions, it is generally safe for adults without such conditions.\"}', 'Approximately 1 year and 7 months from the manufacturing date.', 0, '[\"Contains milk solids which may cause issues for lactose intolerant individuals.\",\"High sugar content may affect blood sugar levels in diabetics.\"]', '[\"Dark chocolate with no added sugar\",\"Cocoa powder without dairy\"]', '2025-11-27 07:26:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `diabetes` tinyint(1) DEFAULT 0,
  `high_blood_pressure` tinyint(1) DEFAULT 0,
  `nut_allergy` tinyint(1) DEFAULT 0,
  `lactose_intolerance` tinyint(1) DEFAULT 0,
  `celiac_disease` tinyint(1) DEFAULT 0,
  `heart_disease` tinyint(1) DEFAULT 0,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `age`, `gender`, `diabetes`, `high_blood_pressure`, `nut_allergy`, `lactose_intolerance`, `celiac_disease`, `heart_disease`, `is_verified`, `verification_token`, `created_at`, `updated_at`) VALUES
(1, 'Akash', '', '7795031310', '$2a$10$wVURdg0IeZAS7BYyuDpPleQAjZITRYibqK01qrDESZM.seewFi3OC', 50, 'Male', 1, 0, 0, 1, 0, 0, 0, NULL, '2025-11-27 02:26:42', '2025-11-27 02:26:42'),
(2, 'Neha', 'nehamk@gmail.com', '', '$2a$10$OweDDmOQkxb8B.6gS0bpxOOW48OUsK.jpWxmpvVn2erWzhid.Unw.', 21, 'Female', 1, 1, 1, 0, 0, 0, 0, NULL, '2025-11-27 07:19:30', '2025-11-27 07:19:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `related_scan_id` (`related_scan_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_is_read` (`is_read`);

--
-- Indexes for table `scans`
--
ALTER TABLE `scans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_phone` (`phone`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `scans`
--
ALTER TABLE `scans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`related_scan_id`) REFERENCES `scans` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `scans`
--
ALTER TABLE `scans`
  ADD CONSTRAINT `scans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
