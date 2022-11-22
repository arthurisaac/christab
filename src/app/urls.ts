import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class Urls {

    // public getAllUrls(){

        /*************** Air box adresse ip *************/
        public urlAirBoxRes = 'http://192.168.1.152:8082/';
    public urlAirBoxSec = 'http://192.168.1.152:8087/';
    public urlAirBoxPaie = 'http://192.168.1.152:8088/';

    /*************** Bafa adresse ip *************/
    public urlBafaRes = 'http://192.168.1.76:8082/';
    public urlBafaSec = 'http://192.168.1.76:8087/';
    public urlBafaPaie = 'http://192.168.1.76:8088/';
    public urlBafaSearch = 'http://192.168.1.76:8084/';
    public urlBafaAvis = 'http://192.168.1.76:8089/';

    /*public urlBafaRes = 'http://192.168.43.241:8082/';
    public urlBafaSec = 'http://192.168.43.241:8087/';
    public urlBafaPaie = 'http://192.168.43.241:8088/';*/

    /**************** home adresse ip ********/
    public urlHomeRes = 'http://192.168.43.241:8082';
    public urlHomeSec = 'http://192.168.43.241:8087';
    public urlHomePaie = 'http://192.168.43.241:8088';


        /*************** Adresse locale *************/
        public urlLocalRes = 'http://localhost:8082/';
    public urlLocalSec = 'http://localhost:8087/';
    public urlLocalPaie = 'http://localhost:8088/';


        /*************** Adresse du déploiement *************/
    public urlResT = 'https://christab.herokuapp.com/';
    public urlSecT = 'https://christabsecurity.herokuapp.com/';

    /*************** Adresse du déploiement définitif *************/
    public urlRes = 'https://christabres.ew.r.appspot.com/';
    public urlSec = 'https://christab-300818.ew.r.appspot.com/';
    public urlPaie = 'https://christabpaie.ew.r.appspot.com/';
    public urlSearch = 'https://christabsearch.ew.r.appspot.com/';
    public urlAvis = 'https://christabavis.ew.r.appspot.com/';
    public urlImg = 'https://christab.net/christaB_fichiers/'; // http://bafagroupe.com/christaB_fichiers/

    /*public urlRes = 'https://christabres.herokuapp.com/';
    public urlSec = 'https://christabsec.herokuapp.com/';
    public urlPaie = 'https://christabpaie.herokuapp.com/';
    public urlImg = 'http://bafagroupe.com/christaB_fichiers/';*/

    /************* Adresse ip utilisée *********/
    public urlUsedRes = this.urlRes;
    public urlUsedResIm = this.urlImg;
    public urlUsedSec = this.urlSec;
    public urlUsedPaie = this.urlPaie;
    public urlUsedSearch = this.urlSearch;
    public urlUsedAvis = this.urlAvis;

    /*public urlUsedRes = this.urlBafaRes;
    public urlUsedSec = this.urlBafaSec;
    public urlUsedPaie = this.urlBafaPaie;
    public urlUsedResIm = this.urlBafaRes+'api/findPath/';
    public urlUsedSearch = this.urlBafaSearch;
    public urlUsedAvis = this.urlBafaAvis;*/




    // }
}
