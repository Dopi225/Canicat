export const EntryInPension = (occupations, targetDate, isTomorrow = false) => {
    const target = new Date(targetDate);
    
    if (isTomorrow) {
        target.setDate(target.getDate() + 1); // Déplace à demain
    }

    // Normaliser la date cible à minuit
    target.setHours(0, 0, 0, 0);
    // console.log(`Target Date: ${target.toISOString()}`); // Affiche la date cible normalisée

    return occupations.filter((entry) => {
        const arrivalDate = new Date(entry.dateArrive);
        const departureDate = new Date(entry.dateDepart);

        // Normaliser les dates d'arrivée et de départ à minuit
        arrivalDate.setHours(0, 0, 0, 0);
        departureDate.setHours(0, 0, 0, 0);

        // console.log(`Entry Arrival Date: ${arrivalDate.toISOString()}`); // Affiche la date d'arrivée normalisée
        // console.log(`Entry Departure Date: ${departureDate.toISOString()}`); // Affiche la date de départ normalisée

        if (isTomorrow) {
            // Vérifie si le chien arrive demain et est encore en pension
            const isArrivingTomorrow = arrivalDate.getTime() === target.getTime();
            const isStillInPension = departureDate.getTime() > target.getTime();
            // console.log(`Is Arriving Tomorrow: ${isArrivingTomorrow}, Is Still in Pension: ${isStillInPension}`);
            return isArrivingTomorrow && isStillInPension;
        } else {
            // Vérifie si le chien arrive aujourd'hui
            const isArrivingToday = arrivalDate.getTime() === target.getTime();
            // console.log(`Is Arriving Today: ${isArrivingToday}`);
            return isArrivingToday;
        }
    }).length;
};




  // utils/boxUtils.js

export const parseDate = (dateString) => {
    const [datePart] = dateString.split(" "); // Separate date and time
    const [year, month, day] = datePart.split("-").map(Number);
    return new Date(year, month - 1, day); // Return a date with year, month, and day
  };
  
  export const countTotalBoxes = (boxData) => {
    return boxData.length;
  };
  
  export const countOccupiedBoxes = (occupationsData, today) => {
    const occupiedBoxes = new Set(
      occupationsData
        .filter((entry) => {
          const departureDate = parseDate(entry.dateDepart);
          const arrivalDate = parseDate(entry.dateArrive);
          return departureDate > today && arrivalDate < today;
        })
        .map(entry => entry.box) // Get only the box identifier
    );
    return occupiedBoxes.size; // Count unique boxes
  };
   export const calculateAvailableBoxes = (totalBoxes, occupiedBoxes) => {
      return totalBoxes - occupiedBoxes;
    };
    
    export const countDeparturesToday = (occupationsData, today) => {
      return occupationsData.filter((entry) => {
        const departureDate = parseDate(entry.dateDepart);
        return departureDate.getTime() === today.getTime(); // Compare only the date
      }).length;
    };
    
    export const countDeparturesTomorrow = (occupationsData, today) => {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return occupationsData.filter((entry) => {
        const departureDate = parseDate(entry.dateDepart);
        const arrivalDate = parseDate(entry.dateArrive);
        return arrivalDate < tomorrow && departureDate.getTime() === tomorrow.getTime(); // Compare only the date
      }).length;
    };
    
    export const countDogsInPension = (occupationsData, today) => {
      return occupationsData.filter((entry) => {
        const departureDate = parseDate(entry.dateDepart);
        const arrivalDate = parseDate(entry.dateArrive);
        return departureDate >= today && arrivalDate <= today; // Filter entries with departure date after today
      }).length;
    };
    
    export const countDogsInPensionTomorrow = (occupationsData, today) => {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return occupationsData.filter((entry) => {
        const departureDate = parseDate(entry.dateDepart);
        const arrivalDate = parseDate(entry.dateArrive);
        return departureDate >= tomorrow && arrivalDate <= tomorrow; // Filter entries with departure date after today
      }).length;
    };
    export const filterComptaByYear = (comptaData, selectedYear) => {
      return comptaData.filter((entry) => {
        const entryYear = new Date(entry.dateArrivee.split(" ")[0]).getFullYear(); // Extract the year from the date
        return entryYear === selectedYear;
      });
    };
    export const calculateMonthlyTotals = (filteredData) => {
      const monthlyTotals = new Array(12).fill(0);
      filteredData.forEach((entry) => {
        const month = new Date(entry.dateArrivee).getMonth();
        monthlyTotals[month] += parseFloat(entry.montantTotal); // Ensure "montantTotal" is a number
      });
      return monthlyTotals;
    };
    export const getAvailableDog = (data, resp)=> {
      // console.log("data avaiD", data);
      // console.log("nom resp", resp);
      const dog = data.Chien.filter((chien) => chien.proprio === resp.proprio);
      return dog;
    }
    export const getProprioNameById = (id, proprio) => {
      id = parseInt(id);
      const tarif = proprio.find(t => t.id === id);
      if (tarif) {
          return `${tarif.nom} ${tarif.prenom}`;
      }
      return null;
  };
  