import { Dialog, DialogTitle, DialogContent, DialogActions, Button,  } from '@mui/material';
import PropTypes from 'prop-types';

export default function DeleteProprio ({ open, onClose, onSubmit, item}){ 
  return(
  <Dialog open={open} onClose={onClose}>
      <DialogTitle>Supprimer un Propriétaire</DialogTitle>
      <DialogContent>
        {item ? (
        <h4>Supprimer le proprietaire : {item.nom} {item.prenom}</h4>
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

DeleteProprio.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
      nom: PropTypes.string,
      prenom: PropTypes.string,
  }).isRequired,
};
