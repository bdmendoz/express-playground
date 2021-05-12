const express= require('express');
const app = express();
const AWS= require('aws-sdk');
const config= require('./config');




app.get('/trabajadores', function(req, res, next){
    AWS.config.update(config.aws_remote_config);
    console.log(config.aws_remote_config);
    const docClient= new AWS.DynamoDB.DocumentClient();
    
    const params= {
        TableName: config.aws_table_name
    }
    docClient.scan(params, function(err, data){
        if(err){
            console.log(err);
            res.send({
                    success:false,
                    message: err
                });
        }else{
            console.log(data);
            const {Items} = data;
            res.send({
                    success:true,
                    trabajadores: Items
            });
        }
        
    });
});


const server = app.listen(3001, function(){
    console.log(`Listening at http://localhost:${server.address().port}/`)
})

