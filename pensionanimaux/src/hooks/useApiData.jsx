import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const useApiData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    // console.log("fetchData called");
    setLoading(true);
    setError(null);
    try {
      const [
        proprios, 
        Occupations, 
        Box, 
        Comptabilites, 
        Paiement, 
        Tarifs, 
        Chien
      ] = await Promise.all([
        apiFetch("proprietaire/"),
        apiFetch("Occupation/"),
        apiFetch("box/"),
        apiFetch("comptabilite/"),
        apiFetch("Paiement/"),
        apiFetch("tarif/"),
        apiFetch("chien/"),
      ]);

      setData({ proprios, Occupations, Box, Comptabilites, Paiement, Tarifs, Chien });
    } catch (err) {
      console.error("Erreur API:", err); 
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export default useApiData;

