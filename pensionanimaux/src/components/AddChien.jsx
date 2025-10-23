import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';

export default function AddChien  ({ open, onClose, onSubmit, formData, setFormData, options }){ 
  return(
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Ajouter un Chien</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Nom du Chien"
        fullWidth
        value={formData.nomChien}
        onChange={(e) => setFormData({ ...formData, nomChien: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Choisissez le proprio"
        select
        fullWidth
        value={formData.proprio}
        onChange={(e) => setFormData({ ...formData, proprio: e.target.value })}
        SelectProps={{ native: true }}
      >
        <option value=""></option>
        {options.map(p => (
          <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
        ))}
      </TextField>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Annuler</Button>
      <Button onClick={onSubmit}>Ajouter</Button>
    </DialogActions>
  </Dialog>
);};

AddChien.propTypes = {
      open: PropTypes.bool.isRequired,
      onClose: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired,
      formData: PropTypes.shape({
        nomChien: PropTypes.string.isRequired,
        proprio: PropTypes.string.isRequired,
      }).isRequired,
      setFormData: PropTypes.func.isRequired,
      options: PropTypes.arrayOf(PropTypes.object).isRequired,
    };

