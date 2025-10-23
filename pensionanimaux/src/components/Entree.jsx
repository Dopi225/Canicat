import  { useState } from "react";
import PropTypes from 'prop-types';
import ActionsPreview from "../utils/ActionsPreview";
import usePreviewActions from "../hooks/usePreviewActions";
import { createComptabilite, createOccupation } from "../utils/apiCalls";
import AddCompta from "./AddCompta";
import AddOccupation from "./AddOccupation";
import { getAvailableDog, getProprioNameById } from "../utils/genUtils";

const Entree = ({ data, reload }) => {
  const [totalDogsAdded, setTotalDogsAdded] = useState(0);
  const [maxDogsAllowed, setMaxDogsAllowed] = useState(null);
  const [isComptabiliteAdded, setIsComptabiliteAdded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showDogDialog, setShowDogDialog] = useState(false);
  const [newDog, setNewDog] = useState({
    name: '', proprio: '', dateArrivee: '', tarif: '',
    dateDepart: '', montantTotal: '', nombreBox: '', nombreChien: 0
  });
  const [newOwner, setNewOwner] = useState({ chien: '', box: '',arrivalDate: newDog.dateArrivee, departureDate:  newDog.departureDate});
  const [dogs, setDogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doggy, setDoggy] = useState();
  const [selectedCompta, setSelectedCompta] = useState(null);
  const [currentProprio, setCurrentProprio] = useState(null);

  const { previewActions, addComptaAction, addChienAction, resetActions } = usePreviewActions();

  const handleAddDogAndOwner = () => {
    // console.log("showDialog:", showDialog);
    // console.log("showDogDialog:", showDogDialog);
    // console.log("newOwner:", newOwner);
    // console.log("newDog:", newDog);
    if (showDialog) {
      const newDogEntry = {
        chien: newOwner.chien || 'Chien non spécifié',
        box: newOwner.box || 'Box non spécifiée',
      };
      setDogs(prev => [...prev, newDogEntry]);
      addChienAction(newDogEntry);
      setTotalDogsAdded(prev => prev + 1);
    }

    if (showDogDialog) {
      setSelectedCompta(newDog);
      addComptaAction(newDog);
      setIsComptabiliteAdded(true);
      setMaxDogsAllowed(newDog.nombreChien);
    }

    setNewOwner({ chien: '', box: '', arrivalDate: '',departureDate: '' });
    setShowDialog(false);
    setShowDogDialog(false);
  };

  const handleConfirmActions = async () => {
    setIsSubmitting(true);
    for (let action of previewActions.comptabiliteActions) {
      if (action.action === 'Ajout de comptabilité') {
        const comptabiliteData = {
          nombreChien: String(newDog.nombreChien),
          nombreBox: newDog.nombreBox,
          dateArrivee: newDog.dateArrivee,
          dateDepart: newDog.dateDepart,
          montantTotal: newDog.montantTotal,
          commentaires: '',
          proprio: newDog.proprio,
          tarif: newDog.tarif,
        };

        const comptabiliteId = await createComptabilite(comptabiliteData);

        for (let dog of dogs) {
          await createOccupation({ compta: comptabiliteId, chien: dog.chien, box: dog.box });
        }
      }
    }
    setDogs([]);
    resetActions();
    setIsSubmitting(false);
    reload();
  };
  const handleAddOccup = () => {
  const proprietaire = getProprioNameById(newDog.proprio, data.proprios);
  
  // Update currentProprio with the new proprietor
  setCurrentProprio(proprietaire);
  
  // Update selectedCompta without losing other properties
  const updatedCompta = { ...selectedCompta, proprio: proprietaire };
  setSelectedCompta(updatedCompta);
  
  // Update doggy based on updatedCompta
  const availableDogs = getAvailableDog(data, updatedCompta);
  setDoggy(availableDogs);
  
  // Ensure newOwner is updated with the current proprietor
  setNewOwner(prev => ({ ...prev, proprio: proprietaire }));
  
  setShowDialog(true);
};


  
  
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Dashboard</h1>

      <div className="d-flex flex-column gap-3">
        <div className="d-flex gap-2">
          <button onClick={() => {setShowDogDialog(true)}}  disabled={isComptabiliteAdded}>Ajouter une comptabilité</button>
          <button onClick={() => {
              // setSelectedCompta(newDog);
              handleAddOccup();
          }} disabled={totalDogsAdded >= maxDogsAllowed}>Ajouter une Occupation
          </button>
   
        </div>

        <AddCompta 
          open={showDogDialog} 
          onClose={() => setShowDogDialog(false)} 
          onSubmit={handleAddDogAndOwner} 
          formData={newDog} 
          setFormData={setNewDog} 
          data={data} 
        />

        <AddOccupation 
          open={showDialog} 
          onClose={() => setShowDialog(false)} 
          onSubmit={handleAddDogAndOwner} 
          formData={newOwner} 
          setFormData={setNewOwner} 
          data={data} 
          chiens={doggy} 
          compta={{ ...newDog, proprio: currentProprio }} // Pass the currentProprio here
        />

        <ActionsPreview actions={previewActions} />

        <button onClick={handleConfirmActions} disabled={isSubmitting}>
          {isSubmitting ? "Traitement en cours..." : "Confirmer les actions"}
        </button>
      </div>
    </div>
  );
};

Entree.propTypes = {
  data: PropTypes.shape({
    Occupations: PropTypes.array.isRequired,
    Box: PropTypes.array.isRequired,
    Paiement: PropTypes.array.isRequired,
    proprios: PropTypes.array.isRequired,
    Chien: PropTypes.array.isRequired,
    Tarifs: PropTypes.array.isRequired,
  }).isRequired,
  reload: PropTypes.func,
};

export default Entree;
