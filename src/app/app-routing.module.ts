import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'items/list', pathMatch: 'full' },
  { path: 'items/list', loadChildren: () => import('./items/list/list.module').then(m => m.ListPageModule) },
  { path: 'items/create', loadChildren: () => import('./items/create/create.module').then(m => m.CreatePageModule) },
  { path: 'items/edit/:id', loadChildren: () => import('./items/edit/edit.module').then(m => m.EditPageModule) },
  { path: 'items/details/:id', loadChildren: () => import('./items/details/details.module').then(m => m.DetailsPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }