import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "../components/Navbar"
import Home from "../pages/Home"
import Room from "../pages/Room"
import NotFound from "../pages/NotFound"
import Lobby from "../pages/Lobby"

function MainRoutes() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/lobby/:lobbyId" element={<Lobby />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default MainRoutes;