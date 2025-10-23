import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/dateUtils';
import { calculateTotalAmount } from '../utils/tarifUtils';
import {  useEffect} from 'react';
export default function DialogModifCompta ({ open, onClose, onSubmit, formData, setFormData, data }) {

  useEffect(() => {
    if (open) {
      setFormData(formData); // Mettre à jour les données du formulaire lorsque le dialogue s'ouvre
    }
  }, [open, formData, setFormData]);
        return(
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Modifier la Comptabilite</DialogTitle>
          <DialogContent>
          
          <TextField
            margin="dense"
            label="Date d'Arrivée"
            type="date"
            fullWidth
            variant="outlined"
            value={formatDate(formData.dateArrivee)}
            onChange={(e) => {
              const newDateArrivee = e.target.value;
              const montantTotal = calculateTotalAmount(
                formData.tarif,
                formData.nombreChien,
                newDateArrivee, // Use the new date directly
                formData.dateDepart,
                data
              );
              setFormData({
                ...formData,
                dateArrivee: newDateArrivee,
                montantTotal: montantTotal, // Update montantTotal in the same call
              });
            }}
          />
    
          <TextField
            margin="dense"
            label="Date de Départ"
            type="date"
            fullWidth
            variant="outlined"
            value={formatDate(formData.dateDepart)}
            onChange={(e) => {
              const newDateDepart = e.target.value;
              const montantTotal = calculateTotalAmount(
                formData.tarif,
                formData.nombreChien,
                formData.dateArrivee,
                newDateDepart, // Use the new date directly
                data
              );
              setFormData({
                ...formData,
                dateDepart: newDateDepart,
                montantTotal: montantTotal, // Update montantTotal in the same call
              });
            }}
          />
    
    
            <TextField
              margin="dense"
              label="Tarif appliqué"
              select
              fullWidth
              variant="outlined"
              value={formData.tarif}
              disabled
            />
            <TextField
              margin="dense"
              label="Montant Total (€)"
              fullWidth
              variant="outlined"
              value={formData.montantTotal}
              disabled
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
        </Dialog>);
      };

DialogModifCompta.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    dateArrivee : PropTypes.string.isRequired,
    dateDepart: PropTypes.string.isRequired,
      tarif: PropTypes.string.isRequired,
      nombreChien: PropTypes.number.isRequired,
      montantTotal: PropTypes.string.isRequired,
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
