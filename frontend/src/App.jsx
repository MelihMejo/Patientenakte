import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Record from "./pages/Record.jsx";
import CreatePatient from "./pages/CreatePatient.jsx";

export default function App() {
  return (
    <div className="mx-auto max-w-[1100px] p-6">
      <div className="flex items-center justify-between gap-3 mb-[18px]">
        <Link to="/" className="brand">🗂️ Patientenakten</Link>

      </div>
      <div className="min-h-screen bg-[#0b0f14] text-[#e7eef7]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patients/:patientId" element={<Record />} />
        <Route path="/createPatient" element={<CreatePatient />} />
      </Routes>
      </div>
    </div>
  );
}
