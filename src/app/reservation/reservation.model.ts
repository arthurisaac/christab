export class Reservation {
    idReservation?: number;
    dateReservation?: string;
    destination?: string;
    idUtilisateur?: any;
    idItineraire?: any;
    idDriver?: any;
    confirmerArrivee?: boolean;
    annuler?: boolean;
}

export class UserItin {
    idU?: number;
    idI?: number;
}
