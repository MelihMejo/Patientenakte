import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import Loading from "../components/Loading.jsx";

export default function Record() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);


  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [savingPatient, setSavingPatient] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("note");


  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editType, setEditType] = useState("note");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const patientRes = await api.get(`/patients/by-patient-id/${encodeURIComponent(patientId)}`);
      setPatient(patientRes.data);
      setEditFirst(patientRes.data.firstName);
      setEditLast(patientRes.data.lastName);

      const entriesRes = await api.get(`/patients/${encodeURIComponent(patientId)}/entries`);
      setEntries(entriesRes.data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [patientId]);

  async function savePatientHeader(e) {
    e.preventDefault();
    setSavingPatient(true);
    setError("");
    setInfo("");
    try {
      const { data } = await api.patch(`/patients/by-patient-id/${encodeURIComponent(patientId)}`, {
        firstName: editFirst,
        lastName: editLast,
      });
      setPatient(data);
      setInfo("Patientendaten gespeichert.");
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setSavingPatient(false);
    }
  }

  async function createEntry(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      await api.post(`/patients/${encodeURIComponent(patientId)}/entries`, { title, description, type });
      setTitle("");
      setDescription("");
      setType("note");
      setInfo("Eintrag erstellt.");
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  function startEdit(entry) {
    setEditingId(entry._id);
    setEditTitle(entry.title);
    setEditDesc(entry.description);
    setEditType(entry.type || "note");
    setInfo("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDesc("");
    setEditType("note");
  }

  async function saveEdit(entryId) {
    setError("");
    setInfo("");
    try {
      await api.put(`/entries/${entryId}`, { title: editTitle, description: editDesc, type: editType });
      setInfo("Eintrag gespeichert.");
      cancelEdit();
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  async function deleteEntry(entryId) {
    if (!confirm("Eintrag wirklich löschen?")) return;
    setError("");
    setInfo("");
    try {
      await api.delete(`/entries/${entryId}`);
      setInfo("Eintrag gelöscht.");
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  if (loading) {
    return <Loading text="Akte wird geladen…" />;
  }

  if (!patient) {
    return (
      <div className="bg-[#121a24] border border-[#1f2b3a] rounded-[14px] p-4">
        <p className="text-[#ffb4b4]">Patient nicht gefunden.</p>
        <Link
          className="mt-3 inline-flex rounded-[10px] bg-[#1e2a3a] border border-[#2b3d55] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#223146]"
          to="/"
        >
          Zurück
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#121a24] border border-[#1f2b3a] rounded-[14px] p-4">
      <div className="flex flex-wrap items-center justify-between gap-[10px]">
        <div>
          <h2 className="mb-[6px] text-base">
            Akte: {patient.lastName}, {patient.firstName}
          </h2>
          <div className="text-[#a9b8c8]">
            {patient.patientId} •{" "}
            <span className="inline-block rounded-full border border-[#2b3d55] px-2 py-[2px] text-xs text-[#a9b8c8]">
              {patient.isListed ? "gelistet" : "nicht gelistet"}
            </span>
          </div>
        </div>

        <Link
          className="inline-flex rounded-[10px] bg-[#1e2a3a] border border-[#2b3d55] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#223146]"
          to="/"
        >
          ← Zur Hauptseite
        </Link>
      </div>

      <div className="my-[14px] h-px bg-[#1f2b3a]" />

      <h2 className="mb-[10px] text-base">Patientendaten bearbeiten</h2>
      <form onSubmit={savePatientHeader} className="flex flex-wrap gap-[10px]">
        <input
          className="min-w-[220px] rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
          value={editFirst}
          onChange={(e) => setEditFirst(e.target.value)}
          placeholder="Vorname"
        />
        <input
          className="min-w-[220px] rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
          value={editLast}
          onChange={(e) => setEditLast(e.target.value)}
          placeholder="Nachname"
        />
        <button
          className="rounded-[10px] bg-[#2b6cb0] border border-[#2b6cb0] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#2c7acb] disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={savingPatient}
        >
          {savingPatient ? "Speichere…" : "Speichern"}
        </button>
      </form>

      <div className="my-[14px] h-px bg-[#1f2b3a]" />

      <h2 className="mb-[10px] text-base">Neuen Eintrag hinzufügen</h2>
      <form onSubmit={createEntry}>
        <div className="mb-[10px] flex flex-wrap gap-[10px]">
          <input
            className="min-w-[220px] rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel (z.B. Diagnose)"
          />
          <select
            className="rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="notiz">Notiz</option>
            <option value="diagnose">Diagnose</option>
            <option value="therapie">Therapie</option>
            <option value="befund">Befund</option>
          </select>
          <button
            className="rounded-[10px] bg-[#2b6cb0] border border-[#2b6cb0] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#2c7acb]"
            type="submit"
          >
            Hinzufügen
          </button>
        </div>

        <textarea
          className="w-full min-h-[90px] resize-y rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Text…"
        />
      </form>

      {(error || info) && (
        <div className="mt-3">
          {error && <div className="text-[#ffb4b4]">⚠️ {error}</div>}
          {info && <div className="text-[#a7f3d0]">✅ {info}</div>}
        </div>
      )}

      <div className="my-[14px] h-px bg-[#1f2b3a]" />

      <h2 className="mb-[10px] text-base">Einträge</h2>

      <div className="mt-[10px] flex flex-col gap-[10px]">
        {entries.map((en) => (
          <div
            key={en._id}
            className="flex items-stretch justify-between gap-3 p-3 bg-[#0b111a] border border-[#243244] rounded-xl"
          >
            <div className="flex-1">
              {editingId === en._id ? (
                <>
                  <div className="mb-2 flex flex-wrap gap-[10px]">
                    <input
                      className="min-w-[220px] rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <select
                      className="rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                    >
                      <option value="notiz">Notiz</option>
                      <option value="diagnose">Diagnose</option>
                      <option value="therapie">Therapie</option>
                      <option value="befund">Befund</option>
                    </select>
                  </div>

                  <textarea
                    className="w-full min-h-[90px] resize-y rounded-[10px] bg-[#0b111a] border border-[#243244] px-3 py-2.5 text-[#e7eef7] outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#121a24]"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />

                  <div className="mt-2 flex flex-wrap gap-[10px]">
                    <button
                      className="rounded-[10px] bg-[#2b6cb0] border border-[#2b6cb0] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#2c7acb]"
                      onClick={() => saveEdit(en._id)}
                      type="button"
                    >
                      Speichern
                    </button>
                    <button
                      className="rounded-[10px] bg-[#1e2a3a] border border-[#2b3d55] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#223146]"
                      onClick={cancelEdit}
                      type="button"
                    >
                      Abbrechen
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <strong className="block">
                    {en.title}{" "}
                    <span className="inline-block rounded-full border border-[#2b3d55] px-2 py-[2px] text-xs text-[#a9b8c8]">
                      {en.type || "note"}
                    </span>
                  </strong>

                  <small className="block text-[#a9b8c8]">
                    {new Date(en.createdAt).toLocaleString()}
                  </small>

                  <div className="mt-[6px] whitespace-pre-wrap">{en.description}</div>
                </>
              )}
            </div>

            {editingId !== en._id && (
              <div className="flex flex-wrap gap-[10px]">
                <button
                  className="rounded-[10px] bg-[#1e2a3a] border border-[#2b3d55] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#223146]"
                  onClick={() => startEdit(en)}
                  type="button"
                >
                  Bearbeiten
                </button>
                <button
                  className="rounded-[10px] bg-[#7f1d1d] border border-[#7f1d1d] px-3 py-2.5 text-[#e7eef7] transition hover:bg-[#991b1b]"
                  onClick={() => deleteEntry(en._id)}
                  type="button"
                >
                  Löschen
                </button>
              </div>
            )}
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-[#a9b8c8]">
            Noch keine Einträge. Füge oben einen neuen Eintrag hinzu.
          </div>
        )}
      </div>
    </div>
  );
}