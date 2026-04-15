import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import Browse from "./pages/Browse/Browse";

function App() {
  return (
    <div className="appLayout">
      <Navbar />

      <main className="pageContent">
        <Routes>
          <Route path="/" element={<div>App ready</div>} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
