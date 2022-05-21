-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 21 mai 2022 à 14:35
-- Version du serveur : 5.7.36
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groupomaniadb`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `comments_id` int(11) NOT NULL AUTO_INCREMENT,
  `comments_author` int(11) NOT NULL,
  `comments_publication` int(11) NOT NULL,
  `comments_texte` varchar(255) NOT NULL,
  `comments_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments_status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`comments_id`),
  KEY `comments_author` (`comments_author`),
  KEY `comments_publication` (`comments_publication`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `publications`
--

DROP TABLE IF EXISTS `publications`;
CREATE TABLE IF NOT EXISTS `publications` (
  `publications_id` int(11) NOT NULL AUTO_INCREMENT,
  `publications_author` int(11) NOT NULL,
  `publications_title` varchar(255) NOT NULL,
  `publications_texte` varchar(255) NOT NULL,
  `publications_image` text NOT NULL,
  `publications_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `publications_status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`publications_id`),
  KEY `publications_author` (`publications_author`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `users_id` int(11) NOT NULL AUTO_INCREMENT,
  `users_name` varchar(255) NOT NULL,
  `users_firstname` varchar(255) NOT NULL,
  `users_mail` text NOT NULL,
  `users_password` text NOT NULL,
  `users_status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`users_id`, `users_name`, `users_firstname`, `users_mail`, `users_password`, `users_status`) VALUES
(12, 'default', 'admin', 'defaultAdmin@defaultAdmin.com', '$2b$10$9wea2ZPMz1E0LmppLAYI3uHqL9AaWfcpT36XPKKnMa9IHcShEKt5a', 2);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`comments_author`) REFERENCES `users` (`users_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`comments_publication`) REFERENCES `publications` (`publications_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `publications`
--
ALTER TABLE `publications`
  ADD CONSTRAINT `publications_ibfk_1` FOREIGN KEY (`publications_author`) REFERENCES `users` (`users_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
