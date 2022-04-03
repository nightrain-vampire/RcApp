-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1:3316
-- 生成日期： 2022-03-28 15:26:28
-- 服务器版本： 10.4.21-MariaDB
-- PHP 版本： 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `rcapp`
--

-- --------------------------------------------------------

--
-- 表的结构 `vote`
--

CREATE TABLE `vote` (
  `id` int(11) NOT NULL,
  `uid` varchar(15) NOT NULL,
  `name` varchar(15) NOT NULL,
  `intro` text NOT NULL,
  `votes` int(11) NOT NULL DEFAULT 0,
  `pic` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `vote`
--

INSERT INTO `vote` (`id`, `uid`, `name`, `intro`, `votes`, `pic`) VALUES
(0, '1930713001', '小赵', '选他就完事了', 100, NULL),
(1, '1930713002', '小王', '大佬orzorzorzorzorzorzorzorzorzorz', 150, NULL),
(2, '1930713003', '小钱', '瓦埃比八不', 46, NULL),
(3, '1930713004', '老崔', '肝上长了个人', 648, NULL),
(4, '1930713005', '名字', '简介', 19, NULL);

--
-- 转储表的索引
--

--
-- 表的索引 `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
