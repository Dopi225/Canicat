import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';

export default function AddProprio  ({ open, onClose, onSubmit, formData, setFormData}){ 
  return(
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
  </Dialog>);
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

