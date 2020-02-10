// adding dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');


// setting up connection with mySql workbench
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

// When application starts,  user is prompted to make a choice
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
                "Finish"
            ]
        }
    ]).then(function (answers) {
    // adding switch statement to handle the logic of which function gets executed based on user's choice
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
    ]).then(function(answers){
        var query = connection.query(

            "INSERT INTO employee SET ?",
            {
                first_name: answers.fname,
                last_name: answers.lname
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee inserted!\n");
                // connection.end();
                makeChoice();
            }
        );
    });
}

function  viewEmployees() {
    connection.query("SELECT first_name, last_name, title, salary FROM employee LEFT JOIN role ON role.id = employee.role_id", function (err, res) {
        if (err) throw err;
        console.table(res);
        makeChoice();
    });
}