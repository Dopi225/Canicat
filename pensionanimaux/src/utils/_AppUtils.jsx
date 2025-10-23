// AppUtils.js

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { apiFetch } from "../hooks/api";
import PropTypes from 'prop-types';

export const handlePageChange = (pageNumber, setCurrentPage, paginationWrapperRef, morphRef) => {
    setCurrentPage(pageNumber);
  
    setTimeout(() => {
      if (!paginationWrapperRef.current || !morphRef.current) return;
  
      const activeButton = paginationWrapperRef.current.querySelector(`button[data-page="${pageNumber}"]`);
      if (!activeButton) return;
  
      const { left, top, width, height, borderRadius } = activeButton.getBoundingClientRect();
      const { left: paginationLeft, top: paginationTop } = paginationWrapperRef.current.getBoundingClientRect();
  
      morphRef.current.style.width = `${width}px`;
      morphRef.current.style.height = `${height}px`;
      morphRef.current.style.transform = `translate(${left - paginationLeft}px, ${top - paginationTop}px)`;
      morphRef.current.style.borderRadius = borderRadius;
      morphRef.current.classList.add('visible');
  
      setTimeout(() => {
        if (morphRef.current) {
          morphRef.current.classList.add('has-transition');
        }
      }, 10);
    }, 0);
  };
  
  export const renderPagination = (totalPages, currentPage, paginationWrapperRef, morphRef, handlePageChange) => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button
            className="page-link"
            data-page={i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }
  
    return (
      <nav className="position-relative" aria-label="Page navigation" ref={paginationWrapperRef}>
        <ul className="pagination">{buttons}</ul>
        <div ref={morphRef} className="morph-bg"></div>
      </nav>
    );
  };
  
  export const createChien = async (occupationData) => {
    const response = await apiFetch('chien/new', occupationData, 'POST');
    if (response.message !== 'ok') {
      throw new Error(`Erreur lors de la création du chien : ${response.statusText}`);
    }
    return response.id;
  };
  export const modifCompta = async (comptaData, id) => {
      const response = await apiFetch(`comptabilite/${id}/edit`, comptaData, 'POST');
      if (response.message !== 'ok') {
        throw new Error(`Erreur lors de la modification de la comptabilité : ${response.statusText}`);
      }
      return response.id;
    };
  export const createProprio = async (occupationData) => {
    const response = await apiFetch('proprietaire/new', occupationData, 'POST');
    if (response.message !== 'ok') {
      throw new Error(`Erreur lors de la création du propriétaire : ${response.statusText}`);
    }
    return response.id;
  };
  
  export const createComptabilite = async (occupationData) => {
    const response = await apiFetch('comptabilite/new', occupationData, 'POST');
    if (response.message !== 'ok') {
      throw new Error(`Erreur lors de la création de la comptabilité : ${response.statusText}`);
    }
    return response.id;
  };
  
  export const createOccupation = async (occupationData) => {
    const response = await apiFetch('Occupation/new', occupationData, 'POST');
    if (response.message !== 'ok') {
      throw new Error(`Erreur lors de la création de l'occupation : ${response.statusText}`);
    }
    return response.id;
  };
  
  export const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Garde seulement "YYYY-MM-DD"
  };
  
  export const getDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
  
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure les deux dates
  
    return diffDays <= 0 ? 0 : diffDays;
  };
  
  export const calculateTotalAmount = (tarifId, dogCount, arrivalDate, departureDate, data) => {
    tarifId = parseInt(tarifId);
    dogCount = parseInt(dogCount);
    const jours = getDaysBetweenDates(arrivalDate, departureDate);
    if (!tarifId || dogCount <= 0) return "";
  
    const selectedTarif = data.Tarifs ? data.Tarifs.find((tarif) => tarif.id === tarifId) : null;
    if (!selectedTarif) return "";
  
    const tarifMontant = Number(selectedTarif.montant); // Convertit la chaîne en nombre
    if (isNaN(tarifMontant)) return ""; // Vérifier que la conversion est valide
  
    return (tarifMontant * dogCount * jours).toFixed(2); // Multiplication + arrondi
  };

 export const getTarifIdByName = (tarifName, tarifs) => {
    const tarif = tarifs.find(t => t.libelle === tarifName);
    return tarif ? tarif.id : null; // Return the id if found, otherwise return null
};

