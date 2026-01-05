import { useCallback, useMemo, useState } from "react";
import { api } from "../api";

export function usePatients() {

  const [listedPatients, setListedPatients] = useState([]);
  const [listedLoading, setListedLoading] = useState(true);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const loadListed = useCallback(async () => {
    setListedLoading(true);
    try {
      const { data } = await api.get("/patients");
      setListedPatients(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setListedLoading(false);
    }
  }, []);

  const setListed = useCallback(async (patientId, isListed) => {
    setError("");
    setInfo("");
    try {
      await api.patch(
        `/patients/by-patient-id/${encodeURIComponent(patientId)}/listed`,
        { isListed }
      );
      setInfo(isListed ? "Zur Liste hinzugefügt." : "Aus der Liste entfernt.");
      await loadListed();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }, [loadListed]);

  const listedIds = useMemo(
    () => new Set(listedPatients.map((p) => p.patientId)),
    [listedPatients]
  );

  return {
    listedPatients,
    listedLoading,
    error,
    info,
    setError,  
    setInfo,  
    loadListed,
    setListed,
    listedIds,
  };
}