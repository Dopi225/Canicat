import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import { handlePageChange, renderPagination } from "../utils/pagination";
import AddProprio from "./AddProprio";
import { createProprio, deleteProprietaire } from "../utils/apiCalls";
import DeleteProprio from "./DeleteProprio";

const Proprio = ({ data, reload }) => {
  const [owners, setOwners] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogDelete, setShowDialogDelete] = useState(false);
  const [newOwner, setNewOwner] = useState({ name: '', surname: '', contact: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompta, setSelectedCompta] = useState(null);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.proprios.length / itemsPerPage);
  const paginationWrapperRef = useRef(null);
  const morphRef = useRef(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.proprios.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (paginationWrapperRef.current && morphRef.current) {
      handlePageChange(currentPage, setCurrentPage, paginationWrapperRef, morphRef);
    }
  }, [currentPage]);
  const handleAddOwner = async () => {
    setOwners([...owners, newOwner]);
    const newProprioEntry = {
      nom: newOwner.name,
      prenom: newOwner.surname,
      contact: newOwner.contact
    };
    await createProprio(newProprioEntry);
    setNewOwner({ name: '', surname: '', contact: '' });
    setShowDialog(false);
    reload();
  };

  // const filteredData = data.proprios.filter(item => {
  //   const searchString = searchTerm.toLowerCase();
  //   return (
  //     item.nom.toLowerCase().includes(searchString) ||
  //     item.prenom?.toLowerCase().includes(searchString)
  //   );
  // });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  const handleDeleteClick = () => {
        setShowDialogDelete(true);
      };
  const handleDeleteSubmit = async () => {
      try {
         await deleteProprietaire(selectedCompta.id);
        setShowDialog(false);
        reload(); // Recharge les données après la suppression
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        // Vous pouvez également afficher un message d'erreur à l'utilisateur ici
      }
    };

  useEffect(() => {
    if (paginationWrapperRef.current && morphRef.current) {
      handlePageChange(currentPage, setCurrentPage, paginationWrapperRef, morphRef);
    }
  }, [currentPage]);

  return (
    <>
      <h1 className="h3 text-center mt-4 mt-md-0 ms-md-0 mb-3">Dashboard</h1>
      <div className="row g-3 top">
        <button onClick={() => setShowDialog(true)}>Ajouter un Propriétaire</button>
        <AddProprio
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSubmit={handleAddOwner}
          formData={newOwner}
          setFormData={setNewOwner}
        />
        <div className="col-lg-12">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Liste des propriétaires</h5>
              <div className="table-controls">
                <div className="search-wrapper">
                  <div className="form-group mb-3 field-with-icon search">
                    <input 
                      type="search" 
                      className="form-control" 
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Rechercher par nom, propriétaire..." 
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive-wrapper">
                <table className="table">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nom & Prénom</th>
                      <th scope="col">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems
                      .map((item, index) => (
                        <tr key={index}>
                          <th scope="row" data-label="#">{item.id}</th>
                          <td>
                          <button onClick={(e) => {
                              e.preventDefault();
                              setSelectedCompta(item);
                              handleDeleteClick();
                            }}> <DeleteIcon /></button>
                          </td>
                          <td data-label="Nom & Prénom">{item.nom} {item.prenom}</td>
                          <td data-label="Contact">{item.contact}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="table-controls">
                <div className="pagination-wrapper">
                  {renderPagination(totalPages, currentPage, paginationWrapperRef, morphRef, (page) => handlePageChange(page, setCurrentPage, paginationWrapperRef, morphRef))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteProprio
        open={showDialogDelete}
        onClose={() => setShowDialogDelete(false)}
        onSubmit={handleDeleteSubmit}
        item={selectedCompta}
      />
    </>
  );
};

Proprio.propTypes = {
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

export default Proprio;
