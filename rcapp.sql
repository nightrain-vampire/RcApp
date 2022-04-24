-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1:3316
-- 生成日期： 2022-04-24 15:49:00
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
-- 表的结构 `nominee`
--

CREATE TABLE `nominee` (
  `id` int(11) NOT NULL,
  `userid` varchar(15) NOT NULL COMMENT '对应user表记录主键',
  `name` varchar(15) NOT NULL,
  `intro` text NOT NULL,
  `votes` int(11) NOT NULL DEFAULT 0,
  `pic` varchar(500) DEFAULT NULL,
  `state` int(11) NOT NULL DEFAULT 1 COMMENT '表示审核状态，0表示草稿（未实现），1表示待审批，2表示审批通过，3表示审批不通过',
  `reason` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `nominee`
--

INSERT INTO `nominee` (`id`, `userid`, `name`, `intro`, `votes`, `pic`, `state`, `reason`) VALUES
(30, '1', '崔晨昊', '测试0', 24, '../../../images/a1VJ9rLxsQkNd0b74fe8662fb2a482393d6f6b95792a.jpg,../../../images/aunzMApUc9vt0c694be617b86981b51606836d719258.jpg,../../../images/c37A2uxr2HUyff3e7b314733d90b3724b3c03de6da8b.jpg,../../../images/aJiaAPRmFHOed0902a83129276e00706a39e368b00c7.jpg', 2, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'),
(31, '2', '无图片测试', '测试1', 2, '', 1, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'),
(32, '1', '占位符', '测试2', 3, '../../../images/CyRzkT8QEFlNb33ea1eb75a593b5f919e4960f659419.jpg,../../../images/4yEdRwWcZJHBd498d06d230643fa9053c84077f58c7b.jpg', 1, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'),
(33, '2', 'dwhd', 'sqsS', 14, '../../../images/aIxqgc5YMk0wd498d06d230643fa9053c84077f58c7b.jpg,../../../images/7HmOMhiuUI1c9e4ab4d27d63d310bc1349d8056cd4d0.png', 1, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'),
(34, '1', 'qihao', 'taijule', 1, '../../../images/vXk4s2i69qL7d498d06d230643fa9053c84077f58c7b.jpg,../../../images/n7TfDG1J5yN05d90a5ddfeb5f1e24c9d5a262356ece0.png', 1, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'),
(35, '1', '老李', '修改后的理由', 20, '../../../images/ou5z5ADr8vEz7dbc614aaf3243bde440e9a311570350.jpg,../../../images/Bql4mQCO9Wf5ff3e7b314733d90b3724b3c03de6da8b.jpg,../../../images/y14PcyQzLl72d0902a83129276e00706a39e368b00c7.jpg', 2, '修改1'),
(36, '1', '肝帝', '测试4', 45, '../../../images/a1VJ9rLxsQkNd0b74fe8662fb2a482393d6f6b95792a.jpg,../../../images/aunzMApUc9vt0c694be617b86981b51606836d719258.jpg,../../../images/c37A2uxr2HUyff3e7b314733d90b3724b3c03de6da8b.jpg,../../../images/aJiaAPRmFHOed0902a83129276e00706a39e368b00c7.jpg', 2, '测试5'),
(37, '1', '测试10', '测试信息10', 0, '../../../images/pp0a7DBhN7V57dbc614aaf3243bde440e9a311570350.jpg,../../../images/xk7VsaVT5GZfff3e7b314733d90b3724b3c03de6da8b.jpg,../../../images/eMBWYc0jnQh8d0902a83129276e00706a39e368b00c7.jpg', 1, '测试理由10'),
(38, '1', '无图片', '信息', 0, '', 1, 'hhhhhhhhhhh'),
(39, '3', 'test777777', 'sadsasa', 0, '../../../images/2eSsJXcV72Vtc7316c31f1922c0373abfa139674197b.png', 1, 'hhhhhhhhhhd'),
(40, '3', '12121', 'f23f32f', 0, '../../../images/T9p5NGm8pxWj7dbc614aaf3243bde440e9a311570350.jpg,../../../images/0ETOItJ4JNayff3e7b314733d90b3724b3c03de6da8b.jpg,../../../images/6F1UN59TW5obd0902a83129276e00706a39e368b00c7.jpg', 1, '31212312e1e3d32dfr2ef31r');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `uid` varchar(30) NOT NULL,
  `leftvotes` int(11) NOT NULL DEFAULT 10,
  `lastvotetime` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `uid`, `leftvotes`, `lastvotetime`) VALUES
(1, 'QH', '19307130092', 0, '2022-04-17'),
(2, 'wthhh', '18302010000', 8, '2022-04-16'),
(3, 'mock0', '1930713000', 0, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `ip` varchar(64) DEFAULT NULL COMMENT '记录投票ip（非必要）',
  `Nomineeid` int(11) NOT NULL,
  `vote_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `votes`
--

INSERT INTO `votes` (`id`, `userid`, `ip`, `Nomineeid`, `vote_time`) VALUES
(1, 1, NULL, 30, '2022-04-16 12:46:00'),
(2, 2, NULL, 30, '2022-04-16 12:46:15'),
(3, 1, '127.0.0.1', 30, '2022-04-18 11:11:43'),
(4, 1, '127.0.0.1', 30, '2022-04-18 11:11:45'),
(5, 1, '127.0.0.1', 30, '2022-04-18 11:11:46'),
(6, 1, '127.0.0.1', 30, '2022-04-18 11:12:17'),
(7, 1, '127.0.0.1', 30, '2022-04-18 11:12:17'),
(8, 1, '127.0.0.1', 30, '2022-04-18 11:12:17'),
(9, 1, '127.0.0.1', 30, '2022-04-18 11:12:17'),
(10, 1, '127.0.0.1', 30, '2022-04-18 11:12:17'),
(11, 1, '127.0.0.1', 30, '2022-04-18 11:12:18'),
(12, 1, '127.0.0.1', 30, '2022-04-18 11:12:18'),
(13, 1, '127.0.0.1', 35, '2022-04-18 11:12:24'),
(14, 1, '127.0.0.1', 35, '2022-04-18 11:18:06'),
(15, 1, '127.0.0.1', 35, '2022-04-18 11:18:06'),
(16, 1, '127.0.0.1', 35, '2022-04-18 11:18:07'),
(17, 1, '127.0.0.1', 35, '2022-04-18 11:18:07'),
(18, 1, '127.0.0.1', 35, '2022-04-18 11:18:07'),
(19, 1, '127.0.0.1', 35, '2022-04-18 11:18:07'),
(20, 1, '127.0.0.1', 35, '2022-04-18 11:18:08'),
(21, 1, '127.0.0.1', 35, '2022-04-18 11:18:08'),
(22, 1, '127.0.0.1', 35, '2022-04-18 11:18:09'),
(23, 1, '127.0.0.1', 35, '2022-04-18 11:18:09'),
(24, 3, '127.0.0.1', 36, '2022-04-24 11:09:42'),
(25, 3, '127.0.0.1', 36, '2022-04-24 11:09:43'),
(26, 3, '127.0.0.1', 36, '2022-04-24 11:09:44'),
(27, 3, '127.0.0.1', 30, '2022-04-24 11:09:45'),
(28, 3, '127.0.0.1', 30, '2022-04-24 11:09:45'),
(29, 3, '127.0.0.1', 30, '2022-04-24 11:09:47'),
(30, 3, '127.0.0.1', 35, '2022-04-24 11:09:48'),
(31, 3, '127.0.0.1', 35, '2022-04-24 11:09:48'),
(32, 3, '127.0.0.1', 35, '2022-04-24 11:09:49'),
(33, 3, '127.0.0.1', 35, '2022-04-24 11:09:49');

--
-- 转储表的索引
--

--
-- 表的索引 `nominee`
--
ALTER TABLE `nominee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- 表的索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `nominee`
--
ALTER TABLE `nominee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
