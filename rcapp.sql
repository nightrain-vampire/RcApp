-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1
-- 生成日期： 2022-04-28 17:46:18
-- 服务器版本： 10.4.19-MariaDB
-- PHP 版本： 7.4.19

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
  `pic` varchar(5000) DEFAULT NULL,
  `state` int(11) NOT NULL DEFAULT 1 COMMENT '表示审核状态，0表示草稿（未实现），1表示待审批，2表示审批通过，3表示审批不通过',
  `reason` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `nominee`
--

INSERT INTO `nominee` (`id`, `userid`, `name`, `intro`, `votes`, `pic`, `state`, `reason`) VALUES
(55, '3', '程度', '地方', 0, 'https://tuanyi.fudan.edu.cn/static/8lPGEfXkHlQra29c9479b3421c05835301b5c988ad46.png', 2, '程度'),
(56, '3', '11', '111', 7, 'https://tuanyi.fudan.edu.cn/static/wHfmDX0BVlxW7e016b257adde4b5c3613731af4a30f0.png,https://tuanyi.fudan.edu.cn/static/QXvo4uUqmQU7bdd81148e5b3e133d3db58780c216240.png', 2, '11'),
(57, '3', '得分', '但是是的', 0, 'https://tuanyi.fudan.edu.cn/static/B4bKBmXV9e8r9af0cc4fc95d79903d57c66fb304dfc6.png,https://tuanyi.fudan.edu.cn/static/OcV3ZP97JwcK8ba447102c6cc6cca714e3110f1a11b2.png,https://tuanyi.fudan.edu.cn/static/BEIrQYwTCYeDff81a04950d024017b913276ae285a77.png', 1, '是的'),
(58, '3', '所得到', '得到的', 0, 'https://tuanyi.fudan.edu.cn/static/Geyx5D1hcNk6ff81a04950d024017b913276ae285a77.png', 1, '顶顶顶顶');

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
(3, 'mock0', '1930713000', 3, '2022-04-28');

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
(33, 3, '127.0.0.1', 35, '2022-04-24 11:09:49'),
(34, 3, '10.230.37.83', 30, '2022-04-25 06:24:31'),
(35, 3, '10.230.37.83', 35, '2022-04-25 06:30:28'),
(36, 3, '61.129.42.28', 56, '2022-04-28 15:30:53'),
(37, 3, '61.129.42.28', 56, '2022-04-28 15:31:34'),
(38, 3, '61.129.42.28', 56, '2022-04-28 15:35:46'),
(39, 3, '61.129.42.28', 56, '2022-04-28 15:38:07'),
(40, 3, '61.129.42.28', 56, '2022-04-28 15:40:03'),
(41, 3, '61.129.42.28', 56, '2022-04-28 15:41:21'),
(42, 3, '61.129.42.28', 56, '2022-04-28 15:42:44');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
