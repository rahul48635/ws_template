import WebSocket, { WebSocketServer } from "ws";

const wss=new WebSocketServer({port:8080});
const rooms:Record<string,WebSocket[]>={};
let currentRoomId:string | null=null;
wss.on('connection',function(ws){
    ws.on('message',function(data){
        const msg=JSON.parse(data.toString());
        if(msg.type==="JOIN"){
            const {roomId}=msg;
            currentRoomId=roomId;
            if(Object.hasOwn(rooms,roomId)){
                rooms[roomId]?.push(ws);
            }else{
                rooms[roomId]=[];
                rooms[roomId].push(ws);
            }
            ws.send(`Joined Room: ${roomId}`)
        }

        if(msg.type==="CHAT"){
            if(currentRoomId){
                rooms[currentRoomId]?.forEach((c)=>{
                    if(c!==ws && c.readyState===WebSocket.OPEN){
                        c.send(msg.payload);
                    }
                })
            }
        }

        ws.on('close',function(){
            if(currentRoomId){
                const clients = rooms[currentRoomId];
                if (clients) {
                    const index = clients.indexOf(ws);
                    if (index > -1) {
                        clients.splice(index, 1);
                    }
                    if (clients.length === 0) {
                        delete rooms[currentRoomId];
                    }
                }
            }
        })
    })
})