import axios, { AxiosError } from "axios";

const getBasicAuth = () => {
  const username = "admin";
  const password = "admin";

  if (!username || !password) {
    return null;
  }

  return `Basic ${btoa(`${username}:${password}`)}`;
};

// Vérifie si l'authentification a expiré
// const checkAuthExpiry = () => {
//   const authTimestamp = localStorage.getItem("authTimestamp");
//   const expiryTime = 3600000; // 1 heure en millisecondes
  
//   if (authTimestamp && Date.now() - parseInt(authTimestamp) > expiryTime) {
//     // Supprimer les credentials expirés
//     localStorage.removeItem("authTimestamp");
//     localStorage.removeItem("htaccess_user");
//     localStorage.removeItem("htaccess_pass");
//     window.location.href = "/"; // Rediriger l'utilisateur vers la page de login
//   }
// };

export async function apiFetch<T>(
  url: string,
  json?: Record<string, unknown>,
  method: string = json ? "POST" : "GET"
): Promise<T> {
  // checkAuthExpiry(); // Vérifier l'expiration de l'authentification

  const basicAuth = getBasicAuth();
  if (!basicAuth) {
    throw new ApiError(401, "Authentification requise");
  }

  try {
    const response = await axios({
      url: `https://apicanicat.simacogroup.com/${url}`,
      method,
      data: json,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
      withCredentials: true,
    });

    return response.data as T;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const message = error.response.data ? error.response.data.message : "Une erreur est survenue";

      throw new ApiError(status, message);
    }
    throw error;
  }
}

class ApiError extends Error {
  constructor(public status: number, public message: string) {
    super(`API Error: ${status} - ${message}`);

    // Gestion spécifique pour les erreurs 401 (Non Authentifié)
    // if (status === 401) {
    //   setTimeout(() => {
    //     window.location.href = "/"; // Rediriger l'utilisateur vers la page de login
    //   }, 2000);
    // }
  }
}

