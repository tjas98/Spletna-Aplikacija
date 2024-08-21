import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  GoogleSigninButtonModule
} from '@abacritt/angularx-social-login';
import { LoginComponent } from './login/login.component';
import { PlaciloComponent } from './placilo/placilo.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UrnikDrugihComponent } from './urnik-drugih/urnik-drugih.component';
import { CelUrnikComponent } from './cel-urnik/cel-urnik.component';
import { GoogleComponent } from './google/google.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DialogComponent } from './dialog/dialog.component';


import {MatCardModule} from '@angular/material/card';

import { MatDialogModule } from '@angular/material/dialog';
import { ServiceWorkerModule, SwPush } from '@angular/service-worker';
import { UrnikDesktopComponent } from './urnik-desktop/urnik-desktop.component';

import {MatDatepickerModule} from '@angular/material/datepicker';

import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import {MatFormFieldModule} from '@angular/material/form-field';

import { DatumComponent } from './datum/datum.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

import {MatBadgeModule} from '@angular/material/badge';
import { NotificaComponent } from './notifica/notifica.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlaciloComponent,
    HomeComponent,
    UrnikDrugihComponent,
    CelUrnikComponent,
    GoogleComponent,
    NavbarComponent,
    DialogComponent,
    UrnikDesktopComponent,
    DatumComponent,
    NotificaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    HttpClientModule,
    MatDatepickerModule,
    SocialLoginModule,
    MatSlideToggleModule,
    FormsModule,
    MatNativeDateModule,
    MatInputModule,
    MatBadgeModule,
    GoogleSigninButtonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatListModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    GoogleSigninButtonModule,
    MatButtonModule,
    MatSidenavModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
    
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '384808632270-9uce77u7kr51do030dfu964av310q5s1.apps.googleusercontent.com',
              {
                oneTapEnabled:false, 
                prompt:'consent'
              }
            )
          },
         
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
