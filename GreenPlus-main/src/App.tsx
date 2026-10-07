import Navbar from "./components/Navbar";
import VideoBackground from "./components/VideoBackground";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen w-full">
      <VideoBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </main>


      </div>
    </div>
  );
}

