import { Dialog, DialogTitle, DialogContent, DialogActions, Button,  } from '@mui/material';
import PropTypes from 'prop-types';

export default function DeleteChien ({ open, onClose, onSubmit, item}){ 
  return(
  <Dialog open={open} onClose={onClose}>
      <DialogTitle>Supprimer un Chien</DialogTitle>
      <DialogContent>
      {item ? (
        <h4>Supprimer le chien : {item.nomChien}</h4>
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

DeleteChien.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
    nomChien: PropTypes.string,
  }).isRequired,
};
