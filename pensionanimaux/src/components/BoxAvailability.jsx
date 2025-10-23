import { useState } from 'react';
import PropTypes from 'prop-types';

const BoxAvailability = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('date'); // 'date' ou 'month'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const handleMonthChange = (e) => setSelectedMonth(parseInt(e.target.value));
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value));

  const getBoxAvailability = (boxId) => {
    const dateToCheck = selectedDate;
    const reservations = data.Occupations.filter(entry => entry.box === boxId);
    
    const activeReservation = reservations.find(reservation => {
      const reservationStart = new Date(reservation.dateArrive);
      const reservationEnd = new Date(reservation.dateDepart);
      reservationStart.setHours(0, 0, 0, 0);
      reservationEnd.setHours(23, 59, 59, 999);
      return dateToCheck >= reservationStart && dateToCheck <= reservationEnd;
    });
    
    if (activeReservation) {
      const dog = data.Chien.find(chien => chien.id === activeReservation.chien);
      return {
        available: false,
        dogName: dog ? dog.nom : 'Inconnu',
        color: activeReservation.couleur || '#dc3545',
        arrivalDate: activeReservation.dateArrive,
        departureDate: activeReservation.dateDepart
      };
    }
    
    return { available: true, dogName: '', color: '', arrivalDate: '', departureDate: '' };
  };

  const getUpcomingReservations = (boxId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return data.Occupations
      .filter(entry => entry.box === boxId)
      .filter(reservation => {
        const arrivalDate = new Date(reservation.dateArrive);
        arrivalDate.setHours(0, 0, 0, 0);
        return arrivalDate >= today;
      })
      .sort((a, b) => new Date(a.dateArrive) - new Date(b.dateArrive))
      .slice(0, 3); // Prochaines 3 réservations
  };

  const generateMonthlyCalendar = (boxId) => {
    const month = selectedMonth - 1; // JavaScript months are 0-indexed
    const year = selectedYear;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateToCheck = new Date(year, month, day);
      const isOccupied = isDateOccupied(boxId, dateToCheck);
      const occupation = getOccupationForDate(boxId, dateToCheck);
      
      calendar.push(
        <div 
          key={day} 
          className={`calendar-day ${isOccupied ? 'occupied' : 'available'}`}
          title={isOccupied ? `Occupé par ${occupation?.dogName || 'Inconnu'}` : 'Disponible'}
        >
          <span className="day-number">{day}</span>
          {isOccupied && occupation && (
            <div className="occupation-indicator" style={{ backgroundColor: occupation.color }}>
              {occupation.dogName?.charAt(0) || '?'}
            </div>
          )}
        </div>
      );
    }
    
    return calendar;
  };

  const isDateOccupied = (boxId, date) => {
    const reservations = data.Occupations.filter(entry => entry.box === boxId);
    return reservations.some(reservation => {
      const reservationStart = new Date(reservation.dateArrive);
      const reservationEnd = new Date(reservation.dateDepart);
      reservationStart.setHours(0, 0, 0, 0);
      reservationEnd.setHours(23, 59, 59, 999);
      return date >= reservationStart && date <= reservationEnd;
    });
  };

  const getOccupationForDate = (boxId, date) => {
    const reservations = data.Occupations.filter(entry => entry.box === boxId);
    const activeReservation = reservations.find(reservation => {
      const reservationStart = new Date(reservation.dateArrive);
      const reservationEnd = new Date(reservation.dateDepart);
      reservationStart.setHours(0, 0, 0, 0);
      reservationEnd.setHours(23, 59, 59, 999);
      return date >= reservationStart && date <= reservationEnd;
    });
    
    if (activeReservation) {
      const dog = data.Chien.find(chien => chien.id === activeReservation.chien);
      return {
        dogName: dog ? dog.nom : 'Inconnu',
        color: activeReservation.couleur || '#dc3545'
      };
    }
    
    return null;
  };

  return (
    <div className="box-availability-container">
      <h2>Disponibilité des box</h2>
      
      {/* Toggle pour choisir le mode d'affichage */}
      <div className="view-mode-selector">
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn ${viewMode === 'date' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('date')}
          >
            Vue par date
          </button>
          <button 
            type="button" 
            className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('month')}
          >
            Vue mensuelle
          </button>
        </div>
      </div>

      {/* Sélecteur de date pour vue par date */}
      {viewMode === 'date' && (
        <div className="date-selector">
          <label htmlFor="date-input">Sélectionner une date :</label>
          <input 
            id="date-input"
            type="date" 
            onChange={handleDateChange}
            value={selectedDate.toISOString().split('T')[0]}
            className="form-control"
          />
        </div>
      )}

      {/* Sélecteurs pour vue mensuelle */}
      {viewMode === 'month' && (
        <div className="month-selector">
          <div className="month-year-selectors">
            <select value={selectedMonth} onChange={handleMonthChange} className="form-control">
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}
                </option>
              ))}
            </select>
            <input 
              type="number" 
              value={selectedYear} 
              onChange={handleYearChange} 
              min="2020" 
              max="2030"
              className="form-control"
            />
          </div>
        </div>
      )}

      <div className="boxes-grid">
        {data.Box.map(box => {
          const availability = getBoxAvailability(box.id);
          const upcomingReservations = getUpcomingReservations(box.id);
          
          return (
            <div key={box.id} className="box-card">
              <div className="box-header" style={{ backgroundColor: box.couleur || '#6c757d' }}>
                <h3>Box {box.nom}</h3>
                <div className="box-status">
                  {availability.available ? (
                    <span className="status-available">✓ Disponible</span>
                  ) : (
                    <span className="status-occupied">✗ Occupé</span>
                  )}
                </div>
              </div>
              
              <div className="box-content">
                {viewMode === 'date' ? (
                  // Vue par date
                  availability.available ? (
                    <div className="availability-info">
                      <p className="available-text">Cette box est disponible pour la date sélectionnée</p>
                      {upcomingReservations.length > 0 && (
                        <div className="upcoming-reservations">
                          <h4>Prochaines réservations :</h4>
                          <ul>
                            {upcomingReservations.map((reservation, idx) => {
                              const dog = data.Chien.find(chien => chien.id === reservation.chien);
                              return (
                                <li key={idx}>
                                  <strong>{dog ? dog.nom : 'Inconnu'}</strong>
                                  <br />
                                  <small>
                                    {new Date(reservation.dateArrive).toLocaleDateString('fr-FR')} - 
                                    {new Date(reservation.dateDepart).toLocaleDateString('fr-FR')}
                                  </small>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="occupancy-info">
                      <div className="current-occupancy">
                        <h4>Actuellement occupé par :</h4>
                        <p className="dog-name">{availability.dogName}</p>
                        <p className="occupancy-dates">
                          Du {new Date(availability.arrivalDate).toLocaleDateString('fr-FR')} au {new Date(availability.departureDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  // Vue mensuelle
                  <div className="monthly-view">
                    <div className="monthly-calendar">
                      <div className="calendar-header">
                        <div className="day-labels">
                          <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                        </div>
                      </div>
                      <div className="calendar-grid">
                        {generateMonthlyCalendar(box.id)}
                      </div>
                    </div>
                    <div className="calendar-legend">
                      <div className="legend-item">
                        <div className="legend-color available"></div>
                        <span>Disponible</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color occupied"></div>
                        <span>Occupé</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Définition des PropTypes pour les props data et data2
BoxAvailability.propTypes = {
  data: PropTypes.shape({
    Occupations: PropTypes.array.isRequired,
    Box: PropTypes.array.isRequired,
    Paiement: PropTypes.array.isRequired,
    proprios: PropTypes.array.isRequired,
    Chien: PropTypes.array.isRequired,
    Tarifs: PropTypes.array.isRequired,
    Comptabilites: PropTypes.array.isRequired,

  }).isRequired,
};

export default BoxAvailability;
