import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/dateUtils';
import { calculateTotalAmount } from '../utils/tarifUtils';

export default function AddCompta ({ open, onClose, onSubmit, formData, setFormData, data }){ 
  return(
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Creer une Note Comptable</DialogTitle>
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
          
            setFormData({
              ...formData,
              dateArrivee: newDateArrivee,
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
          
            setFormData({
              ...formData,
              dateDepart: newDateDepart,
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
            onChange={(e) => {
              const newTarif = e.target.value;
              const total = calculateTotalAmount(newTarif,formData.nombreChien,
                formData.dateArrivee, formData.dateDepart,data);
                // console.log("total :", total);
              setFormData({
                ...formData,
                tarif: newTarif,
                montantTotal: total,
              });
            }}
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {data.Tarifs.map((payment) => (
              <option key={payment.id} value={payment.libelle}>
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
            value={formData.proprio}
            onChange={(e) => setFormData({ ...formData, proprio: e.target.value })}
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
            value={formData.nombreChien}
            onChange={(e) => {
              const newDogCount = parseInt(e.target.value, 10) || 0;
              const total = calculateTotalAmount(formData.tarif, newDogCount, formData.dateArrivee, formData.dateDepart,data);
              // console.log("total :", total);
              setFormData((prev) => ({
                ...prev,
                nombreChien: newDogCount,
                montantTotal: total,
              }));
            }}
          />
          <TextField
            margin="dense"
            label="Montant Total (€)"
            fullWidth
            variant="outlined"
            value={formData.montantTotal}
            disabled
          />
  
          <TextField
            margin="dense"
            label="Nombre de Box utilisé"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.nombreBox}
            onChange={(e) => setFormData({ ...formData, nombreBox: e.target.value })}
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
    );}

AddCompta.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        dateArrivee : PropTypes.string.isRequired,
        dateDepart: PropTypes.string.isRequired,
          tarif: PropTypes.string.isRequired,
          nombreChien: PropTypes.number.isRequired,
          montantTotal: PropTypes.string.isRequired,
        proprio: PropTypes.string.isRequired,
        nombreBox: PropTypes.number.isRequired,
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

