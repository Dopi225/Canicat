import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createOccupation, deleteCompta, modifCompta } from "../utils/apiCalls";
import { handlePageChange, renderPagination } from "../utils/pagination";
import AddOccupation from "./AddOccupation";
import DialogModifCompta from "./DialogModifCompta";
import DeleteComptabilite from "./DeleteComptabilite";
import { getAvailableDog } from "../utils/genUtils";

const Comptabilite = ({ data, reload }) => {
  const [currentPage, setCurrentPage] = useState(1);
    const [showDialog, setShowDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openModifDialog, setOpenModifDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [modifId, setModifId] = useState(null);
  const [selectedCompta, setSelectedCompta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editComptaData, setEditComptaData] = useState({});
  const [dog, setDog] = useState();
  
  const filteredData = data.Comptabilites.filter(item => {
    const searchString = searchTerm.toLowerCase();
    return (
      item.montantTotal.toLowerCase().includes(searchString) ||
      item.dateArrivee.toString().includes(searchString) ||
      item.dateDepart.toLowerCase().includes(searchString) ||
      item.tarif.toLowerCase().includes(searchString)
    );
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.Comptabilites.length / itemsPerPage);
    const paginationWrapperRef = useRef(null);
    const morphRef = useRef(null);
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.Comptabilites.slice(indexOfFirstItem, indexOfLastItem);

    const handleAddClick = (compta) => {
      setSelectedCompta(compta); // Mettez à jour selectedCompta d'abord
      setDog(getAvailableDog(data, compta)); // Utilisez compta ici pour obtenir les chiens disponibles
      setFormData({
        chien: '',
        box: '',
        dateArrivee: compta.dateArrivee, // Utilisez compta pour définir dateArrivee
        dateDepart: compta.dateDepart, // Utilisez compta pour définir dateDepart
        compta: compta.idCompta || 'id compta non spécifié'
      });
      setOpenAddDialog(true); // Ouvrir le dialogue après avoir mis à jour l'état
    };

  
    const handleEditClick = (compta) => {
      setEditComptaData(compta);
      setModifId(compta.id);
      setOpenModifDialog(true);
    };
    const handleDeleteClick = () => {
      setShowDialog(true);
    };
    const handleDeleteSubmit = async () => {
      try {
        await deleteCompta(selectedCompta.id);
        setShowDialog(false);
        reload(); // Recharge les données après la suppression
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        // Vous pouvez également afficher un message d'erreur à l'utilisateur ici
      }
    };
  
    const handleAddSubmit = async () => {
      try {
        if (showDialog && selectedCompta) {
          const newDogEntry = {
            chien: formData.chien || 'Chien non spécifié',
            box: formData.box || 'Box non spécifiée',
            compta: selectedCompta.idCompta || 'id compta non spécifié'
          };
          await createOccupation(newDogEntry);
        } // ✅ utilise la fonction appUtils
        setOpenAddDialog(false);
        reload();
      } catch (error) {
        console.error("Erreur création comptabilité:", error);
      }
    };
  
    const handleModifSubmit = async () => {
      try {
        await modifCompta(editComptaData, modifId); // ✅ utilise la fonction appUtils
        setOpenModifDialog(false);
        reload();
      } catch (error) {
        console.error("Erreur modification comptabilité:", error);
      }
    };
  
    useEffect(() => {
      if (paginationWrapperRef.current && morphRef.current) {
        handlePageChange(currentPage, setCurrentPage, paginationWrapperRef, morphRef);
      }
    }, [currentPage]);
    // console.log(editComptaData);

  return (
    <>
      <h1 className="h3 text-center mt-4 mt-md-0 ms-md-0 mb-3">Dashboard</h1>
      <div className="row g-3 top">
        <div className="col-lg-12">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">La comptabilité</h5>
              <div className="table-controls">
                <div className="search-wrapper">
                  <div className="form-group mb-3 field-with-icon search">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search by name or activity"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive-wrapper">
                <table className="table">
                  <thead className="bg-light">
                    <tr>
                      <th>#</th>
                      <th>Action</th>
                      <th>Nom & Prénom</th>
                      <th>Date arrivée</th>
                      <th>Date départ</th>
                      <th>Nombre de chien</th>
                      <th>Type Tarif</th>
                      <th>Montant Total</th>
                      <th>Type de Paiement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData
                        .slice(currentItems)
                        .map((item, index) => (
                        <tr key={index}>
                          <th>{item.id}</th>
                          <td>
                          <button onClick={() => {
                              handleAddClick(item);
                            }}><AddIcon /> </button>
                            <button onClick={() => handleEditClick(item)}> <EditIcon /></button>
                            <button onClick={(e) => {
                              e.preventDefault();
                              setSelectedCompta(item);
                              handleDeleteClick();
                            }}> <DeleteIcon /></button>
                          </td>
                          <td>{item.proprio}</td>
                          <td>{item.dateArrivee}</td>
                          <td>{item.dateDepart}</td>
                          <td>{item.nombreChien}</td>
                          <td>{item.tarif}</td>
                          <td>{item.montantTotal}</td>
                          <td>{item.paiement}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="table-controls">
                
                <div ref={paginationWrapperRef} className="mt-4 flex justify-center pagination-wrapper">
                  {renderPagination(
                    totalPages,
                    currentPage,
                    paginationWrapperRef,
                    morphRef,
                    (page) =>
                      handlePageChange(page, setCurrentPage, paginationWrapperRef, morphRef)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddOccupation
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false)}}
        onSubmit={handleAddSubmit}
        formData={formData}
        setFormData={setFormData}
        data={data}
        chiens={dog} // ✅ Ajouter cette ligne
        compta={selectedCompta} // ✅ Ajouter cette ligne
      />

      <DialogModifCompta
        open={openModifDialog}
        onClose={() => setOpenModifDialog(false)}
        onSubmit={handleModifSubmit}
        formData={editComptaData}
        setFormData={setEditComptaData}
        data={data}
      />
      <DeleteComptabilite
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleDeleteSubmit}
        item={selectedCompta}
      />
    </>
  );
};

Comptabilite.propTypes = {
  data: PropTypes.shape({
    Occupations: PropTypes.array.isRequired,
    Box: PropTypes.array.isRequired,
    Paiement: PropTypes.array.isRequired,
    proprios: PropTypes.array.isRequired,
    Chien: PropTypes.array.isRequired,
    Tarifs: PropTypes.array.isRequired,
    Comptabilites: PropTypes.array.isRequired,

  }).isRequired,
  reload: PropTypes.func.isRequired,
};

export default Comptabilite;
