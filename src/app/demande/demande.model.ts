export class Demande {
    idDemande?: number;
    dateDemande?: string;
    dateDepart?: string;
    depart?: string;
    destination?: string;
    lieuDepart?:string;
    lieuArrivee?: string;
    nbrePlace?: string;
    prix?: number;
    demander?: boolean;
    idUtilisateur?: any;
    idItineraire?: any;
}

export class UserDemande {
    idD?: number;
    idU?: number;
    idI?: number;
}
