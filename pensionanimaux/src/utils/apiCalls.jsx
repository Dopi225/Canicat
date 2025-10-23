import { apiFetch } from "../hooks/api";

export const createChien = async (data) => {
  const res = await apiFetch('chien/new', data, 'POST');
  if (res.message !== 'ok') throw new Error(`Erreur création chien : ${res.statusText}`);
  return res.id;
};

export const createProprio = async (data) => {
  const res = await apiFetch('proprietaire/new', data, 'POST');
  if (res.message !== 'Propriétaire créé avec succès') throw new Error(`Erreur création proprio : ${res.statusText}`);
  return res.id;
};

export const createComptabilite = async (data) => {
  const res = await apiFetch('comptabilite/new', data, 'POST');
  if (res.message !== 'ok') throw new Error(`Erreur création compta : ${res.statusText}`);
  return res.id;
};

export const modifCompta = async (data, id) => {
  const res = await apiFetch(`comptabilite/${id}/edit`, data, 'POST');
  if (res.message !== 'ok') throw new Error(`Erreur modif compta : ${res.statusText}`);
  return res.id;
};

export const createOccupation = async (data) => {
  const res = await apiFetch('Occupation/new', data, 'POST');
  if (res.message !== 'Occupation créée avec succès') throw new Error(`Erreur création occupation : ${res.statusText}`);
  return res.id;
};
export const deleteChien = async (id) => {
  const response = await apiFetch(`chien/${id}/delete`,undefined , 'DELETE');
  if (!response ||response.message !== 'ok') {
    throw new Error(`Erreur lors de la modification de la comptabilité : ${response ? response.statusText || JSON.stringify(response) : 'Pas de réponse serveur'}`);
  }
  return response.message;
};
export const deleteCompta = async (id) => {
  const response = await apiFetch(`comptabilite/${id}/delete`, undefined, 'DELETE');
  if (!response ||response.message !== 'ok') {
    throw new Error(`Erreur lors de la modification de la comptabilité : ${response ? response.statusText || JSON.stringify(response) : 'Pas de réponse serveur'}`);
  }
  return response.message;
};
export const deleteProprietaire = async (id) => {
  const response = await apiFetch(`proprietaire/${id}/delete`, undefined ,'DELETE');
  if (!response ||response.message !== 'Propriétaire supprimé avec succès') {
    throw new Error(`Erreur lors de la modification de la comptabilité : ${response ? response.statusText || JSON.stringify(response) : 'Pas de réponse serveur'}`);
  }
  return response.message;
};

export const ajoutPayment = async (comptabiliteData, identifiant) => {
  // Vérifiez que comptabiliteData est un objet valide
  if (typeof comptabiliteData !== 'object' || comptabiliteData === null) {
      throw new Error('comptabiliteData doit être un objet valide');
  }

  const response = await apiFetch(`comptabilite/${identifiant}/edit`, comptabiliteData, 'POST');

  // Vérifiez si la réponse est correcte
  if (response.message  !== 'ok') {
       throw new Error(`Erreur lors de la modification de la comptabilité : ${response ? response.statusText || JSON.stringify(response) : 'Pas de réponse serveur'}`);
  }

  
  return response.id;
};