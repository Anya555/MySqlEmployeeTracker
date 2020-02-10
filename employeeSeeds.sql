DROP DATABASE IF EXISTS tracker_db;DROP DATABASE IF EXISTS tracker_db;
-- creating database--
CREATE DATABASE tracker_db;
-- Makes it so all of the following code will affect tracker_db --
USE  tracker_db;

-- creating tables --
-- foreign keys are used to link parent table with it's children tables --

-- parent table --
CREATE TABLE employee (
     id INTEGER (11) AUTO_INCREMENT NOT NULL,
     first_name VARCHAR (30)  NOT NULL,
     last_name VARCHAR (30) NOT NULL,
     
     -- Foreign Key --
     role_id  INTEGER REFERENCES role(id),
     -- Foreign Key --
     manager_id INTEGER REFERENCES department(department_id),
    
    PRIMARY KEY (id)
);

-- child table --
CREATE TABLE department (
     id INTEGER(11) AUTO_INCREMENT NOT NULL,
     department VARCHAR (50) NOT NULL,
     manager VARCHAR (50) NOT NULL,
     PRIMARY KEY (id)
);

-- child table --
CREATE TABLE role (
    id INTEGER (11) AUTO_INCREMENT NOT NULL,
    title VARCHAR (50) NOT NULL,
    salary DECIMAL(6) NOT NULL,

    -- Foreign key --
    department_id INTEGER REFERENCES department(id),

    PRIMARY KEY (id)
);

-- -- seeding a schema (adding data to tables) --

INSERT INTO role (title, salary, department_id)
VALUES ("Sales person", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Sales lead", 90000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 95000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software engineer", 75000, 2); 


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joanne", "Reed", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Enthony", "Grey", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Melany", "Watson", 3, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jimmy", "Python", 4, 4);


INSERT INTO department (department, manager)
VALUES ("Sales", "Keith Black");
INSERT INTO department (department, manager)
VALUES ("Engineering", "Emma Jackson");

