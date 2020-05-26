import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Company } from 'src/app/models/company.model';
import { ArticleComponent } from '../company/article.component';
import { Subscription } from 'rxjs';
import { ShowService } from 'src/app/services/show.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit, OnDestroy {

  public editArticleForm: FormGroup;
  public article: any = this.scs.currentArticle;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private com: ArticleComponent,
    private scs: ShowService
  ) {
    this.scs.currentArticleUpdate() 
    this.com.article = this.scs.currentArticle
    this.article = this.scs.currentArticle

  }
  ngOnInit() {
    console.log(this.article, 'edit')
    this.editArticleForm = new FormGroup({
      title: new FormControl(this.article.title, [
        Validators.required,
        Validators.minLength(3)
      ]),
      description: new FormControl(this.article.description, [
      ]),
      category: new FormControl(this.article.category, [
        Validators.required,
      ]),
      tag: new FormControl(this.article.tag, [
        Validators.required,
      ])
    })
  }

  validateEdit() { 
    this.article = this.editArticleForm.value
    if (this.article.name && this.article.category && this.article.description && this.article.tag) {
      this.edit(this.article).subscribe(res => {
        console.log('response is ', res)
      });
    } else {
      alert('Произошла ошибка');
    }
    console.log(this.article)
  }


  edit(article: Company) {
    return this.http.post('/api/article/edit', {
      _id: localStorage.getItem('company'),
      title: article.title,
      description: article.description,
      category: article.category,
      tag: article.tag,
    })
  }

  delArticle(article: string){
    this.scs.delArticle(article).subscribe();
    alert("Статья удалена");
  }

  ngOnDestroy() {
    this.article = null
    this.editArticleForm.reset()
  }
}
