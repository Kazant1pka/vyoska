import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from '../models/company.model';
import { AuthService } from './auth.service';
import { Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  sub: Subscription
  public articleId: string = null
  currentArticle: any = null
  currentInstitutions: any = null
  nameIns : string;
  

  constructor(private http: HttpClient, private auth: AuthService) {
      this.currentArticleUpdate()
      this.currentInstitutionUpdate()
  } 

  currentArticleUpdate(){
    if(localStorage.getItem('company')){
      this.selectArticle(localStorage.getItem('company')).subscribe(value=>{
        this.currentArticle = value[0]
      })
    }
  }
  currentInstitutionUpdate(){
    this.showInstitution("Полесский ГУ").subscribe(val=>{
      this.currentInstitutions = val['data'][0]
    })
  }
  
  showInstitution(nameUni: string){
    return this.http.post('/api/institution', {
      name: nameUni
    }) 
  }

  getArticle() {
    return this.http.post('/api/article/getArticle', {})
  }
  getRatingArticle() {
    return this.http.post('/api/article/getRatingArticle', {})
  }
  getCategoryArticle(s: string) {
    return this.http.post('/api/article/getCategoryArticle', {
      category: s
    }) 
  }
  getCreatorArticle(s: string) {
    return this.http.post('/api/article/getCreatorArticle', {
      creator: s
    }) 
  }
  selectArticle(s: string) {
    localStorage.setItem('company', s)
    this.articleId = s
    return this.http.post('api/article', {
      _id: s
    })
  }
  commentArticle(s: string) {
    return this.http.put('/api/article/addcomment', {
      _id: this.articleId,
      title: s,
      senderId: this.auth.currentUser._id,
      senderName: this.auth.currentUser.username,
      senderUrl: this.auth.currentUser.photoUrl,
      createdAt: new Date(Date.now())
    })
  }
  delNews(s: any){
    return this.http.post('/api/article/news/delete', {
      idN: this.articleId,
      _id: s
    })
  }
  delArticle(id: string){
    return this.http.post('/api/article/delete', {
      _id: id
    })
  }

  comments() {
    return this.http.post('/api/article/comments', {
      _id: this.articleId
    })
  }
  news() {
    return this.http.post('/api/article/news', {
      _id: this.articleId
    })
  }
  rating(s: number) {
    return this.http.post('/api/article/rating', {
      idC: this.articleId,
      mark: s
    })
  }
  delComent(s: number) {
    return this.http.put('/api/article/delComment', {
      //idx: this.companyId,
      _id: s
    })
  }
  likeCom(s: number){
    return this.http.post('/api/article/comment/like', {
      idx: this.articleId,
      _id: s
    })
  }
  dislikeCom(s: number){
    return this.http.post('/api/article/comment/dislike', {
      idx: this.articleId,
      _id: s
    })
  }
}