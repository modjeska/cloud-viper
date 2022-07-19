const mysql = require('mysql2')
const inquirer = require('inquirer')
const db = mysql.createConnection('mysql://root:Dante4412Bryana4412!@localhost:3306/teamManager_db')

const intro = () => {
    inquirer.prompt([{
        message: 'Please select an option.',
        type: 'list',
        choices: ['Add Employee', 'Add Role', 'Add Department', 'Update Employee Role', 'View Employees', 'View Departments', 'View Roles', 'End Session'],
        name: 'initial'
    }])
.then(init => {
    switch (init.initial) {
        case 'Add Employee':
            addEmployee()
            break
        case 'Add Role':
            addRole()
            break
        case 'Add Department':
            addDepartment()
            break
        case 'Update Employee Role':
            updateEmployeeRole()
            break
        case 'View Employees':
            viewEmployees()
            break
        case 'View Departments':
            viewDepartments()
            break
        case 'View Roles':
            viewRoles()
            break
        case 'End Session':
            console.log('Session has ended. Goodbye..')
            break
        }
    })
}

const addDepartment = () => {
    inquirer.prompt([{
        message: 'Enter name of department you wish to create.',
        type: 'input',
        name: 'name'
    }])
    .then(department => {
        db.query('INSERT INTO department SET ?', department, err => {
            if (err) {console.log(err)}
        })
        console.log('Department created.')
        intro()
    })
}

const addRole = () => {
    inquirer.prompt([{
        message: 'Enter name of role you wish to create.',
        type: 'input',
        name: 'title'
    },
    {
        message: 'Enter the salary for uncreated role.',
        type: 'input',
        name: 'salary'
    },
    {
        message: 'Enter department ID for uncreated role.',
        type: 'input',
        name: 'department_ID'
    }])
    .then(role => {
        db.query('INSERT INTO role SET ?', role, err => {
            if (err) {console.log(err)}
        })
        console.log('Role created.')
        intro()
    })
}

const addEmployee = () => {
    inquirer.prompt([{
        message: 'Enter employee first name.',
        type: 'input',
        name: 'first_name'
    },
    {
        message: 'Enter employee last name.',
        type: 'input',
        name: 'last_name'
    },
    {
        message: 'Enter employee role ID.',
        type: 'input',
        name: 'role_id'
    },
    {
        message: 'Does employee have manager status?',
        type: 'list',
        choices: ['yes', 'no'],
        name: 'managerStatus'
    }])
    .then(currentemployees => {
        if (currentemployees.managerStatus === 'yes') {
            delete currentemployees.managerStatus
            db.query('INSERT INTO currentemployees SET ?', currentemployees, err => {
                if (err) {console.log(err)}
            })
            console.log('Employee saved as manager.')
            intro()
        } else if (currentemployees.managerStatus === 'no') {
            inquirer.prompt([{
                message: 'Enter manager ID for employee.',
                type: 'input',
                name: 'manager_id'
            }])
            .then(notManager => {
                delete currentemployees.managerStatus
                let addedEmployee = {
                    ... currentemployees,
                    ... notManager
                }
                db.query('INSERT INTO currentemployees SET ?', addedEmployee, err => {
                    if (err) {console.log(err)}
                })
                console.log('Employee added.')
                intro()
            })
        }
    })
}

const updateEmployeeRole = () => {
    inquirer.prompt([{
            message: 'Enter employee ID.',
            type: 'input',
            name: 'id'
        },
        {
            message: 'Enter new role ID.',
            type: 'input',
            name: 'role_id'
        }])
        .then(update => {
            let updatedRole = {
                role_id: update.role_id
            }
            db.query(`UPDATE currentemployees SET ? WHERE id = ${update.id}`, updatedRole, err => {
                if (err) {console.log(err)}
            })
            console.log('Employee update complete.')
            intro()
        }) 
}

const viewDepartments = () => {
    db.query('SELECT * FROM department', (err, allDepartments) => {
        if (err) {
            console.log(err)
        }
        console.table(allDepartments)
    })
}

const viewRoles = () => {
    db.query('SELECT * FROM role', (err, allRoles) => {
        if (err) {
            console.log(err)
        }
        console.table(allRoles)
    })
}

const viewEmployees = () => {
    db.query('SELECT * FROM currentemployees', (err, allEmployees) => {
        if (err) {
            console.log(err)
        }
        console.table(allEmployees)
    })
}

intro()