const DynamoLib = require('../lib/aws-dynamo');

class EmployeeService {
    constructor() {
        this.tabla = "trabajadores";
        this.dynamoLib = new DynamoLib();
    }
    async getAllEmployees() {
        const employees = await this.dynamoLib.getAll(this.tabla);
        return employees || [];
    }
    async getEmployee(id ){
        const employee = await this.dynamoLib.get(this.tabla, id);
        return employee|| {};
    }

    async createEmployee(employee){
        const createdEmployee= await this.dynamoLib.create(this.tabla, employee);
        
        return createdEmployee ;
    }
    async updateEmployee(employeeId, employee){
        const item = employee;
        
        const employeeAttributes=  {
            ":c": item.cargo,
            ":p": item.celular,
            ":e": item.edad,
            ":n": item.nombre
        };
        const updateExpression= "set cargo = :c, celular=:p, edad=:e, nombre=:n";
        const updatedEmployee= await this.dynamoLib.update(this.tabla, employeeId, employeeAttributes,updateExpression);
        console.log('updated', updatedEmployee);
        return updatedEmployee|| {};
 
    }
    async deleteEmployee(id){
        const deletedEmployee= await this.dynamoLib.delete(this.tabla, id);
        return deletedEmployee|| {};
    }

}
module.exports = EmployeeService;
