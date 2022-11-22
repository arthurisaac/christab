import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UtilisateurDto } from './utilisateur.model';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {AuthenticationService} from "../authentication.service";
import {Urls} from "../urls";

@Injectable({
    providedIn: 'root'
})
export class UtilisateurService {



    urlAll = this.urls.urlUsedRes+'api/findUtilisateurs';
    urlOne = this.urls.urlUsedRes+'api/findUtilisateur';
    urlOneByEmail = this.urls.urlUsedRes+'api/findUtilisateurByEmail';
    resourceCheckEmailUrl = this.urls.urlUsedRes+'api/checkUtilisateurByEmail';
    urlCreate = this.urls.urlUsedRes+'api/createUtilisateur';
    urlUpdate = this.urls.urlUsedRes+'api/updateUtilisateur';
    urlReInitPass = this.urls.urlUsedRes+'api/updatePassword';
    urlUpdatePhoto = this.urls.urlUsedRes+'api/updateUtilisateurPhoto';
    urlUpdateFonction = this.urls.urlUsedRes+'api/updateUtilisateurFonction';
    urlDelete = this.urls.urlUsedRes+'';
    fileUrl = this.urls.urlUsedResIm;
    // fileUrl = this.urls.urlUsedRes+'api/findPath/';
    urlMailRappelT = this.urls.urlUsedRes+'api/rappelFinT';
    urlMailRappelEval = this.urls.urlUsedRes+'api/rappelEvalT';
    urlMailSos = this.urls.urlUsedRes+'api/mailSos';
    urlMailNotif = this.urls.urlUsedRes+'api/mailNotif';


    utilisateurs: Array<UtilisateurDto> = [];
    // [{nom: 'OUEDRAGO',prenom: 'Armelle',email:'armelo@mail',password:'123456',tel:'76341287'}];
    // [{nom: '',prenom: '',email:'',password:'',tel:''}];

    constructor(
        private storage: Storage,
        private http: HttpClient,
        private authService: AuthenticationService,
        private urls: Urls
    ) { }

    /* ======================= Adding ==================== */
    create(u: UtilisateurDto) { // : Observable<Utilisateur> {
        // console.log(u);
        // u.cnib = u.cnibR+'-'+u.cnibV;

        // u.cnib = this.concatFile(u.cnibR, u.cnibV, u.cnibT);
        u.cnib = u.cnibR;
        const copy = this.convert(u);
        // console.log(copy);
        return this.http.post<UtilisateurDto>(this.urlCreate, copy, {observe: 'response'}); // , {headers:this.authService.getHeader()});
        /*this.utilisateurs.push(u);
        this.storage.set('utilisateurs', this.utilisateurs);*/
    }

    /* ======================= Updating photo ==================== */
    updateFonction(u:UtilisateurDto): Observable<UtilisateurDto> {
        /*if(u.cnibR && u.cnibV && u.cnibT)
            u.cnib = this.concatFile(u.cnibR, u.cnibV, u.cnibT);*/
        if(u.cnibR != null)
            u.cnib = u.cnibR;
        const copy = this.convert(u);
        return this.http.post<UtilisateurDto>(this.urlUpdateFonction, copy, {headers:this.authService.getHeader()});
    }


    /* ======================= Updating photo ==================== */
    updatePhoto(u:UtilisateurDto): Observable<UtilisateurDto> {
        /*if(u.cnibR && u.cnibV && u.cnibT)
            u.cnib = this.concatFile(u.cnibR, u.cnibV, u.cnibT);*/
        if(u.cnibR != null)
            u.cnib = u.cnibR;
        const copy = this.convert(u);
        return this.http.post<UtilisateurDto>(this.urlUpdatePhoto, copy, {headers:this.authService.getHeader()});
    }


    /* ======================= Updating ==================== */
    update(u:UtilisateurDto): Observable<HttpResponse<UtilisateurDto>> {
        /*if(u.cnibR && u.cnibV && u.cnibT)
            u.cnib = this.concatFile(u.cnibR, u.cnibV, u.cnibT);*/
        if(u.cnibR != null)
            u.cnib = u.cnibR;
        const copy = this.convert(u);
        return this.http.post<UtilisateurDto>(this.urlUpdate, copy, {headers:this.authService.getHeader(), observe:'response'});
    }

    /* ======================= Re-Initialize password ==================== */
    updatePassword(u:UtilisateurDto): Observable<UtilisateurDto> {
        /*if(u.cnibR && u.cnibV && u.cnibT)
            u.cnib = this.concatFile(u.cnibR, u.cnibV, u.cnibT);*/
        if(u.cnibR != null)
            u.cnib = u.cnibR;
        const copy = this.convert(u);
        return this.http.post<UtilisateurDto>(this.urlReInitPass, copy); //permis à tous
    }

