import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, Form } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Company } from '../../models/company.model';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage} from 'angularfire2/storage';
import { ShowService } from 'src/app/services/show.service';
import { AngularMarkdownEditorModule } from 'angular-markdown-editor';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit, OnDestroy {

  public createArticle: FormGroup;
  private subscriptions: Subscription[] = [];
  public article: Company
  imgArr = this.ss.imgArr;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private ss: ShowService
  ) {
    this.article = new Company; 
  }
  onChange(e) { 
    console.log(e.getContent()); 
   }
  ngOnInit() {
    
    this.createArticle = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ]),
      category: new FormControl(null, [
        Validators.required,
      ]),
      tag: new FormControl(null, [
        Validators.required,
      ])
    })
  }
  validateCreate() {
    this.article = this.createArticle.value
    this.article.tag = this.createArticle.value.tag.split(', ');
    if (this.article.title && this.article.category && this.article.description && this.article.tag) {
      this.create(this.article).subscribe(res => { 
        console.log('response is ', res)
        if (res['status'] === 'success') {
          this.router.navigate(['/main']);
          alert('Статья отправлена на модерацию')
        } else {
          alert('Данные введены неверно');
        }
      });
    } else {
      alert('Данные введены неверно');
    }
    console.log(this.article)
  }

  create(article: Company) {
    return this.http.post('/api/article/create', {
      _id: this.auth.currentUser._id,
      title: article.title,
      description: article.description,
      category: article.category,
      tag: article.tag
    })
  };

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
