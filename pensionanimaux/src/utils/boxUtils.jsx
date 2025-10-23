export const getAvailableBoxes = (arrival, departure, data) => {
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);
  arrivalDate.setHours(0, 0, 0, 0);
  departureDate.setHours(23, 59, 59, 999); // set to end of departure day to include full day

  return data.Box.filter(box => {
    const occupations = data.Occupations.filter(o => o.box === box.id);

    if (occupations.length === 0) return true;

    return occupations.every(o => {
      const start = new Date(o.dateArrive);
      const end = new Date(o.dateDepart);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999); // consider full day occupancy for departure day
      return departureDate < start || arrivalDate > end;
    });
  });
};

export const handleDateChange = (event, setSelectedDate) => {
  setSelectedDate(new Date(event.target.value));
};

// Fonction pour vérifier si une date est occupée pour une box spécifique
export const isDateOccupied = (selectedDate, data2, boxId, day) => {
  const dateToCheck = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
  const reservations = data2.filter(entry => entry.box === boxId);

  return reservations.some(reservation => {
    const reservationStart = new Date(reservation.dateArrive);
    const reservationEnd = new Date(reservation.dateDepart);
    reservationStart.setHours(0,0,0,0);
    reservationEnd.setHours(23,59,59,999); // include full departure day
    return dateToCheck >= reservationStart && dateToCheck <= reservationEnd;
  });
};

// Fonction pour générer le calendrier d’une box
export const renderCalendar = (selectedDate, boxId, data2) => {
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const calendar = [];

  for (let i = 0; i < firstDay; i++) {
    calendar.push(<div className="empty" key={`empty-${boxId}-${i}`}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isAvailable = !isDateOccupied(selectedDate, data2, boxId, day);
    calendar.push(
      <div 
        className={`day ${isAvailable ? 'available' : 'occupied'}`} 
        key={`day-${boxId}-${day}`}
      >
        {day}
      </div>
    );
  }

  return calendar;
};

// Fonction pour ouvrir/fermer une box
export const toggleBox = (openBox, id, setOpenBox) => {
  setOpenBox(openBox === id ? null : id);
};

