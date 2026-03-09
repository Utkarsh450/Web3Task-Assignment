import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { socket } from "../socket";

const Home = () => {

  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [roomId] = useState(nanoid());

  const [usernameError, setUsernameError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [serverError, setServerError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleJoin = () => {

    setUsernameError("");
    setCodeError("");
    setServerError("");

    if (!username.trim()) {
      setUsernameError("* Name is required");
      return;
    }

    if (!code.trim()) {
      setCodeError("* Room code is required");
      return;
    }

    setLoading(true);
    setTimeout(()=>{
      socket.emit("join_room", { code, username });

    }, 1000)
  };

  useEffect(() => {

    socket.on("room_joined", () => {
      setLoading(false);
      navigate(`/room/${code}`, { state: { username } });
    });

    socket.on("room_error", () => {
      setLoading(false);
      setServerError("* Room does not exist");
    });

    return () => {
      socket.off("room_joined");
      socket.off("room_error");
    };

  }, [code, username, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-orangtoshi]">

      <Navbar roomId={roomId} />

      <div className="flex flex-1 items-center justify-center px-6">

        <div className="grid md:grid-cols-2 gap-16 items-center w-full max-w-6xl">

      
          <div>

            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              Watch YouTube <span className="text-orange-500">together</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg">
              Create a watch room and enjoy videos with friends in real time.
              When the host plays or pauses the video, everyone stays perfectly synced.
            </p>

             
            <Link
              to={`/lobby/${roomId}`}
              className="inline-block mt-8 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Create Watch Room
            </Link>
            <div className="flex items-center my-6 max-w-md">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-3 text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

        
            <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError("");
                  }}
                  placeholder="Enter your name"
                  className={`w-full border px-4 py-3 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-400
                  ${usernameError ? "border-red-500" : ""}`}
                />

                {usernameError && (
                  <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                )}
              </div>

          
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeError("");
                  }}
                  placeholder="Enter Room Code"
                  className={`w-full border px-4 py-3 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-400
                  ${codeError ? "border-red-500" : ""}`}
                />

                {codeError && (
                  <p className="text-red-500 text-sm mt-1">{codeError}</p>
                )}
              </div>

          
              <button
                onClick={() => handleJoin()}
                disabled={loading}
                className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join Room"}
              </button>

          
              {serverError && (
                <p className="text-red-500 text-sm text-center">
                  {serverError}
                </p>
              )}

            </div>

          </div>

      
          <div className="flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
              alt="watch party"
              className="w-[420px] hover:scale-105 transition-transform duration-300"
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;