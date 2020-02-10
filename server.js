// adding dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');


// setting up connection between mysql server and mySql workbench
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "anya",
    database: "tracker_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadID);
    makeChoice();
});

// When application starts,  user is prompted to make initial  choice
function makeChoice() {
    inquirer.prompt([
        {
            type: "list",
            message: "Select what you'd like to do from a following list: ",
            name: "choice",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add an employee",
                "Add a department",
                "Add a role",
                "Update employee role",
                "Exit"
            ]
        }
    ]).then(function (answers) {
        // adding switch statement to handle which function gets executed based on user's choice
        switch (answers.choice) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            default:
                console.log("All changes have been saved");
                // if user chooses to exit, this ends all connection
                connection.end();
        }
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "fname",
            message: "Employee's first name: "
        },
        {
            type: "input",
            name: "lname",
            message: "Employee's last name: "
        }
    ]).then(function (answers) {
        const query = connection.query(

            // this takes user input from inquirer and adds new employee to database
            "INSERT INTO employee SET ?",
            {
                first_name: answers.fname,
                last_name: answers.lname
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee inserted!\n");

                // prompting user to make another choice
                makeChoice();
            }
        );
    });
}


function viewEmployees() {

    // LEFT JOIN returns all of the values from the left table, and the matching ones from the right table
    connection.query("SELECT first_name, last_name, title, salary FROM employee LEFT JOIN role ON role.id = employee.role_id", function (err, res) {
        if (err) throw err;

        // The console.table() allows to display arrays and objects in the console in a nice tabular format.
        console.table(res);
        // prompting user to make another choice
        makeChoice();
    });
}

// function displays all departments and it's managers
function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw (err);
        console.table(res);
        // prompting user to make another choice 
        makeChoice();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Enter name of the department you'd like to add: "
        },
        {
            type: "input",
            name: "manager",
            message: "Enter first and last name of department manager: "
        }
    ]).then(function (answers) {

        const query = connection.query(
        // this takes user input from inquirer and adds new department and department manager to database
            "INSERT INTO department SET ?",
            {
                department: answers.department,
                manager: answers.manager
            }, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " department inserted!\n");

                // prompting user to make another choice
                makeChoice();
            }
        );
    });
}