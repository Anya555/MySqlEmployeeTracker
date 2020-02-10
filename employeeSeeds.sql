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
     role_id INTEGER REFERENCES role(id),
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
    salary DECIMAL(6,3) NOT NULL,

    -- foreign key --
    department_id INTEGER REFERENCES department(id),

    PRIMARY KEY (id)
);


INSERT INTO role (title, salary, department_id)
VALUES ("Sales person", 80, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Sales lead", 90, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 95, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software engineer", 75, 2); 
-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Lawyer", 100, 3);
-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Paralegal", 70, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joanne", "Reed", 1, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Enthony", "Grey", 2, 2);