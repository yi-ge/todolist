CREATE TABLE IF NOT EXISTS `Board` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(80) NOT NULL ,
  `manageUsername` VARCHAR(120) NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE  TABLE IF NOT EXISTS `TaskList` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `boardId` INT UNSIGNED NOT NULL ,
  `listName` VARCHAR(80) NOT NULL ,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `fk_tasklists_boards`
    FOREIGN KEY (`boardid` )
    REFERENCES `boards` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE INDEX `fk_tasklists_boards_idx` ON `tasklists` (`boardid` ASC) ;

CREATE  TABLE IF NOT EXISTS `Task` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `tasklistid` INT UNSIGNED NOT NULL ,
  `taskname` VARCHAR(199) NOT NULL ,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `fk_tasks_tasklists1`
    FOREIGN KEY (`tasklistid` )
    REFERENCES `tasklists` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE INDEX `fk_tasks_tasklists1_idx` ON `tasks` (`tasklistid` ASC) ;

