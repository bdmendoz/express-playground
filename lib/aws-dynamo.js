const AWS = require('aws-sdk');
const config = require('../config');

AWS.config.update(config.aws_remote_config);

class DynamoLib {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }
    async getAll(table) {

        const params = {
            TableName: table
        }
        return await this.documentClient.scan(params).promise().then(function (data) {
            const { Items } = data;
            return Items;
        });
    }
    get(table, idItem) {
        const params = {
            TableName: table,
            Key: {
                id: idItem
            }
        }
        return this.documentClient.get(params).promise().then(function (data) {
            const { Item } = data;
            return Item;
        });
    }
    create(table, data) {
        const params = {
            TableName: table,
            Item: data
        }

        return this.documentClient.put(params).promise().then(function () {
            return params.Item;
        });
        // TODO : use update method?? 

    }
    update(table, id, data, expression) { 
        const params = {
            TableName: table,
            Key:{
                id: id
            },
            UpdateExpression: expression,
            ExpressionAttributeValues: data,
            ReturnValues: "ALL_NEW"
        };
        console.log(params);
        return this.documentClient.update(params).promise().then(function(data){
            const {Attributes}= data;
            console.log(Attributes);
            return Attributes;
        });
    }
    delete(table, id) { 
        const params = {
            TableName: table,
            Key:{
                id: id
            },
            ReturnValues: "ALL_OLD"
        };
        return this.documentClient.delete(params).promise().then(function(data){
            const {Attributes}= data;
            return Attributes;
        });
    }


}
module.exports = DynamoLib;