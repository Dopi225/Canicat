import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { handlePageChange, renderPagination } from '../utils/pagination';
import AddChien from './AddChien';
import { createChien, deleteChien } from '../utils/apiCalls';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteChien from './DeleteChien';

function Chien({ data, reload }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogDelete, setShowDialogDelete] = useState(false);
  const [newOwner, setNewOwner] = useState({ nomChien: '',  proprio: '' });
  const [selectedCompta, setSelectedCompta] = useState(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.Chien.length / itemsPerPage);
  const paginationWrapperRef = useRef(null);
  const morphRef = useRef(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.Chien.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (paginationWrapperRef.current && morphRef.current) {
      handlePageChange(currentPage, setCurrentPage, paginationWrapperRef, morphRef);
    }
  }, [currentPage]);

  const handleAddOwner = async () => {
    await createChien(newOwner);
    setShowDialog(false);
    setNewOwner({ nomChien: '', proprio: ''});
    reload();
  };
   const handleDeleteClick = () => { 
      setShowDialogDelete(true);
    };
    const handleDeleteSubmit = async () => {
  try {
   await deleteChien(selectedCompta.id);
    setShowDialog(false);
    reload();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    // Optionally, show error message to the user here
  }
};


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Liste des chiens</h2>
      <button
        onClick={() => setShowDialog(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ajouter un chien
      </button>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Propriétaire</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>
                <button onClick={(e) => {
                    e.preventDefault();
                    setSelectedCompta(item);
                    handleDeleteClick();
                  }}> <DeleteIcon /></button>
                </td>
              <td className="py-2 px-4 border-b">{item.nomChien}</td>
              <td className="py-2 px-4 border-b">{item.proprio || 'Inconnu'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div ref={paginationWrapperRef} className="mt-4 flex justify-center">
        {renderPagination(
          totalPages,
          currentPage,
          paginationWrapperRef,
          morphRef,
          (page) =>
            handlePageChange(page, setCurrentPage, paginationWrapperRef, morphRef)
        )}
      </div>

      {/* Dialog pour ajout de chien */}
      <AddChien
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleAddOwner}
        formData={newOwner}
        setFormData={setNewOwner}
        options={data.proprios}
      />
      <DeleteChien
        open={showDialogDelete}
        onClose={() => setShowDialogDelete(false)}
        onSubmit={handleDeleteSubmit}
        item={selectedCompta}
      />
    </div>
  );
}

Chien.propTypes = {
  data: PropTypes.shape({
    Occupations: PropTypes.array.isRequired,
    Box: PropTypes.array.isRequired,
    Paiement: PropTypes.array.isRequired,
    proprios: PropTypes.array.isRequired,
    Chien: PropTypes.array.isRequired,
    Tarifs: PropTypes.array.isRequired,
    Comptabilites: PropTypes.array.isRequired,

  }).isRequired,
  reload: PropTypes.func,
};
export default Chien;
