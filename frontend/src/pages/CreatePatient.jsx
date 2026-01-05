import React, { useState } from "react";
import { api } from "../api";

export default function CreatePatient() {
  const [patientId, setPatientId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleCreatePatient(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const payload = {
        patientId: patientId.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      };

      const { data } = await api.post("/patients", payload);

      setInfo(`Patient erstellt: ${data.patientId} (noch nicht gelistet)`);
      setPatientId("");
      setFirstName("");
      setLastName("");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="bg-[#121a24] border border-[#1f2b3a] rounded-[14px] p-4">
        <h2 className="mb-[10px] text-base">Patient hinzufügen (Akte anlegen)</h2>

        <p className="text-[#a9b8c8] mb-3">
          Erst anlegen, dann per Suche finden und zur Liste hinzufügen.
        </p>

        <form onSubmit={handleCreatePatient} className="flex flex-wrap gap-[10px]">
          <input
            className="min-w-[220px] rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Patienten-ID (z.B. P-000123)"
          />
          <input
            className="min-w-[220px] rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Vorname"
          />
          <input
            className="min-w-[220px] rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nachname"
          />

          <button
            className="rounded-[10px] bg-[#2b6cb0] border border-[#2b6cb0] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#2c7acb]"
            type="submit"
          >
            Erstellen
          </button>
        </form>

        {(error || info) && (
          <div className="mt-3">
            {error && <div className="text-[#ffb4b4]">⚠️ {error}</div>}
            {info && <div className="text-[#a7f3d0]">✅ {info}</div>}
          </div>
        )}
      </div>
    </div>
  );
}