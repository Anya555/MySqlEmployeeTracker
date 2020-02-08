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

-- -- seeding a schema (adding data to tables) --

-- -- employees --
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Joanne", "Reed", 1, 5);
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Enthony", "Grey", 3, 2);
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Mary", "White", 4, 9);
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("John", "Smith", 6, null);
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Lily", "Wilson", 2, 8);

-- -- departments --
-- INSERT INTO department (name)
-- VALUES ("HR");
-- INSERT INTO department (name)
-- VALUES ("Marketing");
-- INSERT INTO department (name)
-- VALUES ("Finance");
-- INSERT INTO department (name)
-- VALUES ("Operations");

-- -- role --
-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Director", 100, 3);
-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Accountant", 90, 7);
-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Data analyst", 85, 1);
-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Project nanager", 90, 5);