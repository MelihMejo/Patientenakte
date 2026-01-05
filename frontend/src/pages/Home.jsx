import { useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { usePatients } from "../hooks/usePatients";
import Search from "./Search.jsx";

export default function Home() {
  const {
    listedPatients,
    listedLoading,
    error,
    info,
    loadListed,
    setListed,
  } = usePatients();

  useEffect(() => {
    loadListed();
  }, [loadListed]);

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between gap-3">
          <Search />


        <Link
          to="/createPatient"
          className="shrink-0 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
        >
          neuen Patient anlegen
        </Link>
      </div>

      {(error || info) && (
        <div className="mt-3">
          {error && <div className="text-[#ffb4b4]">⚠️ {error}</div>}
          {info && <div className="text-[#a7f3d0]">✅ {info}</div>}
        </div>
      )}


      <div className="bg-[#121a24] border border-[#ffffff] rounded-[14px] p-4">
        <h2 className="mb-[10px] text-base">Gelistete Patienten</h2>

        {listedLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-[10px] mt-[10px]">
            {listedPatients.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-3 p-3 bg-[#0b111a] border border-[#ffffff] rounded-xl"
              >
                <div>
                  <strong className="block">
                    <Link to={`/patients/${encodeURIComponent(p.patientId)}`}>
                      {p.lastName}, {p.firstName}
                    </Link>
                  </strong>
                  <small className="text-[#a9b8c8]">{p.patientId}</small>
                </div>

                <div className="flex flex-wrap gap-[10px]">
                  <Link
                    className="rounded-[10px] bg-[#1e2a3a] border border-[#2b3d55] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#223146]"
                    to={`/patients/${encodeURIComponent(p.patientId)}`}
                  >
                    Akte öffnen
                  </Link>

                  <button
                    className="rounded-[10px] bg-[#7f1d1d] border border-[#7f1d1d] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#991b1b]"
                    onClick={() => setListed(p.patientId, false)}
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            ))}

            {listedPatients.length === 0 && (
              <div className="text-[#a9b8c8]">Noch keine gelisteten Patienten.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}