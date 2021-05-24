const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');
const e = require('express');
const EmployeeService = require("./services/employee-service");
const employeeService = new EmployeeService();
app.use(express.json());

AWS.config.update(config.aws_remote_config);


app.get('/', async function (req, res, next) {

    res.status(200).json({
        data: { hello: 'bienvenido al api' },
        message: "Endpoint funcionando"
    });
});
app.get('/trabajadores', async function (req, res) {
    const employees = await employeeService.getAllEmployees();

    res.status(200).json({
        data: employees,
        message: "employees listed"
    });
});
app.get('/trabajadores/:EmployeeId', async function (req, res) {
    const { EmployeeId } = req.params;
    const employee = await employeeService.getEmployee(EmployeeId);
    res.status(200).json({
        data: employee,
        message: "employee listed"
    });

});
app.post('/trabajadores', async function (req, res, next) {
    const item = { ...req.body };
    item.id = uuidv4();
    try {
        const createdEmployee = await employeeService.createEmployee(item);      
        res.status(201).json(
            {
                data: createdEmployee,
                message: "employee created"
            });
    } catch (err) {
        next(err);
    }

});

app.put('/trabajadores/:EmployeeId', async function (req, res) {
    const item = { ...req.body };
   
    const { EmployeeId } = req.params;
    try{
        const updatedEmployee= await employeeService.updateEmployee(EmployeeId, item);
        console.log(updatedEmployee);
        res.status(200).json({
            data:updatedEmployee,
            message: "employee updated"
        });
    }catch( err){
        next(err);
    }
  
});
app.delete('/trabajadores/:EmployeeId', async function (req, res, next) {
    
    const { EmployeeId } = req.params;

    try{
        const deletedEmployee= await employeeService.deleteEmployee(EmployeeId);
        res.status(200).json({
                data:deletedEmployee,
                message: 'employee deleted'
            });
    }catch(err){
        next(err);
    }
});

const server = app.listen(3001, function () {
    console.log(`Listening at http://localhost:${server.address().port}/`)
})

