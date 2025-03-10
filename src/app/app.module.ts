import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { TemplateComponent } from './components/template/template.component';
import { HistoryComponent } from './components/history/history.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PopupComponent } from './components/popup/popup.component';
import { UserpopupComponent } from './components/userpopup/userpopup.component';
import { AdminComponent } from './components/admin/admin.component';

// Angular Material Imports
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider';

// Forms and HTTP
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

// Services
import { DashboardService } from './shared/services/dashboard.service';
import { EventService } from './shared/services/event.service';

// Other Modules
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    TemplateComponent,
    HistoryComponent,
    CalendarComponent,
    PopupComponent,
    UserpopupComponent,
    AdminComponent
  ],
  imports: [
    // Angular Core Modules
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    // Firebase Modules
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,

    // Angular Material Modules
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatTreeModule,

    // PrimeNG Modules
    DialogModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    TabViewModule,

    // Calendar Module
    FullCalendarModule,

    // Other Modules
    Ng2SearchPipeModule
  ],
  providers: [
    DashboardService,
    DatePipe,
    EventService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }