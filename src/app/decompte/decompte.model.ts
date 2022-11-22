export class Decompte {
    idDecompte?: number;
    dateDecompte?: string;
    montantDecompte?: number;
    idUtilisateur?: number;
    debiter?: boolean;
    crediter?: boolean;
}

export class FilterDates {
    startDate?: string;
    endDate?: string;
}
