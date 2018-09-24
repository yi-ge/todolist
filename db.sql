CREATE TABLE IF NOT EXISTS `boards` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(80) NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE  TABLE IF NOT EXISTS `tasklists` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `boardid` INT UNSIGNED NOT NULL ,
  `listname` VARCHAR(80) NOT NULL ,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `fk_tasklists_boards`
    FOREIGN KEY (`boardid` )
    REFERENCES `boards` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_tasklists_boards_idx` ON `tasklists` (`boardid` ASC) ;

CREATE  TABLE IF NOT EXISTS `tasks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `tasklistid` INT UNSIGNED NOT NULL ,
  `taskname` VARCHAR(199) NOT NULL ,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `fk_tasks_tasklists1`
    FOREIGN KEY (`tasklistid` )
    REFERENCES `tasklists` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_tasks_tasklists1_idx` ON `tasks` (`tasklistid` ASC) ;

