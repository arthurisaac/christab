import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'utilisateur',
    loadChildren: () => import('./utilisateur/utilisateur.module').then(m => m.UtilisateurPageModule)
  },
  {
    path: 'utilisateur/:id',
    loadChildren: () => import('./utilisateur/utilisateur.module').then(m => m.UtilisateurPageModule)
  },
  {
    path: 'engin',
    loadChildren: () => import('./engin/engin.module').then( m => m.EnginPageModule)
  },
  {
    path: 'engin/:a',
    loadChildren: () => import('./engin/engin.module').then( m => m.EnginPageModule)
  },
  {
    path: 'engin/:a/:d',
    loadChildren: () => import('./engin/engin.module').then( m => m.EnginPageModule)
  },
  {
    path: 'itineraire',
    loadChildren: () => import('./itineraire/itineraire.module').then(m => m.TrajetPageModule)
  },
  {
      path: 'itineraire/:a',
      loadChildren: () => import('./itineraire/itineraire.module').then(m => m.TrajetPageModule)
    },
  {
    path: 'reservation',
    loadChildren: () => import('./reservation/reservation.module').then( m => m.ReservationPageModule)
  },
  {
    path: 'reservation/:d',
    loadChildren: () => import('./reservation/reservation.module').then( m => m.ReservationPageModule)
  },
  {
    path: 'detail-trajet',
    loadChildren: () => import('./detail-trajet/detail-trajet.module').then(m => m.DetailUrbainPageModule)
  },
  {
      path: 'detail-urbain/:a',
      loadChildren: () => import('./detail-trajet/detail-trajet.module').then(m => m.DetailUrbainPageModule)
    },
  {
    path: 'type-fonction',
    loadChildren: () => import('./type-fonction/type-fonction.module').then( m => m.TypeFonctionPageModule)
  },
  {
    path: 'alerte',
    loadChildren: () => import('./alerte/alerte.module').then( m => m.AlertePageModule)
  },
  {
    path: 'annonce',
    loadChildren: () => import('./annonce/annonce.module').then( m => m.AnnoncePageModule)
  },
  {
    path: 'annonce/:id',
    loadChildren: () => import('./annonce/annonce.module').then( m => m.AnnoncePageModule)
  },
  {
    path: 'annonce/:a/:d',
    loadChildren: () => import('./annonce/annonce.module').then( m => m.AnnoncePageModule)
  },
  {
    path: 'avis',
    loadChildren: () => import('./avis/avis.module').then( m => m.AvisPageModule)
  },
  {
    path: 'avis/:data',
    loadChildren: () => import('./avis/avis.module').then( m => m.AvisPageModule)
  },
  {
    path: 'demande',
    loadChildren: () => import('./demande/demande.module').then(m => m.DemandePageModule)
  },
  {
    path: 'demande/:id',
    loadChildren: () => import('./demande/demande.module').then(m => m.DemandePageModule)
  },
  {
    path: 'demande/:id/:d',
    loadChildren: () => import('./demande/demande.module').then(m => m.DemandePageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule)
  },
  {
    path: 'recherche',
    loadChildren: () => import('./recherche/recherche.module').then( m => m.RecherchePageModule)
  },
  {
    path: 'recherche/:a/:d',
    loadChildren: () => import('./recherche/recherche.module').then( m => m.RecherchePageModule)
  },
  {
    path: 'trajet-carte',
    loadChildren: () => import('./trajet-carte/trajet-carte.module').then( m => m.TrajetCartePageModule)
  },
  {
    path: 'paiement',
    loadChildren: () => import('./paiement/paiement.module').then( m => m.PaiementPageModule)
  },
  {
    path: 'informations-supplementaires',
    loadChildren: () => import('./informations-supplementaires/informations-supplementaires.module').then( m => m.InformationsSupplementairesPageModule)
  },
  {
    path: 'informations-supplementaires/:d',
    loadChildren: () => import('./informations-supplementaires/informations-supplementaires.module').then( m => m.InformationsSupplementairesPageModule)
  },
  {
    path: 'informations-conducteur',
    loadChildren: () => import('./informations-conducteur/informations-conducteur.module').then( m => m.InformationsConducteurPageModule)
  },
  {
    path: 'informations-conducteur/:d',
    loadChildren: () => import('./informations-conducteur/informations-conducteur.module').then( m => m.InformationsConducteurPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'facturation',
    loadChildren: () => import('./facturation/facturation.module').then( m => m.FacturationPageModule)
  },
  {
    path: 'trajet',
    loadChildren: () => import('./trajet/trajet.module').then( m => m.TrajetPageModule)
  },
  /*{
    path: 'trajet-conducteur',
    loadChildren: () => import('./trajet/trajet.module').then( m => m.TrajetPageModule)
  },
  {
    path: 'trajet-passager',
    loadChildren: () => import('./trajet/trajet.module').then( m => m.TrajetPageModule)
  },*/
  {
    path: 'home-conducteur',
    loadChildren: () => import('./home-conducteur/home-conducteur.module').then( m => m.HomeConducteurPageModule)
  },
  {
    path: 'type-avis',
    loadChildren: () => import('./type-avis/type-avis.module').then( m => m.TypeAvisPageModule)
  },
  {
    path: 'trajet-passager',
    loadChildren: () => import('./trajet-passager/trajet-passager.module').then( m => m.TrajetPassagerPageModule)
  },
  {
    path: 'trajet-passager/:data',
    loadChildren: () => import('./trajet-passager/trajet-passager.module').then( m => m.TrajetPassagerPageModule)
  },
  {
    path: 'trajet-conducteur',
    loadChildren: () => import('./trajet-conducteur/trajet-conducteur.module').then( m => m.TrajetConducteurPageModule)
  },
  {
    path: 'trajet-conducteur/:data',
    loadChildren: () => import('./trajet-conducteur/trajet-conducteur.module').then( m => m.TrajetConducteurPageModule)
  },
  {
    path: 'demande-passager',
    loadChildren: () => import('./demande-passager/demande-passager.module').then( m => m.DemandePassagerPageModule)
  },
  {
    path: 'demande-passager/:a/:d',
    loadChildren: () => import('./demande-passager/demande-passager.module').then( m => m.DemandePassagerPageModule)
  },
  {
    path: 'decompte',
    loadChildren: () => import('./decompte/decompte.module').then( m => m.DecomptePageModule)
  },
  {
    path: 'renouvellement',
    loadChildren: () => import('./renouvellement/renouvellement.module').then( m => m.RenouvellementPageModule)
  },
  {
    path: 'renouvellement/:d',
    loadChildren: () => import('./renouvellement/renouvellement.module').then( m => m.RenouvellementPageModule)
  },
  {
    path: 'recherche-carte',
    loadChildren: () => import('./recherche-carte/recherche-carte.module').then( m => m.RechercheCartePageModule)
  },
  {
    path: 'recherche-carte/:d',
    loadChildren: () => import('./recherche-carte/recherche-carte.module').then( m => m.RechercheCartePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