    /* ======================= Getting one ==================== */
    getOne(id: number): Observable<UtilisateurDto> {
        return this.http.post<UtilisateurDto>(this.urlOne, +id, {headers:this.authService.getHeader()});
    }

    /* ======================= Getting one By email ==================== */
    getOneByEmail(e: string): Observable<UtilisateurDto> {
        return this.http.post<UtilisateurDto>(this.urlOneByEmail, e, {headers:this.authService.getHeader()});
    }

    /*sendRappel(email: string) {
        return this.http.post(this.urlMailRappelEval, email, {headers:this.authService.getHeader()});
    }*/

    checkEmail(name: string) {
        return this.http.post(`${this.resourceCheckEmailUrl}`, name, {observe: 'response'});
    }

    /* ======================= Reading ==================== */
    getAll() {
        return this.http.get<UtilisateurDto>(this.urlAll); // , {headers:this.authService.getHeader()});
        /*return this.storage.get('utilisateurs').then(data => {
            this.users = data!=null?data:[]; // si le localStorage est vide, on retourne un tableau vide
            return this.utilisateurs;
        })*/
    }

    /* ======================= Deleting ==================== */
    delete(id:number): Observable<UtilisateurDto> {
        return this.http.post<UtilisateurDto>(this.urlDelete, +id, {headers:this.authService.getHeader()});
    }

    /******************** Rappel de fin de trajet ******************/
    finalise(id:number): Observable<UtilisateurDto> {
        return this.http.post<UtilisateurDto>(this.urlMailRappelT, +id, {headers:this.authService.getHeader()});
    }

    sendSos(position: string) {
        return this.http.post(this.urlMailSos, position, {headers:this.authService.getHeader()});
    }

    sendNotif() {
        return this.http.post(this.urlMailNotif, {observe: 'response'});
    }

    /* ======================= Converting ====================== */
    private convert(u: UtilisateurDto): UtilisateurDto {
        const copy: UtilisateurDto = Object.assign({}, u);
        return copy;
    }

    /* ====================== Pour charger les données ==================== */
    private dataUpdatedEvent: Subject<any> = new Subject();

    emitDataUpdatedEvent() {
        this.dataUpdatedEvent.next();
    }

    getDataUpdatedEvent$(): Observable<boolean> {
        return this.dataUpdatedEvent.asObservable();
    }

    /* =============================== Concat strings(photo, cnib...) ========================= */
    private concatFile(s1: string, s2: string, s3: string) {
        let sResult: string = null;
        if(s3 != null) {
            return sResult = s1.concat('-', s2, '-', s3);
        } else {
            return sResult = s1.concat('-', s2);
        }
    }

    /* =============================== Substring strings(photo, cnib...) ========================= */
    private substringFile(s: string) {
        let sResult: string = null;
        if(s != null) {
            var photoRecto = s.split(',')[0];
            var photoVerso = s.split(',')[1];
            var photoWCnib = s.split(',')[s.split(',').length-1];
        }
    }

    /************* Calculate years between two dates **************/
    getDaysBetwDates(s1, s2) {
        const firstDate = new Date(s2);
        const secondDate = new Date(s1);
        const milli = 365 * 24 * 60 * 60 * 1000;
        const diffDays = Math.floor(Math.abs((s1 - s2) / milli));
        // console.log(diffDays);
        return diffDays
    }

    getDaysBetDates(s1, s2) {
        // console.log(diffDays);
        const diff = Math.abs(s1 - s2);
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        return diffDays
    }

    /*********** Calculate months between two dates ************/
    getMonthsBetwDates(s1, s2) {
        /*const milli = 24 * 60 * 60 * 1000;
        const diffDays = Math.floor(Math.abs((s1 - s2) / milli));
        return diffDays*/

        var diff =(s1 - s2) / 1000;
        diff /= (60 * 60 * 24 * 7 * 4);
        return Math.abs(Math.round(diff));
    }

    /* ========================== Uploading file =============== */
    //create blob file for dataURI
    /*dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'image/jpeg' });
        return blob;
    }*/

    //pour charger la photo
    /*upload(imageData){
        let  url = 'your REST API url';
        const date = new Date().valueOf();

        // Replace extension according to your media type
        const imageName = date+ '.jpeg';
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(imageData);
        const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' })

        let  postData = new FormData();
        postData.append('file', imageFile);

        return postData;
        let data:Observable<any> = this.http.post(url,postData);
        data.subscribe((result) => {
            console.log(result);
        });
    }*/

}
