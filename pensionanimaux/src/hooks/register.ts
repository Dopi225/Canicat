
export function useAuth() {
    const username;
    const password;
const handleLogin = (username, password) => {
    // Après une connexion via htaccess ou un formulaire, enregistrer l'heure et les infos dans localStorage
    localStorage.setItem("user", username);
    localStorage.setItem("pass", password);
    saveAuthTimestamp();  // Sauvegarder le timestamp d'authentification
  
    // Optionnel : Tu peux faire une requête ici pour vérifier les identifiants via ton API
    window.location.href = "/"; // Redirige l'utilisateur vers la page principale
  };
  
const saveAuthTimestamp = () => {
    const currentTimestamp = Date.now();
    localStorage.setItem("authTimestamp", currentTimestamp.toString());
  };

  return {
    handleLogin
  };
}