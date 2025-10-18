import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    loadComponent: () => import('./components/photo-list/photo-list').then(c => c.PhotoList)
  },
  {
    path:'favorites',
    loadComponent: () => import('./components/favourites-list/favourites-list').then(c => c.FavouritesList)
  },
  {
    path:'photos/:id',
    loadComponent: () => import('./components/singe-page-photo/singe-page-photo').then(c => c.SingePagePhoto)
  },
];
