import React, { useEffect, useState } from "react";
import { api } from "../api";
import { usePatients } from "../hooks/usePatients";

export default function Search() {
  const {
    listedPatients,
    listedIds,
    error,
    info,
    setError,
    setInfo,
    loadListed,
    setListed,
  } = usePatients();

  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadListed();
  }, [loadListed]);

  async function runSearch(value) {
    const query = value.trim();
    setQ(value);
    setError("");
    setInfo("");

    if (!query) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const { data } = await api.get(`/patients/search?q=${encodeURIComponent(query)}`);
      setSearchResults(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setSearchLoading(false);
    }
  }

  async function toggleListed(patientId, isListed) {
    await setListed(patientId, isListed);
    if (q.trim()) await runSearch(q);
  }

  return (
    <div className="bg-[#121a24] border border-[#ffffff] rounded-[14px] p-4">
      <h2 className="mb-[10px] text-base">Suche (Name oder ID)</h2>

      <div className="flex flex-wrap gap-[10px]">
        <input
          className="min-w-[220px] rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
          value={q}
          onChange={(e) => runSearch(e.target.value)}
        />
        {searchLoading && <span className="text-[#a9b8c8]">Suche…</span>}
      </div>

      <div className="flex flex-col gap-[10px] mt-[10px]">
        {searchResults.map((p) => {
          const isListed = listedIds.has(p.patientId);
          return (
            <div
              key={p._id}
              className="flex items-center justify-between gap-3 p-3 bg-[#0b111a] border border-[#243244] rounded-xl"
            >
              <div>
                <strong className="block">
                  {p.lastName}, {p.firstName}
                </strong>
                <small className="text-[#a9b8c8]">
                  {p.patientId} •{" "}
                  <span className="inline-block rounded-full border border-[#2b3d55] px-2 py-[2px] text-xs text-[#a9b8c8]">
                    {isListed ? "gelistet" : "nicht gelistet"}
                  </span>
                </small>
              </div>

              <div className="flex flex-wrap gap-[10px]">
                {isListed ? (
                  <button
                    className="rounded-[10px] bg-[#7f1d1d] border border-[#7f1d1d] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#991b1b]"
                    onClick={() => toggleListed(p.patientId, false)}
                  >
                    Entfernen
                  </button>
                ) : (
                  <button
                    className="rounded-[10px] bg-[#2b6cb0] border border-[#2b6cb0] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#2c7acb]"
                    onClick={() => toggleListed(p.patientId, true)}
                  >
                    Hinzufügen
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(error || info) && (
        <div className="mt-3">
          {error && <div className="text-[#ffb4b4]">⚠️ {error}</div>}
          {info && <div className="text-[#a7f3d0]">✅ {info}</div>}
        </div>
      )}

      {listedPatients.length === 0 && (
        <div className="text-[#a9b8c8] mt-2">Noch keine gelisteten Patienten.</div>
      )}
    </div>
  );
}