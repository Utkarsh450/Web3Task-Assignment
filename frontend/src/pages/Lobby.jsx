import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { socket } from "../socket";
import { toast } from "react-toastify";

const Lobby = () => {

  const  {lobbyId}  = useParams()
  const [username, setusername] = useState("")

  console.log(lobbyId);
  
  const navigate = useNavigate()


  const handleJoin = () => {
    if (!username.trim()) return


    socket.emit("create_room", { lobbyId, username})

    
   socket.once("room_created_successfully", () => {
    toast.success("Room created successfully!");
    navigate(`/room/${lobbyId}`, {
      state: { username }
    });
  });
  }

  const copyLink = () => {
    navigator.clipboard.writeText(lobbyId)
    alert("Room link copied!")
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-6">

      <div className="bg-white w-[420px] rounded-xl shadow-lg p-8">


        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Join Watch Party
        </h2>

        
        <p className="text-center text-gray-500 mt-2">
          Room ID: <span className="font-medium">{lobbyId}</span>
        </p>


        <input
          type="text"
          placeholder="Enter your name"
          className="w-full border rounded-lg px-4 py-3 mt-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={username}
          onChange={(e)=> setusername(e.target.value)}
        />

        
        <button
          onClick={handleJoin}
          className="w-full mt-5 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
        >
          Join Room
        </button>

        
        <button
          onClick={copyLink}
          className="w-full mt-3 text-orange-500 hover:underline"
        >
          Copy invite link
        </button>

      </div>

    </div>
  )
}



export default Lobby