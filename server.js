// adding dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
// The console.table() allows to display arrays and objects in the console in a nice tabular format
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
const makeChoice = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Select what you'd like to do from a following list: ",
            name: "choice",
            choices: [
                "View all employees",
                "View all departments",
                "View job titles",
                "Add an employee",
                "Add a department",
                "Add a role",
                "Update employee role",
                "Exit"
            ]
        }
    ]).then(answers => {
        // adding switch statement to handle which function gets executed based on user's choice
        switch (answers.choice) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View job titles":
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

const addEmployee = () => {

    connection.query("SELECT id, title FROM role", function (err, allRoles) {
        if (err) throw err;

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
            },
            {
                type: "rawlist",
                name: "role",
                message: "Select employee's role from the list: ",
                // looping through title array, so I can pull out updated data from database
                choices: function () {
                    const choices = [];
                    allRoles.forEach(role => {
                        let choice = role.id + " - " + role.title;
                        choices.push(choice);
                    })
                    return choices;
                }
            }
        ]).then(answers => {
            const thisRoleId = parseInt(answers.role.split(" - ")[0]); 
            const query = connection.query(
                // this takes user input from inquirer and adds new employee to database
                "INSERT INTO employee SET ?",
                {
                    first_name: answers.fname,
                    last_name: answers.lname,
                    role_id: thisRoleId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employee inserted!\n");

                    // prompting user to make another choice
                    makeChoice();
                }
            );
        });
    });
}


// this function joins all tables and displays the following data: Employee's first and last name, job tile, salary, department and manager(if applies)
const viewEmployees = () => {
    // Joining all 3 tables together
    // LEFT JOIN returns all of the values from the left table, and the matching ones from the right table
    connection.query("SELECT first_name, last_name, title, salary, department, manager FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id ", function (err, res) {
        if (err) throw err;
        console.table(res);
        // prompting user to make another choice
        makeChoice();
    });
}

// function displays all departments and it's managers
const viewDepartments = () => {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw (err);
        console.table(res);
        // prompting user to make another choice 
        makeChoice();
    });
}

const addDepartment = () => {
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
    ]).then(answers => {

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

// this function display all job titles and corresponding saleries
const viewRoles = () => {
    connection.query("SELECT title, salary, department FROM role LEFT JOIN department ON department.id = role.department_id", function (err, res) {
        if (err) throw (err);
        console.table(res);
        // prompting user to make another choice 
        makeChoice();
    });
}

const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "Enter a name of a job title you'd like to add:"
        },
        {
            type: "input",
            name: "salary",
            message: "Enter a corresponding salary to a job title you're adding: "
        }
    ]).then(answers => {
        const query = connection.query(
            // this takes user input from inquirer and adds new job title to database
            "INSERT INTO role SET ?",
            {
                title: answers.role,
                salary: answers.salary
            }, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " job title inserted!\n");

                // prompting user to make another choice
                makeChoice();
            }
        );
    });
}