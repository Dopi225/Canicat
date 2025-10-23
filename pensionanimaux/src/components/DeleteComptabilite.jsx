import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import PropTypes from 'prop-types';

export default function DeleteComptabilite  ({ open, onClose, onSubmit, item}){  
  return(
  <Dialog open={open} onClose={onClose}>
      <DialogTitle>Supprimer une Comptabilite</DialogTitle>
      <DialogContent>
      {item ? (
      <h4>
        Supprimer la note comptable : {item.dateArrivee} - {item.dateDepart} de {item.proprio}
      </h4>
    ) : (
      <h4>Chargement des données...</h4>
    )}
      </DialogContent>
      <DialogActions>
          <Button onClick={onClose}   color="primary">
              Annuler
          </Button>
          <Button onClick={onSubmit}  color="primary">
              Supprimer
          </Button>
      </DialogActions>
  </Dialog>);
  };

DeleteComptabilite.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
       proprio: PropTypes.string,
        dateArrivee: PropTypes.string,
        dateDepart: PropTypes.string,
  }).isRequired,
};
