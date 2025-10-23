import PropTypes from "prop-types";

const Sidebar = ({ onComponentChange, activeComponent, isOpen, onToggle }) => {
    return (
      <>
      <div className={`sidebar bg-white p-3 h-100 ${isOpen ? 'open' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Menu</h5>
          <button className="btn btn-close d-xxl-none" onClick={onToggle}></button>
        </div>
        <ul className="list-group sidebar-nav">
          <li className="list-group-item">
            <button 
              className={`btn ${activeComponent === "Vue d'ensemble" ? "active" : ""}`} 
              onClick={() => onComponentChange("Vue d'ensemble")}
            >
              Vue d&apos;ensemble
            </button>
          </li>
          <li className="list-group-item">
            <button 
              className={`btn ${activeComponent === "Entrée de chien" ? "active" : ""}`}
              onClick={() => onComponentChange("Entrée de chien")}
            >
              Entrée de chien
            </button>
          </li>
          <li className="list-group-item">
            <button 
              className={`btn ${activeComponent === "Chiens" ? "active" : ""}`}
              onClick={() => onComponentChange("Chiens")}
            >
              Chiens
            </button>
          </li>
          <li className="list-group-item">
            <button 
              className={`btn ${activeComponent === "Proprietaires" ? "active" : ""}`}
              onClick={() => onComponentChange("Proprietaires")}
            >
              Proprietaires
            </button>
          </li>
          <li className="list-group-item">
            <button 
              className={`btn ${activeComponent === "Comptabilité" ? "active" : ""}`}
              onClick={() => onComponentChange("Comptabilité")}
            >
              Comptabilité
            </button>
          </li>
          <li className="list-group-item">
            <button 
              className={`btn ${activeComponent === "boxes" ? "active" : ""}`}
              onClick={() => onComponentChange("boxes")}
            >
              Dispo des Boxes
            </button>
          </li>
        </ul>
      </div>
      {isOpen && <div className="sidebar-overlay d-md-none" onClick={onToggle}></div>}
      </>
    );
  };

  Sidebar.propTypes = {
    onComponentChange: PropTypes.func.isRequired,
    activeComponent: PropTypes.func.isRequired,
    isOpen: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
  };
  export default Sidebar;