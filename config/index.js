require('dotenv').config();
const config={
    aws_table_name: 'trabajadores',
    aws_local_config: {
      //Provide details for local configuration
    },
    aws_remote_config: {
      accessKeyId: process.env.AWS_CLIENT_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: 'us-east-2',
    }
};

module.exports= config;