// Fonction pour obtenir les boxes disponibles
export const getAvailableBoxes = (arrival,departure, data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliser l'heure pour éviter les erreurs
  
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);
    arrivalDate.setHours(0, 0, 0, 0);
    departureDate.setHours(0, 0, 0, 0);
  
    const availableBoxes = data.Box.filter((box) => {
      // Récupérer les occupations de cette box
      const activeOccupations = data.Occupations.filter((occupation) => occupation.box === box.id);
  
      // ✅ Si la box n'a jamais été occupée, elle est disponible
      if (activeOccupations.length === 0) {
        return true;
      }
  
      // ✅ Vérifier s'il y a un chevauchement avec la période demandée
      return activeOccupations.every((occupation) => {
        const occupationStart = new Date(occupation.dateArrive);
        const occupationEnd = new Date(occupation.dateDepart);
        occupationStart.setHours(0, 0, 0, 0);
        occupationEnd.setHours(0, 0, 0, 0);
  
        // La box est disponible si la nouvelle période NE chevauche PAS l'occupation existante
        return departureDate <= occupationStart || arrivalDate >= occupationEnd;
      });
    });
  
    return availableBoxes;
  };
  
    export const AddChien = ({ open, onClose, onSubmit, formData, setFormData, options }) => (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter un Chien</DialogTitle>
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            label="Nom du Chien"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
            margin="dense"
            label="Choisissez le proprio"
            select
            fullWidth
            variant="outlined"
            value={formData.proprio}
            onChange={(e) => setFormData({ ...formData, proprio: e.target.value })}
            SelectProps={{ native: true }}
            >
            <option value=""></option>
            {options.map(p => (
                <option key={p.id} value={p.id}>
                {p.nom} {p.prenom}
                </option>
            ))}
            </TextField>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">Annuler</Button>
            <Button onClick={onSubmit} color="primary">Ajouter</Button>
        </DialogActions>
        </Dialog>
    );
    
  export const AddProprio = ({ open, onClose, onSubmit, formData, setFormData}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter un Propriétaire</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Nom"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Prenom"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Contact"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}   color="primary">
                Annuler
            </Button>
            <Button onClick={onSubmit}  color="primary">
                Ajouter
            </Button>
        </DialogActions>
    </Dialog>
  );

  export const AddOccupation = ({ open, onClose, onSubmit, formData, setFormData, data, chiens, compta }) => {
      
    const availableBoxes = getAvailableBoxes(compta.arrivalDate, compta.departureDate, data);  
      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Attribuer un chien à un box</DialogTitle>
          <DialogContent>
          <TextField
            margin="dense"
            label="Chien à garder"
            select
            fullWidth
            variant="outlined"
            value={formData.chien}  // Doit refléter la valeur du chien sélectionné
            onChange={(e) => setFormData({ ...formData, chien: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            {chiens.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.nomChien}
              </option>
            ))}
          </TextField>
  
          <TextField
            margin="dense"
            label="Box utilisée"
            select
            fullWidth
            variant="outlined"
            value={formData.box}  // Doit refléter la valeur de la box sélectionnée
            onChange={(e) => setFormData({ ...formData, box: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            {availableBoxes.map((payment) => (
              <option key={payment.id} value={payment.id}>
                Box {payment.id}
              </option>
            ))}
          </TextField>
           
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Annuler
            </Button>
            <Button onClick={onSubmit} color="primary">
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      );
    };
  
 export const AddCompta = ({ open, onClose, onSubmit, formData, setFormData, data }) => (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Creer une Note Comptable</DialogTitle>
        <DialogContent>
        
        <TextField
          margin="dense"
          label="Date d'Arrivée"
          type="date"
          fullWidth
          variant="outlined"
          value={formatDate(formData.arrivalDate)}
          onChange={(e) => {
            console.log("📅 Date d'arrivée mise à jour :", e.target.value);
            setFormData(prevState => ({ ...prevState, arrivalDate: e.target.value }));
          }}
        />
  
        <TextField
          margin="dense"
          label="Date de Départ"
          type="date"
          fullWidth
          variant="outlined"
          value={formatDate(formData.departureDate)}
          onChange={(e) => {
            console.log("🚀 Date de départ mise à jour :", e.target.value);
            setFormData(prevState => ({ ...prevState, departureDate: e.target.value }));
          }}
        />
  
  
          <TextField
            margin="dense"
            label="Tarif appliqué"
            select
            fullWidth
            variant="outlined"
            value={formData.tarif}
            onChange={(e) => {
              const newTarif = e.target.value;
              const total = calculateTotalAmount(newTarif, formData.dogCount);
              setFormData((prev) => ({
                ...prev,
                tarif: newTarif,
                totalAmount: total,
              }));
            }}
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {data.Tarifs.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.libelle} - {payment.montant}€
              </option>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Propriétaire"
            select
            fullWidth
            variant="outlined"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            {data.proprios.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {`${owner.nom} ${owner.prenom}`}
              </option>
            ))}
          </TextField>
          
  
          <TextField
            margin="dense"
            label="Nombre de Chiens"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.dogCount}
            onChange={(e) => {
              const newDogCount = parseInt(e.target.value, 10) || 0;
              const total = calculateTotalAmount(formData.tarif, newDogCount);
              setFormData((prev) => ({
                ...prev,
                dogCount: newDogCount,
                totalAmount: total,
              }));
            }}
          />
          <TextField
            margin="dense"
            label="Montant Total (€)"
            fullWidth
            variant="outlined"
            value={formData.totalAmount}
            disabled
          />
  
          <TextField
            margin="dense"
            label="Nombre de Box utilisé"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.boxNumber}
            onChange={(e) => setFormData({ ...formData, boxNumber: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Annuler
          </Button>
          <Button onClick={onSubmit} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    );
export const DialogModifCompta = ({ open, onClose, onSubmit, formData, setFormData, data }) => (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Creer une Note Comptable</DialogTitle>
          <DialogContent>
          
          <TextField
            margin="dense"
            label="Date d'Arrivée"
            type="date"
            fullWidth
            variant="outlined"
            value={formatDate(formData.arrivalDate)}
            onChange={(e) => {
              console.log("📅 Date d'arrivée mise à jour :", e.target.value);
              setFormData(prevState => ({ ...prevState, arrivalDate: e.target.value }));
            }}
          />
    
          <TextField
            margin="dense"
            label="Date de Départ"
            type="date"
            fullWidth
            variant="outlined"
            value={formatDate(formData.departureDate)}
            onChange={(e) => {
              console.log("🚀 Date de départ mise à jour :", e.target.value);
              setFormData(prevState => ({ ...prevState, departureDate: e.target.value }));
            }}
          />
    
    
            <TextField
              margin="dense"
              label="Tarif appliqué"
              select
              fullWidth
              variant="outlined"
              value={formData.tarif}
              onChange={(e) => {
                const newTarif = e.target.value;
                const total = calculateTotalAmount(newTarif, formData.dogCount);
                setFormData((prev) => ({
                  ...prev,
                  tarif: newTarif,
                  totalAmount: total,
                }));
              }}
              SelectProps={{ native: true }}
            >
              <option value=""></option>
              {data.Tarifs.map((payment) => (
                <option key={payment.id} value={payment.id}>
                  {payment.libelle} - {payment.montant}€
                </option>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Propriétaire"
              select
              fullWidth
              variant="outlined"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              SelectProps={{
                native: true,
              }}
            >
              <option value=""></option>
              {data.proprios.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {`${owner.nom} ${owner.prenom}`}
                </option>
              ))}
            </TextField>
            
    
            <TextField
              margin="dense"
              label="Nombre de Chiens"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.dogCount}
              onChange={(e) => {
                const newDogCount = parseInt(e.target.value, 10) || 0;
                const total = calculateTotalAmount(formData.tarif, newDogCount);
                setFormData((prev) => ({
                  ...prev,
                  dogCount: newDogCount,
                  totalAmount: total,
                }));
              }}
            />
            <TextField
              margin="dense"
              label="Montant Total (€)"
              fullWidth
              variant="outlined"
              value={formData.totalAmount}
              disabled
            />
    
            <TextField
              margin="dense"
              label="Nombre de Box utilisé"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.boxNumber}
              onChange={(e) => setFormData({ ...formData, boxNumber: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Annuler
            </Button>
            <Button onClick={onSubmit} color="primary">
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      );

export const DeleteProprio = ({ open, onClose, onSubmit, item}) => (
<Dialog open={open} onClose={onClose}>
    <DialogTitle>Supprimer un Propriétaire</DialogTitle>
    <DialogContent>
        <h4>Supprimer le proprietaire : {item.name}</h4>
    </DialogContent>
    <DialogActions>
        <Button onClick={onClose}   color="primary">
            Annuler
        </Button>
        <Button onClick={onSubmit}  color="primary">
            Supprimer
        </Button>
    </DialogActions>
</Dialog>
);
export const DeleteChien = ({ open, onClose, onSubmit, item}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Supprimer un Chien</DialogTitle>
        <DialogContent>
            <h4>Supprimer le chien : {item.name}</h4>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}   color="primary">
                Annuler
            </Button>
            <Button onClick={onSubmit}  color="primary">
                Supprimer
            </Button>
        </DialogActions>
    </Dialog>
    );
export const DeleteComptabilite = ({ open, onClose, onSubmit, item}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Supprimer une Comptabilite</DialogTitle>
        <DialogContent>
            <h4>Supprimer la note comptable : {item.name}</h4>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}   color="primary">
                Annuler
            </Button>
            <Button onClick={onSubmit}  color="primary">
                Supprimer
            </Button>
        </DialogActions>
    </Dialog>
    );
// utils/boxUtils.js

// Fonction pour gérer le changement de date
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
      return dateToCheck >= reservationStart && dateToCheck < reservationEnd;
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
  export const deleteChien = async (id) => {
    const response = await apiFetch(`chien/${id}/delete`, 'DELETE');
    if (response.message !== 'ok') {
      throw new Error(`Erreur lors de la modification de la comptabilité : ${response.statusText}`);
    }
    return response.message;
  };
  export const deleteCompta = async (id) => {
    const response = await apiFetch(`comptabilite/${id}/delete`, undefined, 'DELETE');
    if (response.message !== 'ok') {
      throw new Error(`Erreur lors de la modification de la comptabilité : ${response.statusText}`);
    }
    return response.message;
  };
  export const deleteProprietaire = async (id) => {
    const response = await apiFetch(`proprietaire/${id}/delete`, 'DELETE');
    if (response.message !== 'ok') {
      throw new Error(`Erreur lors de la modification de la comptabilité : ${response.statusText}`);
    }
    return response.message;
  };
  export const EntryInPension = (occupations, targetDate, isTomorrow = false) => {
    const target = new Date(targetDate);
    
    if (isTomorrow) {
      target.setDate(target.getDate() + 1); // Move to the next day
    }
    return occupations.filter((entry) => {
      const arrivalDate = new Date(entry.dateArrive);
      const departureDate = new Date(entry.dateDepart);
      
      if (isTomorrow) {
        // Check if the dog is arriving tomorrow and is still in pension
        return departureDate > target && arrivalDate.getTime() === target.getTime();
      } else {
        // Check if the dog is arriving today
        return arrivalDate.getTime() === target.getTime();
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
      return departureDate > today && arrivalDate < today; // Filter entries with departure date after today
    }).length;
  };
  
  export const countDogsInPensionTomorrow = (occupationsData, today) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return occupationsData.filter((entry) => {
      const departureDate = parseDate(entry.dateDepart);
      const arrivalDate = parseDate(entry.dateArrive);
      return departureDate > tomorrow && arrivalDate <= today; // Filter entries with departure date after today
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
  export const ajoutPayment = async (comptabiliteData, identifiant) => {
        // Vérifiez que comptabiliteData est un objet valide
        if (typeof comptabiliteData !== 'object' || comptabiliteData === null) {
            throw new Error('comptabiliteData doit être un objet valide');
        }
    
        const response = await apiFetch(`comptabilite/${identifiant}/edit`, comptabiliteData, 'POST');
    
        // Vérifiez si la réponse est correcte
        if (response.message  !== 'ok') {
            throw new Error(`Erreur lors de la création de la comptabilité : ${response.statusText}`);
        }
    
        
        return response.id;
    };

    AddChien.propTypes = {
      open: PropTypes.bool.isRequired,
      onClose: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired,
      formData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        proprio: PropTypes.string.isRequired,
      }).isRequired,
      setFormData: PropTypes.func.isRequired,
      options: PropTypes.arrayOf(PropTypes.object).isRequired,
    };
    AddOccupation.propTypes = {
      open: PropTypes.bool.isRequired,
      onClose: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired,
      formData: PropTypes.shape({
          chien: PropTypes.string.isRequired,
          box: PropTypes.string.isRequired,
      }).isRequired,
      setFormData: PropTypes.func.isRequired,
      data: PropTypes.object.isRequired,
      chiens: PropTypes.arrayOf(PropTypes.object).isRequired,
      compta: PropTypes.shape({
          arrivalDate: PropTypes.string.isRequired,
          departureDate: PropTypes.string.isRequired,
      }).isRequired,
  };
  AddCompta.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        arrivalDate: PropTypes.string.isRequired,
        departureDate: PropTypes.string.isRequired,
        tarif: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        dogCount: PropTypes.number.isRequired,
        totalAmount: PropTypes.string.isRequired,
        boxNumber: PropTypes.number.isRequired,
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    data: PropTypes.shape({
        Tarifs: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            libelle: PropTypes.string.isRequired,
            montant: PropTypes.number.isRequired,
        })).isRequired,
        proprios: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            nom: PropTypes.string.isRequired,
            prenom: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
};
DialogModifCompta.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
      arrivalDate : PropTypes.string.isRequired,
      departureDate: PropTypes.string.isRequired,
      tarif: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      dogCount: PropTypes.number.isRequired,
      totalAmount: PropTypes.string.isRequired,
      boxNumber: PropTypes.number.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  data: PropTypes.shape({
      Tarifs: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          libelle: PropTypes.string.isRequired,
          montant: PropTypes.number.isRequired,
      })).isRequired,
      proprios: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          nom: PropTypes.string.isRequired,
          prenom: PropTypes.string.isRequired,
      })).isRequired,
  }).isRequired,
};
DeleteProprio.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
      name: PropTypes.string.isRequired,
  }).isRequired,
};
DeleteChien.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
      name: PropTypes.string.isRequired,
  }).isRequired,
};
DeleteComptabilite.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
      name: PropTypes.string.isRequired,
  }).isRequired,
};
AddProprio.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
      name: PropTypes.string.isRequired,
      surname: PropTypes.string.isRequired,
      contact: PropTypes.string.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
};