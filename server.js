// adding dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
// console.table() allows to display arrays and objects in the console in a nice tabular format
const cTable = require('console.table');

// =================================================================================================//

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

// =================================================================================================//

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
                console.log("Your changes have been saved");
                // if user chooses to exit, this ends all connection
                connection.end();
        }
    });
}

// ==========================================================================================================//

// to add a new employee, I need to select data from different tables within the same query , which is causing asynchronicity issues  when using inquirer. So I wrote a separate function to get data from deprartment table 
// and I'm calling getDepartment() function inside addEmployee() function

const getDepartment = (role, fname, lname) => {
    connection.query("SELECT id, department FROM department", function (err, allDepts) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "rawlist",
                name: "department",
                message: "Select employee's department from the list: ",
                choices: function () {
                    const choices = [];
                    allDepts.forEach(dept => {
                        let choice = dept.id + " - " + dept.department;
                        choices.push(choice);
                    })
                    return choices;
                }
            },
        ]).then(function (answers) {
            const thisRoleId = parseInt(role.split(" - ")[0]);
            const thisDeptId = parseInt(answers.department.split(" - ")[0]);
            const query = connection.query(
                // this takes user input from inquirer and adds new employee to database
                "INSERT INTO employee SET ?",
                {
                    first_name: fname,
                    last_name: lname,
                    role_id: thisRoleId,
                    manager_id: thisDeptId
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

// ================================================================================================== //

// this function lets user add new employee to database
const addEmployee = () => {

    // setting up connection with role and department tables so I can insert matched values into emoloyee table

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
                // looping through title array, so I can pull out up to date roles list from database
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
            getDepartment(answers.role, answers.fname, answers.lname);
        });
    });
}

// ================================================================================================= //

// this function joins all tables and displays the following data:
// employee's first and last name, job tile, salary, department and manager(if applies)
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

// ============================================================================================== //

// function displays all departments and it's managers
const viewDepartments = () => {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw (err);
        console.table(res);
        // prompting user to make another choice 
        makeChoice();
    });
}

// =============================================================================================== //

// this function let's user add a new department and department manager
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

// =============================================================================================== //

// this function display all job titles and corresponding saleries
const viewRoles = () => {
    connection.query("SELECT title, salary, department FROM role LEFT JOIN department ON department.id = role.department_id", function (err, res) {
        if (err) throw (err);
        console.table(res);
        // prompting user to make another choice 
        makeChoice();
    });
}

// ================================================================================================ //

// this function lets user add new role, corresponding salary and department
const addRole = () => {

    connection.query("Select id, department FROM department", function (err, depId) {
        if (err) throw err;


        inquirer.prompt([
            {
                type: "input",
                name: "role",
                message: "Enter a name of a job title you'd like to add: "
            },
            {
                type: "input",
                name: "salary",
                message: "Enter a corresponding salary to a job title you're adding: "
            },
            {
                type: "rawlist",
                name: "department",
                message: "Select a corresponding department to a job title you're adding: ",
                choices: function () {
                    const choices = [];
                    depId.forEach(dep => {

                        let choice = dep.id + " - " + dep.department;
                        choices.push(choice);
                    })
                    return choices;
                }
            }
        ]).then(answers => {

            const thisDepId = parseInt(answers.department.split(" - ")[0]);
            const query = connection.query(
                // this takes user input from inquirer and adds new job title to database
                "INSERT INTO role SET ?",
                {
                    title: answers.role,
                    salary: answers.salary,
                    department_id: thisDepId
                }, function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " job title inserted!\n");

                    // prompting user to make another choice
                    makeChoice();
                }
            );
        });
    });
}

// ============================================================================================== //

// getting a list of job titles from role table and updating a new employee's role

const getRole = (employee) => {
    connection.query("SELECT id, title  FROM role", function (err, res) {
        if (err) throw err;
      
        inquirer.prompt([
            {
                type: "rawlist",
                name: "role",
                message: "Select new role for employee: ",
                choices: function () {
                    const choices = [];
                    res.forEach(role => {

                        let choice = role.id + " - " + role.title;
                        choices.push(choice);
                    });
                    return choices;
                }
            }

        ]).then(answers => {
            
            const thisRoleId = parseInt(answers.role.split(" - ")[0]);
            updateEmployee(answers.role);
            //
            // // console.log(thisRoleId);
            // connection.query(
            //     "UPDATE employee SET ? WHERE  ?",
            //     [
            //         {
            //             role_id: answers.role
            //         },
            //         {
            //             id: thisRoleId.id
            //         }
            //     ],
            //     function (error) {
            //         if (error) throw err;
            //         console.log("Employee's role has been updated!");
            //         makeChoice();
            //     }
            // )
        })
    })
}

const updateEmployee = (role, thisRoleId) => {
//    connection.query("Select role_id FROM employee LEFT JOIN role ON role.id = employee.role_id", function(err, res){
//        if (err) throw err;
   
    connection.query(
        "UPDATE employee SET ? WHERE  ?",
        [
            {
                role_id: role
            },
            {
                id: thisRoleId
            }
        ],
        function (error) {
            if (error) throw err;
            console.log("Employee's role has been updated!");
            makeChoice();
        }
    );
// });
}



// this function lets user pick a certain employee from a list and update employee's role
// since I have to select data from multiples tables, following logic form lines (78-79)
const updateEmployeeRole = () => {
    connection.query("Select id, first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "rawlist",
                name: "employee",
                message: "Select an employee who's role you like to update: ",
                choices: function () {
                    const choices = [];
                    res.forEach(employee => {

                        let choice = employee.first_name + " " + employee.last_name;
                        choices.push(choice);
                    });
                    return choices;
                }
            }
            ]).then(answers => {
                getRole(answers.employee);
            });
    });
}