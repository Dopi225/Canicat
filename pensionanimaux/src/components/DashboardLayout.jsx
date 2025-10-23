import { useState} from "react";
import useApiData from "../hooks/useApiData";

import Sidebar from "./sidebar";
import MainContent from "./MainContent";

// Ajoutez des styles CSS par défaut
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Entree from "./Entree";
import Proprio from "./Proprio";
import Chien from "./Chien";
import Comptabilite from "./Comptabilite";
import BoxAvailability from "./BoxAvailability";
import BoxOccupancy from "./BoxOccupancy";

const DashboardLayout = () => {
    const { data, loading, error, refetch } = useApiData();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeComponent, setActiveComponent] = useState("Vue d'ensemble");

    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };
    
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
    

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error.message}</p>;
    return (
      <div className="container-fluid">
        <button 
          className="btn btn-toggle-sidebar" 
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
        <Sidebar 
          onComponentChange={handleComponentChange} 
          activeComponent={activeComponent}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        <div className="main-content">
          {activeComponent === "Vue d'ensemble" && <MainContent data={data} />}
          {activeComponent === "Entrée de chien" && <Entree data={data} reload={refetch} />}
          {activeComponent === "Proprietaires"  && <Proprio data={data} reload={refetch}/>}
          {activeComponent === "Chiens" && <Chien data={data} reload={refetch}/>}
          {activeComponent === "Comptabilité"&& <Comptabilite data={data} reload={refetch}/>}
          {activeComponent === "boxes" && <BoxAvailability data={data}/>}
        </div>
      </div>
    );
  };

  export default DashboardLayout;