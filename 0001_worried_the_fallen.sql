CREATE TABLE `portfolio_holdings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coinId` varchar(64) NOT NULL,
	`coinName` varchar(255) NOT NULL,
	`coinSymbol` varchar(10) NOT NULL,
	`quantity` decimal(20,8) NOT NULL,
	`purchasePrice` decimal(20,8) NOT NULL,
	`purchaseDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_holdings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `price_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coinId` varchar(64) NOT NULL,
	`coinName` varchar(255) NOT NULL,
	`targetPrice` decimal(20,8) NOT NULL,
	`alertType` enum('above','below') NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `price_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'usd',
	`theme` enum('dark','light') NOT NULL DEFAULT 'dark',
	`refreshInterval` int NOT NULL DEFAULT 30,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_preferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coinId` varchar(64) NOT NULL,
	`coinName` varchar(255) NOT NULL,
	`coinSymbol` varchar(10) NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `watchlist_id` PRIMARY KEY(`id`)
);
