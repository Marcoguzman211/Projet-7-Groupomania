-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : sam. 20 mars 2021 à 17:52
-- Version du serveur :  10.3.28-MariaDB
-- Version de PHP : 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bsbu2699_groupodb`
--

-- --------------------------------------------------------

--
-- Structure de la table `publications`
--

CREATE TABLE `publications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `titre` text COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin NOT NULL,
  `image_url` text COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `publications`
--

INSERT INTO `publications` (`id`, `user_id`, `creation_date`, `titre`, `description`, `image_url`) VALUES
(1, 1, '2021-03-20 16:52:06', 'Bienvenue sur Groupomania !', 'Il a été conçu pour favoriser les échanges entre collègues', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `prenom` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(60) COLLATE utf8_bin NOT NULL,
  `password` varchar(255) COLLATE utf8_bin NOT NULL,
  `bio` text COLLATE utf8_bin DEFAULT NULL,
  `access_level` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `bio`, `access_level`) VALUES
(1, 'Stephanie', 'Com', 'stephanierh@groupomania.fr', '$2b$10$thtuOhY5c3AzHMgEeDFJ/.19/AvQ4NNj5leYBGWDtpicTIePjnUHi', 'Modérateur du réseau social interne Groupomania.', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `publications`
--
ALTER TABLE `publications`
  ADD PRIMARY KEY (`id`,`user_id`),
  ADD KEY `fk_publication_user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `publications`
--
ALTER TABLE `publications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `publications`
--
ALTER TABLE `publications`
  ADD CONSTRAINT `fk_publication_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
