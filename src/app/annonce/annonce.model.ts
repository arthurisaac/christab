import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {Engin} from "../engin/engin.model";
import {Itineraire} from "../itineraire/itineraire.model";
import {Reservation} from "../reservation/reservation.model";
import {AvisDto} from "../avis/avis.model";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";

export class Annonce {
    idAnnonce?: number;
    libelleAnnonce?: string;
    dateAnnonce?: string;
    dateDepart?: string;
    depart?: string;
    destination?: string;
    lieuDepart?:string;
    lieuArrivee?: string;
    nbrePersonne?: string;
    plagePrix?: string;
    prix?: number;
    prixReservation?: number;
    totalPrix?: number;
    publier?: boolean;
    demander?: boolean;
    idUtilisateur?: any;
    idItineraire?: any;
    idEngin?: any;
}

export class UserAnnonce {
    idA?: number;
    idU?: number;
    idI?: number;
}

export class  AWfilter {
    d?: string;
    a?: string;
    ld?: string;
    la?: string;
    np?: string;
    hd?: string;
    ha?: string;
    dd?: string;
    da?: string;
    te?: string;
    tv?: string;
    idIS1?: number;
    idIS2?: number;
    idIS3?: number;
    idIS4?: number;
}

export class AnnonceDto {
    idAnnonce: number;
    idItineraire: number;
    idUtilisateur: number;
    idEngin: number;
    libelleAnnonce: string;
    dateAnnonce: string;
    dateDepart: string;
    depart: string;
    destination: string;
    lieuDepart: string;
    lieuArrivee: string;
     nbrePersonne: number;
    prix: number;
    publier: boolean;
    demander: boolean;
    utilisateur: UtilisateurDto;
    engin: Engin;
    itineraire: Itineraire;
    reservations: Array<Reservation>;
    avis: Array<AvisDto>;
    informationsSupplementaires: Array<InformationsSupplementaires>;
}
