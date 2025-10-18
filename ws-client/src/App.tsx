
import { useEffect, useState } from 'react'
import './App.css'

function App() {
const [socket,setSocket]=useState<null | WebSocket>(null);
const [message,setMessage]=useState<string[]>([]);
const [input,setInput]=useState<string>('');
useEffect(()=>{
    const socket=new WebSocket('ws://localhost:8080');
    socket.onopen=()=>{
      console.log('Connection Established with ws server');
    }
    socket.onmessage=(event)=>{
      setMessage(msg=>[...msg,event.data])
    }
    setSocket(socket);
    return ()=>socket.close();
},[])
  return (
    <div>
      <input type="text" placeholder='enter chat' onChange={(e)=>setInput(e.target.value)}/>
      <button onClick={() => socket?.send(input)}>Send Message</button>
      {message.map((msg,idx)=>(
        <div key={idx}>
          {msg}
        </div>
      ))}
    </div>
  )
}

export default App
