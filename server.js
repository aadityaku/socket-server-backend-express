const app = require("express")();
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");
const PORT = 8000;

const users = {};
const io = new Server(httpServer, { 
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
 });
app.get("/",(req,res) => {
    console.log("hello world")
    res.status(200).json({name:"Aaditya kumar"})
})
io.on("connection", (socket) => {
  console.log("some one connected socket id = " + socket.id);
  socket.on("disconnect",() => {
    console.log(`${socket.id} is disconnect`);
    for( let user in users) {
      if(users[user] === socket.id){
        delete users[user];
      }
    }
    io.emit("all_user",users);
  })
  socket.on("new_user",username => {
        console.log(username + " is online");
        users[username] = socket.id;
        io.emit("all_user",users);
  })
  socket.on("send_message", (data) => {
    console.log(data);
    const socketId = users[data.receiver];
    
    io.to(socketId).emit("new_message",data)

  })
});



httpServer.listen(PORT,() => {
    console.log("your server is ready on port = " + PORT);
});

