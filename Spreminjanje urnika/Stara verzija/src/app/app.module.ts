import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { MatMenuModule } from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatBadgeModule} from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';

import { SpremembaComponent } from './components/sprememba/sprememba.component';


import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PotrdiComponent } from './components/potrdi/potrdi.component';
import { IzletComponent } from './components/izlet/izlet.component';
import { ZamenjavaComponent } from './components/zamenjava/zamenjava.component';
import { OknoSpremembaComponent } from './components/okno-sprememba/okno-sprememba.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { UrediUrnikComponent } from './components/uredi-urnik/uredi-urnik.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import { LoginComponent } from './components/login/login.component';

import {GoogleLoginProvider,FacebookLoginProvider,GoogleSigninButtonModule,
        SocialLoginModule, SocialAuthServiceConfig,
        GoogleInitOptions} from '@abacritt/angularx-social-login';
import { ServiceWorkerModule } from '@angular/service-worker';

import {MatDatepickerModule} from '@angular/material/datepicker';

import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthComponent } from './components/auth/auth.component';
import {MatTableModule} from '@angular/material/table';

import { ProstoPipe } from './pipes/prosto.pipe';




const googleLoginOptions: GoogleInitOptions = {
  oneTapEnabled: false,
  scopes: 'https://www.googleapis.com/auth/calendar.readonly'
}

@NgModule({ declarations: [
        AppComponent,
        NavbarComponent,
        SpremembaComponent,
        PotrdiComponent,
        IzletComponent,
        ZamenjavaComponent,
        OknoSpremembaComponent,
        UrediUrnikComponent,
        LoginComponent,
        AuthComponent,
        ProstoPipe
    ],
    bootstrap: [AppComponent], imports: [MatTableModule,
        BrowserModule,
        MatProgressSpinnerModule,
        AppRoutingModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatButtonToggleModule,
        MatInputModule,
        MatTabsModule,
        MatBadgeModule,
        MatGridListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgSelectModule,
        FormsModule,
        MatTooltipModule,
        MatExpansionModule,
        MatCardModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatChipsModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        GoogleSigninButtonModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [{
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider('384808632270-9uce77u7kr51do030dfu964av310q5s1.apps.googleusercontent.com', googleLoginOptions)
                    }
                ],
                onError: (err) => {
                    console.error(err);
                }
            } as SocialAuthServiceConfig,
        }, provideAnimationsAsync(), provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
