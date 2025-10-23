// src/hooks/usePreviewActions.js
import { useState } from 'react';

const usePreviewActions = () => {
  const [previewActions, setPreviewActions] = useState({
    comptabiliteActions: [],
    chienActions: [],
  });

  const addComptaAction = (comptaData) => {
    const newAction = {
      action: 'Ajout de comptabilité',
      comptaDetails: `Nombre de chiens : ${comptaData.nombreChien}, Nombre de boxes : ${comptaData.nombreBox}, Montant total : ${comptaData.montantTotal}`,
      date1: `Date d'arrivée : ${comptaData.dateArrivee}`,
      date2: `Date de départ : ${comptaData.dateDepart}`,
      proprio: `Proprietaire : ${comptaData.proprio}`,
    };
    setPreviewActions((prev) => ({
      ...prev,
      comptabiliteActions: [...prev.comptabiliteActions, newAction],
    }));
  };

  const addChienAction = (chienData) => {
    const newAction = {
      action: 'Ajout de chien',
      box: chienData.box,
      date: new Date().toLocaleString(),
    };
    setPreviewActions((prev) => ({
      ...prev,
      chienActions: [...prev.chienActions, newAction],
    }));
  };

  const resetActions = () => {
    setPreviewActions({
      comptabiliteActions: [],
      chienActions: [],
    });
  };

  return {
    previewActions,
    addComptaAction,
    addChienAction,
    resetActions,
  };
};

export default usePreviewActions;
