import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { getAvailableBoxes } from '../utils/boxUtils';
import { useEffect } from "react";
export default function AddOccupation ({ open, onClose, onSubmit, formData, setFormData, data, chiens }) {
  useEffect(() => {
      if (open) {
        setFormData(formData); // Mettre à jour les données du formulaire lorsque le dialogue s'ouvre
      }
    }, [open, formData, setFormData]);
  
    const arrive = formData.dateArrivee || formData.arrivalDate;
    const depart = formData.departureDate || formData.dateDepart;
      
    const availableBoxes = getAvailableBoxes(arrive, depart, data);  
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
            {(chiens || []).map((payment) => (
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
            {(availableBoxes || []).map((payment) => (
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

AddOccupation.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
      chien: PropTypes.string.isRequired,
      box: PropTypes.string.isRequired,
      dateArrivee: PropTypes.string,
    dateDepart: PropTypes.string,
    arrivalDate: PropTypes.string,
    departureDate: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  chiens: PropTypes.arrayOf(PropTypes.object).isRequired,
  
};

