import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ArticleComponent } from './pages/company/article.component';
import { MainComponent } from './pages/main/main.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateArticleComponent } from './pages/create-article/create-article.component';
import { ShowArticleComponent } from './components/show-article/show-article.component';
import { CommentsComponent } from './pages/company/comments/comments.component';
import { NewsComponent } from './pages/company/news/news.component';
import { RatingDirective } from './directives/rating.directive';
import { RatingComponent } from './components/rating/rating.component';
import { EditArticleComponent } from './pages/edit-article/edit-article.component';
import { SafePipe } from './pipes/safe.pipe';
import { Company } from './models/company.model';
import { AngularMarkdownEditorModule } from 'angular-markdown-editor'; 
import { MarkdownModule } from 'ngx-markdown';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule, AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatSlideToggleModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { InstitutionsComponent } from './pages/institutions/institutions.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ProfileComponent,
    ArticleComponent,
    MainComponent,
    SignupComponent,
    CreateArticleComponent,
    ShowArticleComponent,
    CommentsComponent,
    NewsComponent,
    RatingDirective,
    RatingComponent,
    EditArticleComponent,
    SafePipe,
    InstitutionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    AngularMarkdownEditorModule.forRoot({ iconlibrary: 'fa' }),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyB9PjUFtzBMlNJbajUkSEpKqPriRJ5JHFo",
      authDomain: "vyoska-edb30.firebaseapp.com",
      databaseURL: "https://vyoska-edb30.firebaseio.com",
      projectId: "vyoska-edb30",
      storageBucket: "vyoska-edb30.appspot.com",
      messagingSenderId: "351767090078",
      appId: "1:351767090078:web:ec49a72cc14c68feaebc8f"
    }),
    AngularFireStorageModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatSlideToggleModule,
    NgxLoadingModule.forRoot({})
  ],
  providers: [ShowArticleComponent, ArticleComponent, ProfileComponent, Company, CreateArticleComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
