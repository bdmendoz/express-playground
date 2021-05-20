const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');
const e = require('express');

app.use(express.json());

AWS.config.update(config.aws_remote_config);


app.get('/', function (req, res, next) {
    res.send({ hello: 'hola ' });
});
app.get('/trabajadores', function (req, res) {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_table_name
    }
    docClient.scan(params, function (err, data) {
        if (err) {
            
            res.send({
                success: false,
                message: err
            });
        } else {
            
            const { Items } = data;
            res.send({
                success: true,
                trabajadores: Items
            });
        }

    });
});
app.get('/trabajadores/:EmployeeId', function (req, res) {
    const { EmployeeId } = req.params;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: config.aws_table_name,
        Key: {
            id: EmployeeId
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            
            res.send({
                success: false,
                message: err
            });
        } else {
            const {Item} = data;
            res.send({
                success: true,
                data: Item
            });
        }
    });
});
app.post('/trabajadores', function (req, res) {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const item = { ...req.body };
    item.id = uuidv4();
    const params = {
        TableName: config.aws_table_name,
        Item: item
    };

    docClient.put(params, function (err, data) {
        if (err) {
            res.send({
                success: false,
                message: err
            });
        } else {
            
            res.send(
                {
                    success: true,
                    message: 'Added item',
                    data: item
                }
            );
        }
    });

});

app.put('/trabajadores/:EmployeeId', function (req, res) {
    const item = { ...req.body };
    const docClient = new AWS.DynamoDB.DocumentClient();
    const { EmployeeId } = req.params;

    
    const params = {
        TableName: config.aws_table_name,
        Key: {
            id: EmployeeId
        },
        UpdateExpression: "set cargo = :c, celular=:p, edad=:e, nombre=:n",
        ExpressionAttributeValues: {
            ":c": item.cargo,
            ":p": item.celular,
            ":e": item.edad,
            ":n": item.nombre
        },
        ReturnValues: "ALL_NEW"
    };
    
    docClient.update(params, function (err, data) {
        if (err) {
            res.send({
                success: false,
                message: err
            });
        } else {
            const {Attributes}= data;
            res.send(
                {
                    success: true,
                    message: 'Updated item',
                    data: Attributes
                }
            );
        }
    });
});
app.delete('/trabajadores/:EmployeeId', function (req, res, next) {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const { EmployeeId } = req.params;
    
    const params = {
        TableName: config.aws_table_name,
        Key: {
            id: EmployeeId

        },
        ReturnValues: "ALL_OLD"
    };
     
    docClient.delete(params, function (err, data) {
        if (err) {
            res.send({
                success: false,
                message: err
            });

        } else {
            res.send(
                {
                    success: true,
                    message: 'deleted item',
                    data: data
                }
            );
        }
    });
});

const server = app.listen(3001, function () {
    console.log(`Listening at http://localhost:${server.address().port}/`)
})

