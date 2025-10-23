// src/components/ActionsPreview.js
import PropTypes from 'prop-types';

const ActionsPreview = ({ actions }) => {
  return (
    <div className="actions-preview">
      <h4>Aperçu des actions effectuées</h4>
      {actions.comptabiliteActions.length > 0 && (
        <div>
          <h5>Comptabilité</h5>
          <ul>
            {actions.comptabiliteActions.map((action, index) => (
              <li key={index}>
                {action.action} - {action.comptaDetails} - {action.date1} - {action.date2}
                <br />
                {action.proprio}
              </li>
            ))}
          </ul>
        </div>
      )}

      {actions.chienActions.length > 0 && (
        <div>
          <h5>Chiens</h5>
          <ul>
            {actions.chienActions.map((action, index) => (
              <li key={index}>
                {action.action} - (Box à occuper : {action.box}) - {action.date}
              </li>
            ))}
          </ul>
        </div>
      )}

      {actions.comptabiliteActions.length === 0 && actions.chienActions.length === 0 && (
        <p>Aucune action effectuée.</p>
      )}
    </div>
  );
};

ActionsPreview.propTypes = {
  actions: PropTypes.shape({
    comptabiliteActions: PropTypes.arrayOf(
      PropTypes.shape({
        action: PropTypes.string.isRequired,
        comptaDetails: PropTypes.string.isRequired,
        date1: PropTypes.string.isRequired,
        date2: PropTypes.string.isRequired,
      })
    ).isRequired,
    chienActions: PropTypes.arrayOf(
      PropTypes.shape({
        action: PropTypes.string.isRequired,
        box: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ActionsPreview;
