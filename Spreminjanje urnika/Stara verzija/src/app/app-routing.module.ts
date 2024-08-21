import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpremembaComponent } from './components/sprememba/sprememba.component';
import { UrediUrnikComponent } from './components/uredi-urnik/uredi-urnik.component';
import { LoginComponent } from './components/login/login.component';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "sprememba",
    component: SpremembaComponent
  },
  {
    path: "urejanje",
    component: UrediUrnikComponent
  },
  {
    path: "login", 
    component: LoginComponent
  },
  {
    path: "auth",
    component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
