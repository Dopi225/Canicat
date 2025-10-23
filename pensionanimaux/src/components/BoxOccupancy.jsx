// BoxOccupancy.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
// import './BoxOccupancyCalendar.scss';

const BoxOccupancy = ({ data }) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(year, month, 0).getDate();

  const handleMonthChange = (e) => setMonth(parseInt(e.target.value));
  const handleYearChange = (e) => setYear(parseInt(e.target.value));

  const isDateOccupied = (boxId, day) => {
    const dateToCheck = new Date(year, month - 1, day);
    const reservations = data.Occupations.filter(entry => entry.box === boxId);
    return reservations.some(reservation => {
      const reservationStart = new Date(reservation.dateArrive);
      const reservationEnd = new Date(reservation.dateDepart);
      reservationStart.setHours(0, 0, 0, 0);
      reservationEnd.setHours(23, 59, 59, 999);
      return dateToCheck >= reservationStart && dateToCheck <= reservationEnd;
    });
  };

  const getDogNames = (boxId, day) => {
    const dateToCheck = new Date(year, month - 1, day);
    const reservations = data.Occupations.filter(entry => entry.box === boxId);
    const dogIds = reservations.filter(res => {
      const start = new Date(res.dateArrive);
      const end = new Date(res.dateDepart);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return dateToCheck >= start && dateToCheck <= end;
    }).map(res => res.chien);

    return data.Chien.filter(chien => dogIds.includes(chien.id)).map(chien => chien.nom);
  };

  return (
    <div className="calendar-container responsive">
      <h2>Occupation des boxes</h2>
      <div className="calendar-header">
        <select value={month} onChange={handleMonthChange}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}</option>
          ))}
        </select>
        <input type="number" value={year} onChange={handleYearChange} min="2020" max="2030" />
      </div>
      <div className="calendar-scroll">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>Box</th>
              {[...Array(daysInMonth)].map((_, i) => (
                <th key={i + 1}>{String(i + 1).padStart(2, '0')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.Box.map((box, idx) => (
              <tr key={box.id} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="sticky-col" style={{ backgroundColor: box.couleur || '#eee' }}>Box {box.nom}</td>
                {[...Array(daysInMonth)].map((_, d) => {
                  const day = d + 1;
                  const occupied = isDateOccupied(box.id, day);
                  const dogNames = occupied ? getDogNames(box.id, day) : [];
                  return (
                    <td key={day} className={occupied ? 'occupied' : 'empty'}>
                      {occupied ? dogNames.map(name => <div key={name}>{name}</div>) : 'VIDE'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

BoxOccupancy.propTypes = {
  data: PropTypes.shape({
    Occupations: PropTypes.array.isRequired,
    Box: PropTypes.array.isRequired,
    Chien: PropTypes.array.isRequired
  }).isRequired,
};

export default BoxOccupancy;

/* SCSS - BoxOccupancyCalendar.scss */
