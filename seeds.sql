USE employeesdb;
INSERT INTO department (deptname)
VALUES ("Sales"),
       ("Human Resources"),
       ("Production"),
       ("Legal"),
       ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Leader", 110000, 1),
       ("Sales Agent", 80000, 1),
       ("HR Manager", 110000, 2),
       ("HR administrator", 80000, 2),
       ("Production Manager", 110000, 3),
       ("Production Technician", 80000, 3),
       ("Legal Head", 110000, 4),
       ("Company Lawyer", 90000, 4),
       ("Finance Head", 110000, 5),
       ("Accountant", 90000, 5);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("John", "Williams", 1, null),
       ("Mikayla", "Weir", 2, 1),
       ("Susan", "Taylor", 3, null),
       ("Zahra", "Khan", 4, 3),
       ("Bryan", "Johnson", 5, null),
       ("Anthony", "Stephens", 6, 5),
       ("Monica", "Green", 7, null),
       ("Jeff", "Clark", 8, 7),
       ("Robert", "Baker", 9, null),
       ("Scott", "Wilson", 10, 9);

       