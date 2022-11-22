export class UtilisateurDto {
    idUtilisateur?: number;
    nom?: string;
    prenom?: string;
    email?: string;
    password?: string;
    pwdConfirmed?: string;
    tel?: number;
    photo?: any;
    typeDocument: string;
    numeroCnib: string;
    dateDelivrance: string;
    dateExpiration: string;
    dateInscription: string;
    lieuDelivrance: string;
    cnib: any;
    cnibR?: any;
    cnibV?: any;
    cnibT?: any;
    idTypeFonction?: any;
    afficherTel?: boolean; // pour afficher le téléphone de l'utilisateur dans les détails s'il autorise
    afficherEmail?: boolean; // pour afficher l'email de l'utilisateur dans les détails s'il autorise
    courrierEvaluation?: boolean; // pour envoyer un courriel à l'utilisateur le rappelant d'évaluer un trajet s'il autorise
    courrierPromotion?: boolean; // pour envoyer un courriel à l'utilisateur l'informant des promotions' d'évaluer un trajet s'il autorise
    telSos?: string;
}

