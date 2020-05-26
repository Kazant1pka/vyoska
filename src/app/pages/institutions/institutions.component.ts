import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ShowService } from 'src/app/services/show.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.scss']
})
export class InstitutionsComponent implements OnInit {
  constructor(public auth: AuthService, public scs:ShowService, private router: Router) {
    console.log(this.institution)
  }
  public institution = this.scs.currentInstitutions;
  public part = Object.keys(this.institution.part).length;
  ngOnInit() {    
  }
  update(){
    this.auth.updateUser(this.auth.currentUser.username, this.auth.currentUser.email).subscribe(val=>{
      console.log(val) 
    })
    alert('Данные обновлены')
    this.router.navigate['/profile']
  }
  setCom(s: any){
    localStorage.setItem('company', s)
    console.log(s)
  }

  delCompany(s:any){
    this.scs.delArticle(s).subscribe(val=>{
      console.log(val)
    })
    console.log(s)
  }
}
