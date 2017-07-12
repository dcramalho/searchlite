import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AngularFireModule } from 'angularfire2';

// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


import { MdButtonModule, MdSelectModule, MdInputModule, MdCardModule, MdToolbarModule, MdIconModule, MdListModule, MdChipsModule } from '@angular/material';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchService } from './search.service';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';


import {MdMenuModule} from '@angular/material';
import { RouterModule, Routes }   from '@angular/router';
import { AccountInfoComponent } from './account-info/account-info.component';
import { HomeComponent } from './home/home.component';
import {MdSnackBarModule} from '@angular/material';
import { SnackbarComponent } from './snackbar/snackbar.component';
import {MdTabsModule} from '@angular/material';
import {MdSlideToggleModule} from '@angular/material';
import {MdSliderModule} from '@angular/material';
import {MdCheckboxModule} from '@angular/material';
import {MdSidenavModule} from '@angular/material';
import {MdProgressSpinnerModule} from '@angular/material';
import {MdProgressBarModule} from '@angular/material';
import {MdRadioModule} from '@angular/material';

export const firebaseConfig = {
      apiKey: "AIzaSyC_prsCo9-6x8CXsUrjo8HGGNbH4LBZ0mI",
    authDomain: "redl-ea2e1.firebaseapp.com",
    databaseURL: "https://redl-ea2e1.firebaseio.com",
    projectId: "redl-ea2e1",
    storageBucket: "redl-ea2e1.appspot.com",
    messagingSenderId: "610773223584"
};

@NgModule({
  declarations: [
    AppComponent,
    AccountInfoComponent,
    HomeComponent,
    SnackbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    
    
    MdInputModule,


    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    MdButtonModule,
    MdCardModule,
    MdToolbarModule,
    MdIconModule,
    FlexLayoutModule,
    MdSelectModule,
    MdListModule,
    MdChipsModule,
    MdMenuModule,
    MdSnackBarModule,
    MdTabsModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdCheckboxModule,
    MdSidenavModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MdRadioModule,
    RouterModule.forRoot([
      {
        path: 'account',
        component: AccountInfoComponent
      },
      {
        path:'',
        component: HomeComponent
      },
      
    ])
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
