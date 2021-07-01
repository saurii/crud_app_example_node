create database if not exists admin_crudapp;

use admin_crudapp;

CREATE TABLE `rolemaster` (
	`roleid` int8 unsigned not null unique auto_increment,
    `rolename` VARCHAR(20) NOT NULL,
    `createdby` VARCHAR(50) NOT NULL,
    `createddate` DATETIME NOT NULL,
    `lastmodifiedby` VARCHAR(50),
    `lastmodifieddate` DATETIME,
    `isactive` boolean not null,
    PRIMARY KEY (roleid),
    INDEX (rolename)
);

CREATE TABLE `usermaster` (
	`usermasterid` int8 unsigned not null unique auto_increment,
    `firstname` VARCHAR(60),
    `middlename` VARCHAR(60),
    `lastname` VARCHAR(60),
    `roleid` int8 unsigned NOT NULL,
    `mobileno` VARCHAR(15) NOT NULL,
    `address` TEXT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdby` VARCHAR(50) NOT NULL,
    `createddate` DATETIME NOT NULL,
    `lastmodifiedby` VARCHAR(50),
    `lastmodifieddate` DATETIME,
    `isactive` boolean not null,
    PRIMARY KEY (usermasterid),
    FOREIGN KEY (`roleid`)
        REFERENCES rolemaster (`roleid`)
        ON DELETE no action ON UPDATE CASCADE,
    INDEX (username),
    INDEX (mobileno)  
);

CREATE TABLE `post` (
	`postid` int8 unsigned not null unique auto_increment,
    `title` VARCHAR(60) NOT NULL,
    `postdescription` VARCHAR(300) NOT NULL,
    `createdby` VARCHAR(50) NOT NULL,
    `createddate` DATETIME NOT NULL,
    `lastmodifiedby` VARCHAR(50),
    `lastmodifieddate` DATETIME,
    `isactive` boolean not null,
    PRIMARY KEY (postid)
);

CREATE TABLE `logdetails` (
	`logconfigid` int8 unsigned not null unique auto_increment,
    `logdetails` JSON not null,
    `createdby` VARCHAR(50) NOT NULL,
    `createddate` DATETIME NOT NULL,
    `lastmodifiedby` VARCHAR(50),
    `lastmodifieddate` DATETIME,
    `isactive` boolean not null,
    PRIMARY KEY (logconfigid)
);


/** For admin entry **/
insert into usermaster(firstname,middlename,lastname,roleid,mobileno,username,password,createdby,createddate,isactive)
values('admin',null,'doe',1,'9988776655','admin@','admin@','9988776655',now(),true)