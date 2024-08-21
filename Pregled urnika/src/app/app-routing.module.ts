import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlaciloComponent } from './placilo/placilo.component';
import { HomeComponent } from './home/home.component';
import { GoogleComponent } from './google/google.component';
import { CelUrnikComponent } from './cel-urnik/cel-urnik.component';
import { UrnikDrugihComponent } from './urnik-drugih/urnik-drugih.component';
import { UrnikDesktopComponent } from './urnik-desktop/urnik-desktop.component';
import { DatumComponent } from './datum/datum.component';
import { NotificaComponent } from './notifica/notifica.component';

const routes: Routes = [
   
  
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: "home", 
    component: HomeComponent
  },
  {
    path: "celUrnik",
    component: CelUrnikComponent
  },
  {
    path: "urnik",
    component: UrnikDrugihComponent
  },
  {
    path: "desk",
    component: UrnikDesktopComponent
  },
  {
    path: "datum",
    component: DatumComponent
  },
  {
    path: "obvestilo",
    component: NotificaComponent
  },
  {
    path: "google",
    component: GoogleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
