export class Paiement {
    idPaiement?: number;
    datePaiement?: string;
    montantPaiement?: number;
    codeOtp?: number;
    numeroClient?: number;
    idUtilisateur?: number;
    numeroPaiement?: number;
    heurePaiement?: string;
    adhesion?: boolean;
    renouveler?:boolean;
}

export class FilterDates {
    startDate?: string;
    endDate?: string;
}
