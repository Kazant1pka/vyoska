import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ShowService } from 'src/app/services/show.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(public auth: AuthService, public scs:ShowService, private router: Router) {
    
  }
  public articles = [];
  ngOnInit() {
  }

  getName(name: string){
    this.scs.nameIns = name;
    this.router.navigate(['/institutions']);
  }

  getArticles(){
    this.scs.getCreatorArticle(this.auth.currentUser.username).subscribe(val=>{
      this.articles = val['data'];
      console.log('safasf' +this.articles)
    })
  }

  update(){
    this.auth.updateUser(this.auth.currentUser.username, this.auth.currentUser.email).subscribe(val=>{
      console.log(val)
    })
    alert('Данные обновлены')
    this.router.navigate['/profile']
  }

  set(s: string) {
    localStorage.setItem('company', s)
    // this.scs.selectArticle(s).subscribe(val => {
    //   console.log(val)
    // })
  }

  setCom(s: any){
    localStorage.setItem('company', s)
    console.log(s)
  }

  delArticle(s:any){
    this.scs.delArticle(s).subscribe(val=>{
      console.log(val)
    })
    console.log(s)
  }
}
