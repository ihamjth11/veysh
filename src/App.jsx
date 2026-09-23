import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Effects from "./components/Effects";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import CameraApp from "./pages/CameraApp";

function App() {
  const [showCamera, setShowCamera] = useState(false);

  if (showCamera) {
    return <CameraApp />;
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <Navbar onTryNow={() => setShowCamera(true)} />
      <Hero onTryNow={() => setShowCamera(true)} />
      <Effects />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default App;