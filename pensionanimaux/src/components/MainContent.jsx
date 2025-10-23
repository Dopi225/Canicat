import { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { calculateAvailableBoxes, calculateMonthlyTotals, countDeparturesToday, countDeparturesTomorrow, countDogsInPension, countDogsInPensionTomorrow, countOccupiedBoxes, countTotalBoxes, EntryInPension, filterComptaByYear } from "../utils/genUtils";
import { handlePageChange, renderPagination } from "../utils/pagination";
import { ajoutPayment } from "../utils/apiCalls";


const MainContent = ({ data, reload }) => {
  const chartRef = useRef(null);
  const paginationWrapperRef = useRef(null);
  const morphRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [showDogDialog, setShowDogDialog] = useState(false);
  const [showDialog1, setShowDialog1  ] = useState(false);
  const [newDog, setNewDog] = useState({ paymentType: '' });
  const [id, setId] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const chartInstanceRef = useRef(null);

  const itemsPerPage = 5;

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  //entree aujourd'hui
  const entriesToday = EntryInPension(data.Occupations, today, false);

  //entree demain
  const entriesTomorrow = EntryInPension(data.Occupations, today, true);

  //total des box
  const totalBoxes = countTotalBoxes(data.Box);

  //box occupés
  const occupiedBoxes = countOccupiedBoxes(data.Occupations, today);

  //box dispo
  const availableBoxes = calculateAvailableBoxes(totalBoxes, occupiedBoxes);

  //depart aujourd'hui
  const departuresToday = countDeparturesToday(data.Occupations, today);

  //depart demain
  const departuresTomorrow = countDeparturesTomorrow(data.Occupations, today);

  //chien en pension aujourd'hui
  const dogsInPension = countDogsInPension(data.Occupations, today);

  //chien en pension demain
  const dogsInPensionTomorrow = countDogsInPensionTomorrow(data.Occupations, today);

  //tableau entree et depart filtré par recherche (sur nomChien, dateDepart, tarif)
  const filteredData = data.Occupations.filter(item => {
    const searchString = searchTerm.toLowerCase();
    return (
      item.nomChien.toLowerCase().includes(searchString) ||
      item.dateDepart.toLowerCase().includes(searchString) ||
      item.tarif.toLowerCase().includes(searchString)
    );
  });

  // Filtrer les occupations dont dateDepart ou dateArrive correspond à aujourd'hui
    // Filtrer les occupations dont dateDepart ou dateArrive est aujourd'hui ou dans le futur
// Filtrer les occupations dont dateDepart ou dateArrive est aujourd'hui ou dans le futur
// Filtrer les occupations dont dateDepart ou dateArrive correspond à aujourd'hui ou dans le futur
// Filtrer les occupations dont dateDepart ou dateArrive correspond à aujourd'hui ou dans le futur
const DataTableau = filteredData.filter(item => {
  const todayStr = new Date().toISOString().split('T')[0];
  const dateDepart = item.dateDepart; // déjà au format YYYY-MM-DD
  const dateArrive = item.dateArrive; // déjà au format YYYY-MM-DD

  // Vérifier si la date d'arrivée est aujourd'hui ou dans le futur
  return dateDepart >= todayStr || dateArrive >= todayStr;
});

// Log des données filtrées
console.log("DataTableau:", DataTableau);

// Calculer le nombre total de pages
const totalPages = Math.ceil(DataTableau.length / itemsPerPage);
console.log("totalPages:", totalPages);

// Vérifier si currentPage est supérieur à totalPages
if (currentPage > totalPages && totalPages > 0) {
  setCurrentPage(totalPages); // Réinitialiser à la dernière page si currentPage est trop élevé
}

// Calculer les index pour la pagination
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

// Utiliser currentItems paginé de DataTableau
const currentItems = DataTableau.slice(indexOfFirstItem, indexOfLastItem);
console.log("currentItems:", currentItems);


// Afficher un message si currentItems est vide
if (currentItems.length === 0) {
  console.log("Aucune entrée ou départ à afficher.");
}





  //chien en pensions liste
  const Data = data.Occupations.filter((item) => {
    const today = new Date().toISOString().split('T')[0];
    const dateDepart = item.dateDepart.split(' ')[0];
    const dateArrive = item.dateArrive.split(' ')[0];
    return dateArrive <= today && dateDepart >= today;
  });
  
  
  const totalPages2 = Math.ceil(Data.length / itemsPerPage);

  useEffect(() => {
    if (paginationWrapperRef.current && morphRef.current) {
      handlePageChange(currentPage, setCurrentPage, paginationWrapperRef, morphRef);
    }
  }, [currentPage]);
  useEffect(() => {
    if (paginationWrapperRef.current && morphRef.current) {
      handlePageChange(currentPage1, setCurrentPage1, paginationWrapperRef, morphRef);
    }
  }, [currentPage1]);

 
  //chercher dans le tableau entree et depart
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  //Validation de paiement
  const handleAddPaiement = async () => {
    const comptabiliteData = { paiement: newDog.paymentType };
    await ajoutPayment(comptabiliteData, id); 
    setNewDog({ paymentType: '' });
    reload();
    setShowDogDialog(false);
  };
  //dialog pour ajouter paiement
  const AddPaiement = () => (
    <Dialog open={showDogDialog} onClose={() => setShowDogDialog(false)}>
      <DialogTitle>Ajouter type de paiement</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Type de Paiement"
          select
          fullWidth
          variant="outlined"
          value={newDog.paymentType}
          onChange={(e) => setNewDog({ ...newDog, paymentType: e.target.value })}
          SelectProps={{ native: true }}
        >
          <option value=""></option>
          {data.Paiement.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.type}
            </option>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowDogDialog(false)} color="primary">Annuler</Button>
        <Button onClick={handleAddPaiement} color="primary">Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
  //dialog voir chien en pension
  const renderChienDialog = () => (
    <Dialog open={showDialog1} onClose={() => closeDialog()}>
      <DialogTitle>Les Chiens en pensions</DialogTitle>
      <DialogContent>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="table-responsive-wrapper">
              <table className="table">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nom</th>
                      <th scope="col">Box occupés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row" data-label="#">{item.id}</th>
                            <td data-label="Nom">{item.nomChien}</td>
                            <td data-label="Box occupés">{item.box}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="table-controls">
                <div className="pagination-wrapper">
                {renderPagination(totalPages2, currentPage1, setCurrentPage1, paginationWrapperRef, morphRef)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
  
  //fermer dialog voir chien
  const closeDialog = () => {
    setShowDialog1(false);
  }

  //ouvrir dialog voir chien
  const openDialog = () => {
    setShowDialog1(true);
  }
 

  const filteredData2 = filterComptaByYear(data.Comptabilites, selectedYear);
  const hasData = filteredData2.length > 0;

  useEffect(() => {
    if (!chartRef.current || !hasData) return;
  
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
  
    const monthlyTotals = calculateMonthlyTotals(filteredData2);
  
    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 
          "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
        ],
        datasets: [
          {
            label: "Montant récolté (€)",
            data: monthlyTotals,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [selectedYear, filteredData2, hasData]);

  // Fonction pour déterminer l'état
  const getEtat = (dateDepart, dateArrive, today) => {
    if (dateDepart === today) return 'Départ';
    if (dateArrive === today) return 'Entrée';
    return '';
  };

  // Fonction pour vérifier l'existence d'un paiement
  const isPaiementAbsent = (idCompta) => {
    const comptabilite = data.Comptabilites.find(compta => compta.id === idCompta);
    return comptabilite && comptabilite.paiement === "";
  };


  return (
    <div className="content-main">
      <div className="container-fluid">
        <h1 className="h3 mt-4 mb-3 text-center">Dashboard</h1>
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="card card-stat h-100">
              <div className="card-body">
                <h5 className="card-title mx-auto text-center">Récapitulatif du jour</h5>
                <p className="text-muted">
                  Vous avez l&apos;ensemble de Box disponible, de chiens en pension, de departs et d&apos;entrées, tout à la date d&apos;aujourd&apos;hui.
                </p>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 g-3">
                <div className="col">
                  <div className="card card-stat h-100">
                      <div className="card-body">
                        <h5 className="card-title">Box disponibles</h5>
                        <p className="card-text display-6 m-0">
                          {availableBoxes <= 0 ? "Aucun box disponible" : availableBoxes}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                        <div className="card card-stat h-100" onClick={() => {
                          openDialog(); 
                        }}>
                      <div className="card-body">
                        <h5 className="card-title">Chiens en pensions</h5>
                        <p className="card-text display-6 m-0">
                        {dogsInPension}<span className="fs-small"> Chiens</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card-stat h-100">
                      <div className="card-body">
                        <h5 className="card-title">Departs Aujourd&apos;hui</h5>
                        <p className="card-text display-6 m-0">{departuresToday} <span className="fs-small"> Départs</span> </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card-stat h-100">
                      <div className="card-body">
                        <h5 className="card-title">Entrée Aujourd&apos;hui</h5>
                        <p className="card-text display-6 m-0">
                        {entriesToday}<span className="fs-small"> Entrées</span> 
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title text-center">Récoltés sur l&apos;année</h5>

                {/* Sélecteur d'année */}
                <div className="mb-3">
                  <label>Choisir une année :</label>
                  <select
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {[...new Set(data.Comptabilites.map((entry) => new Date(entry.dateArrivee).getFullYear()))]
                      .sort((a, b) => b - a) // Trier par année décroissante
                      .map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                  </select>
                </div>

                {/* Graphique */}
                <div className="chart-container" style={{ height: "300px", width: "100%" }}>
                  {hasData ? (
                    <canvas ref={chartRef} style={{ maxHeight: "100%", maxWidth: "100%" }} />
                  ) : (
                    <p className="text-muted text-center mt-3">Données indisponibles pour {selectedYear}</p>
                  )}
                </div>
              </div>
              
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title text-center mb-3">Demain vous aurez ...</h5>

                <div className="col mb-3">
                    <div className="card card-stat h-100">
                      <div className="card-body">
                        <h5 className="card-title">Chiens en pensions</h5>
                        <p className="card-text display-6 m-0">
                        {dogsInPensionTomorrow}<span className="fs-small"> Chiens</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col mb-3">
                    <div className="card card-stat h-100">
                      <div className="card-body">
                        <h5 className="card-title">Entrée</h5>
                        <p className="card-text display-6 m-0">
                        {entriesTomorrow}<span className="fs-small"> Chiens</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card-stat h-100">
                      <div className="card-body">
                        <h5 className="card-title">Départ</h5>
                        <p className="card-text display-6 m-0">
                        {departuresTomorrow}<span className="fs-small"> Départ</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
              </div>
              
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Liste des départs et entrée de la journée</h5>
                <div className="table-controls">
                  <div className="search-wrapper">
                    <div className="form-group mb-3 field-with-icon search">
                      <input
                        type="search"
                        className="form-control"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Rechercher par nom, activité..."
                      />
                    </div>
                  </div>
                </div>
                <div className="table-responsive-wrapper">
                  <table className="table">
                    <thead className="bg-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Date</th>
                        <th scope="col">État</th>
                        <th scope="col">Box occupés</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DataTableau.length > 0 ? (
                        DataTableau.map((item, index) => {
                          const todayStr = new Date().toISOString().split('T')[0];
                          const dateDepart = item.dateDepart;
                          const dateArrive = item.dateArrive;
                          const etat = getEtat(dateDepart, dateArrive, todayStr);
                          const paiementNoExists = isPaiementAbsent(item.idCompta);

                          return (
                            <tr key={index}>
                              <th scope="row" data-label="#">{item.id}</th>
                              <td data-label="Nom">{item.nomChien}</td>
                              <td data-label="Date">{dateDepart === todayStr ? item.dateDepart : item.dateArrive}</td>
                              <td data-label="Etat">{etat}</td>
                              <td data-label="Box occupés">{item.box}</td>
                              <td data-label="Action">
                                {etat === 'Départ' && paiementNoExists ? (
                                  <a href="#" onClick={() => { setShowDogDialog(true); setId(item.idCompta); }}>
                                    Ajouter paiement
                                  </a>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">Aucune entrée ou départ à afficher.</td>
                        </tr>
                      )}
                    </tbody>



                  </table>
                </div>
                <div className="table-controls">
                  <div className="pagination-wrapper">
                    {renderPagination(totalPages, currentPage, setCurrentPage, paginationWrapperRef, morphRef)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {AddPaiement()}
        {renderChienDialog()}
      </div>
    </div>
  );
};

MainContent.propTypes = {
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

export default MainContent;


