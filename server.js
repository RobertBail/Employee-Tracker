const inquirer = require('inquirer');
//const fs = require('fs');
const mysql2 = require("mysql2");
require("console.table");

//PORT = process.env.PORT || 3001;

const db = mysql2.createConnection(
  {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bail88",
    database: "employeesdb",
  },
  console.log(`Connected to the employees_db database.`)
);
db.connect();

const employeeInfo = () => {
    inquirer.prompt ([
        {
        type:'list',
        name:'userChoices',
        message: "What would you like to do?",
        choices:['View all Departments',
                'View all Roles', 
                'View all Employees', 
                'Add a Department',
                'Add a Role',               
                'Add an Employee',
                'Update an Employee Role',
                'Update Employee Managers',
                'Exit'
                ]
        }
    ]).then((answer) => {
      switch(answer.userChoices){
        case 'View all Departments':
          viewDepartments();
          break;

        case 'View all Roles':
          viewRoles();
          break; 

        case 'View all Employees':
          viewEmployees();
          break; 

        case 'Add a Department':
          addDepartment();
          break; 
//for some reason when writing "role" in seeds.sql, it would be blue along with "INSERT INTO",
//didn't know if this would affect the functions, so I put "roles" instead
        case 'Add a Role':
          addRoles();
          break;

        case 'Add an Employee':
          addEmployee();
          break;  

        case 'Update an Employee Role':
          updateEmployeeRole();
          break;  

        case 'Update Employee Managers':
        updateEmployeeManagers();
        break; 

        case 'Exit':
        console.log("Thank you for using Employee Tracker");
        db.end();
        
      }      
    }); 
};

const viewDepartments = () => {
  const query = 'SELECT * FROM department';
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log('Viewing all departments')
    console.table(res);
    employeeInfo();
})
};

const viewRoles = () => {  
  const query = 'SELECT * FROM roles';
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log('Viewing all roles')
    console.table(res);
    employeeInfo()
  })  
  };

const viewEmployees = () =>{
 const query = 'SELECT * FROM employee';
db.query(query, (err, res) =>{
  if (err) throw err
  console.log("Viewing all employees")
  console.table(res)
  employeeInfo()
})
};

const addDepartment = () =>{
  db.query('SELECT * FROM department', (err, departments) => {
    if (err) console.log(err);
    departments = departments.map((department) => {
        return {
            name: department.deptname,
            value: department.id,
        };
    });
    inquirer.prompt([
      {
        type: 'input',
        name: 'newDept',
        message: 'What department would you like to add?',
        
      }
    ]).then((answers) => {
      db.query('INSERT INTO department SET ?',
      {
        deptname: answers.newDept
      },
      (err, answers) => {
        if (err) throw err;
        console.log('Added new department')
        console.table(answers)
        employeeInfo()
      });
    });
  })};

const addRoles = () =>{
  db.query('SELECT * FROM department', (err, departments) => {
    if (err) console.log(err);
    departments = departments.map((department) => {
        return {
            name: department.deptname,
            value: department.id,
        };
    });
  inquirer.prompt([
    {
      type: 'input',
      name: 'newRole',
      message: 'What role would you like to add?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary?', 
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department name for this role',
      choices: departments,
  },
  ]).then((answers)=> {
    db.query(`INSERT INTO roles SET ?`,
    {
      title: answers.newRole,
      salary: answers.salary,
      department_id: answers.departmentId
    },
    (err) => {
      if (err) throw err;
      console.log('Added new Role')
      console.table(answers)
      employeeInfo()
    })
  })
 })};
 const addEmployee = () => {
  db.query('SELECT * FROM employee', (err, employees) => {
    if (err) console.log(err);
    employees = employees.map((employee) => {
        return {
            name: employee.firstName,
            value: employee.id,
        };
    });
    inquirer.prompt([
      {
        type: 'input',
        message: 'What is the employee first name?',
        name: 'firstName'
      },
      { 
        type: 'input',
        message: 'What is the employee last name?',
        name: 'lastName'
      },
      {
        type: 'input',
        message: 'What is the employee role id?',
        name: 'roleId'
      },
      {
        type: 'input',
        message: 'What is the employee manager id?',
        name: 'managersId'
      }
    ]).then((answers)=>{
      db.query('INSERT INTO employee SET ?',
      {
        first_name: answers.firstName,
        last_name: answers.lastName,
        roles_id: answers.roleId,
        manager_id: answers.managersId
      },
      (err) => {
        if (err) throw err;
        console.log('Added employee')
        console.table(answers)
        employeeInfo()
      })
    })
  })};

const updateEmployeeRole = () =>{
  db.query( `SELECT * FROM employee`, (err, employees) => {
    if (err) console.log(err);
    employees = employees.map((employee) => {
        return {
            name: employee.firstName,
            value: employee.id
        };
    });
//I attempted to put in a list/choices for this but it didn't seem to work with first name and last name,
//"syntax error" or blank in terminal
  inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the employee first name',  
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the employee last name',  
      },
      {
      type: "input",
      name: "roles_id",
      message: "Enter new role id",
      }
      ]).then(answers => {
      db.query(`INSERT INTO employee SET ? `,
       {first_name: answers.firstName,
        last_name: answers.lastName,
        roles_id: answers.roles_id,
        },
        (err) => {
        if (err) throw err;
        console.log('Employee role is updated')
        console.table(answers)
        employeeInfo()
        })
        })
    })};

const updateEmployeeManagers = () =>{
  db.query( `SELECT * FROM roles`, (err, roles) => {
    if (err) console.log(err);
    roles = roles.map((role) => {
        return {
            name: role.title,
            value: role.id
        };
    });
inquirer.prompt([
  {
    type: 'input',
    message: 'What is the new manager first name?',
    name: 'ManagerfirstName'
  },
  { 
    type: 'input',
    message: 'What is the new manager last name?',
    name: 'ManagerlastName'
  },
  { 
    type: 'list',
    message: 'Select new role of manager?',
    name: 'newManagerRole',
    choices: roles,
  },
  //manager_id, roles_id from seeds?
  //message (below)? When trying UPDATE, it would insert name into all rows of list
]).then((answers)=>{
  db.query(`INSERT INTO employee SET ? `,
  {
    first_name: answers.ManagerfirstName,
    last_name: answers.ManagerlastName,
    roles_id: answers.newManagerRole,
  },
  (err) => {
   if (err) throw err;
   console.log('Updated employee manager')
   console.table(answers)
   employeeInfo()
  })
})
})};
employeeInfo();