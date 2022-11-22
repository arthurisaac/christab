export class Itineraire {
    idItineraire?: number;
    heureDepart?: string;
    heureArrivee?: string;
    typeLocalite?: string; // pour enregistrer le type de l'engin
    dateDepart?: string;
    dateArrivee?: string;
    typeVoyage?: string;
    confirmerDepart?: boolean;
    confirmerArrivee?: boolean;
    longitude?: number;
    latitude?: number;
    positionDepart?: string;
    positionArrivee?: string;
}
