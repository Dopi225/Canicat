import { getDaysBetweenDates } from './dateUtils';

export const calculateTotalAmount = (tarifName, dogCount, arrivalDate, departureDate, data) => {
  // console.log("1",tarifName);
  // console.log("2",dogCount);
  // console.log("3",arrivalDate);
  // console.log("4",departureDate);
  const tarifId = getTarifIdByName(tarifName,data.Tarifs)
  dogCount = parseInt(dogCount);
  const jours = getDaysBetweenDates(arrivalDate, departureDate);
// console.log("5",tarifId);
// console.log("6",jours);
  if (!tarifId || dogCount <= 0) return "";

  const tarif = data.Tarifs?.find(t => t.id === tarifId);
  if (!tarif) return "";

  const montant = Number(tarif.montant);
  if (isNaN(montant)) return "";
  // console.log("7",montant);
  return (montant * dogCount * jours).toFixed(2);
};

export const getTarifIdByName = (name, tarifs) => {
  const tarif = tarifs.find(t => t.libelle === name);
  return tarif ? tarif.id : null;
};
 