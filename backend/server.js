const http=require('http');
const app=require('./src/app');

const connectDB=require('./src/config/db');
const {initSocket}=require('./src/utils/socket');
require('dotenv').config();
const PORT=process.env.PORT || 5000;



connectDB();
const server=http.createServer(app);
initSocket(server);

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}); 3