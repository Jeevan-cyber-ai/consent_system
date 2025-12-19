const http=require('http');
const app=require('./src/app');
const mongoose=require('mongoose');


const connectDB=require('./src/config/db');
const {initSocket}=require('./src/utils/socket');
require('dotenv').config();
const path=require('path');
const PORT=process.env.PORT || 5000;



connectDB();
const server=http.createServer(app);
// It maps http://localhost:5000/uploads/filename.jpg to the physical folder
const helmet = require('helmet');

// ✅ Update Helmet to allow cross-origin images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Prevents the 'default-src none' block you saw
  })
);
initSocket(server);
console.log("Serving images from:", path.join(__dirname, 'uploads'));
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}); 