import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { socket } from "../socket";
import { toast } from "react-toastify";
import YouTubePlayer from "../components/YouTubePlayer";
import getVideoId from "../utils/getVideoId";

export default function Room() {

  const { roomId } = useParams();

  const [participants, setParticipants] = useState([]);
  const [myRole, setMyRole] = useState("participant");
  const [messages, setMessages] = useState([]);
const [chatInput, setChatInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);

  const sendMessage = () => {

  if (!chatInput.trim()) return;

  socket.emit("send_message", {
    roomId,
    message: chatInput
  });

  setChatInput("");

};
  const playerRef = useRef(null);

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  const handleChangeVideo = () => {

    const id = getVideoId(videoUrl);

    if (!id) {
      toast.error("Invalid YouTube link");
      return;
    }

    socket.emit("change_video", { roomId, videoId: id });

    setVideoUrl("");

  };

  const handlePlay = () => {

    const player = playerRef.current;

    if (!player) return;

    const time = player.getCurrentTime();

    player.playVideo();

    socket.emit("play", { roomId, time });

  };

  const handlePause = () => {

    const player = playerRef.current;

    if (!player) return;

    const time = player.getCurrentTime();

    player.pauseVideo();

    socket.emit("pause", { roomId, time });

  };

  useEffect(() => {

    socket.emit("get_participant", { roomId });

    const handleParticipants = (data) => {
       console.log("participants:", data);
  setParticipants(data);

  const me = data.find(
    p => p.socketId === socket.id
  );

  if (me) {
    console.log("my role:", me.role);
    setMyRole(me.role);
  }

    };

    const handleUserJoined = (username) => {
      toast.success(`${username} joined the room`);
    };

    const handleVideoChange = (videoId) => {
      setVideoId(videoId);
    };

    const handlePlayEvent = ({ time }) => {

      const player = playerRef.current;

      if (!player) return;

      player.seekTo(time, true);
      player.playVideo();

    };

    const handlePauseEvent = ({ time }) => {

      const player = playerRef.current;

      if (!player) return;

      player.seekTo(time, true);
      player.pauseVideo();

    };

    const handleSeekEvent = ({ time }) => {

      const player = playerRef.current;

      if (!player) return;

      player.seekTo(time, true);

    };
    const handleKicked = () => {
  toast.error("You were removed from the room");
  window.location.href = "/";
};
const handleMessage = (msg) => {
  setMessages(prev => [...prev, msg]);
};

socket.on("receive_message", handleMessage);


socket.on("kicked", handleKicked);
    socket.on("participants_list", handleParticipants);
    socket.on("user_joined", handleUserJoined);
    socket.on("change_video", handleVideoChange);
    socket.on("play", handlePlayEvent);
    socket.on("pause", handlePauseEvent);
    socket.on("seek", handleSeekEvent);

    return () => {

      socket.off("participants_list", handleParticipants);
      socket.off("user_joined", handleUserJoined);
      socket.off("change_video", handleVideoChange);
      socket.off("play", handlePlayEvent);
      socket.off("pause", handlePauseEvent);
      socket.off("seek", handleSeekEvent);
      socket.off("kicked", handleKicked);
        socket.off("receive_message", handleMessage);

    };

  }, [roomId]);
  return (

    <div className="min-h-screen bg-orange-50 p-6">
      <div className="flex justify-between mb-6">

        <Link to="/" className="font-semibold text-lg">
          WatchParty
        </Link>

        <span className="text-gray-600">
          Room ID: {roomId}
        </span>
         <button
      onClick={() => {
        socket.emit("leave_room", { roomId });
        window.location.href = "/";
      }}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      Leave
    </button>

      </div>

     

      <div className="grid grid-cols-3 gap-6">

      

        <div className="col-span-2 bg-white p-4 rounded-xl shadow">

          <div className="w-full h-[520px] rounded-lg overflow-hidden">

            {videoId ? (

              <YouTubePlayer
                videoId={videoId}
                onReady={handlePlayerReady}
              />

            ) : (

              <div className="h-full flex items-center justify-center text-gray-500">
                No video selected
              </div>

            )}

          </div>

        

          <div className="flex mt-4 gap-3">

            <input
              type="text"
              placeholder="Paste YouTube link"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />

            <button
              onClick={handleChangeVideo}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              Change
            </button>

          </div>

        
          <div className="flex gap-4 mt-4">

            <button
            disabled={myRole === "participant"}
              onClick={handlePlay}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Play
            </button>

            <button
            disabled={myRole === "participant"}
              onClick={handlePause}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Pause
            </button>

          </div>

        </div>

        <div className="bg-white p-4 rounded-xl shadow">

          <h2 className="text-lg font-medium mb-3">
            Participants ({participants.length})
          </h2>

          <ul className="flex flex-col gap-3">

     {participants.map((p) => (

  <li
    key={p.socketId}
    className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded-lg"
  >

    <div className="flex gap-2 items-center">

      <span>{p.username}</span>

      {p.role === "host" && <span>👑</span>}
      {p.role === "moderator" && <span>⭐</span>}

    </div>

    {myRole === "host" && p.socketId !== socket.id && (

      <div className="flex gap-2">
        {p.role === "participant" && (

          <button
            onClick={() =>
              socket.emit("assign_role", {
                roomId,
                userId: p.socketId,
                role: "moderator"
              })
            }
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
          >
            Promote
          </button>

        )}

        <button
          onClick={() =>
            socket.emit("remove_participant", {
              roomId,
              userId: p.socketId
            })
          }
          className="text-sm bg-red-500 text-white px-2 py-1 rounded"
        >
          Kick
        </button>

      </div>

    )}

  </li>

))}

          </ul>

        </div>
        <div className="bg-white p-4 rounded-xl shadow mt-4">

<h2 className="font-semibold mb-2">Chat</h2>

<div className="h-60 overflow-y-auto border p-2 mb-2">

{messages.map((msg, i) => (

<div key={i} className="text-sm">

<b>{msg.username}:</b> {msg.message}

</div>

))}

</div>

<div className="flex gap-2">

<input
  value={chatInput}
  onChange={(e) => setChatInput(e.target.value)}
  className="flex-1 border px-2 py-1 rounded"
/>

<button
  onClick={sendMessage}
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
Send
</button>

</div>

</div>

      </div>

    </div>

  );
}