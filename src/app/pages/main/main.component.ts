import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ShowArticleComponent } from 'src/app/components/show-article/show-article.component';
import { ShowService } from 'src/app/services/show.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  sub:string = ''
  private returnUrl: string;
  private subscriptions: Subscription[] = [];
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private scs: ShowService,
  ) {

  }
  ngOnInit() {
     
  } 

  getRating(){
    console.log('ssss')
    this.scs.getRatingArticle().subscribe(val=>{
      console.log(val)
    })
  }
  filter(s: string) {
    this.sub = s
    console.log(s)
  }
}