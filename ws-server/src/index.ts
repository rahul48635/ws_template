import  WebSocket, { WebSocketServer } from 'ws'

const wss=new WebSocketServer({port:8080});
const arr:WebSocket[]=[]
wss.on('connection',function(ws){
    arr.push(ws);
    ws.on('error',console.error);
    ws.send('Welcome to the ws server');
    ws.on('message',function(data){
        arr.forEach(ws=>ws.send(data.toString()));
    })
})