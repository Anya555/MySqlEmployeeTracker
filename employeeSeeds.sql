DROP DATABASE IF EXISTS tracker_db;DROP DATABASE IF EXISTS tracker_db;
-- creating database--
CREATE DATABASE tracker_db;
-- Makes it so all of the following code will affect tracker_db --
USE  tracker_db;

-- creating tables --

CREATE TABLE employee (
     id INTEGER (11) AUTO_INCREMENT NOT NULL,
     first_name VARCHAR (30)  NOT NULL,
     last_name VARCHAR (30) NOT NULL,
     role_id INTEGER (30) NOT NULL,
     manager_id INTEGER (30),
    PRIMARY KEY (id)
);

CREATE TABLE department (
     id INTEGER(11) AUTO_INCREMENT NOT NULL,
     name VARCHAR (50) NOT NULL,
     PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER (11) AUTO_INCREMENT NOT NULL,
    title VARCHAR (50) NOT NULL,
    salary DECIMAL(6,2) NOT NULL,
    department_id INTEGER  (11) NOT NULL,
     PRIMARY KEY (id)
);

