import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ShowService } from 'src/app/services/show.service';
import { MainComponent } from 'src/app/pages/main/main.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-article',
  templateUrl: './show-article.component.html',
  styleUrls: ['./show-article.component.scss']
})
export class ShowArticleComponent implements OnInit, OnDestroy {
  public companies: any[];
  idC: String = null
  progress: number 
  sub: Subscription
  constructor(private scs: ShowService, private mc: MainComponent) {

  }

  ngOnInit() {
    this.filtr()
  }

  getID(s: string) {
    console.log(s)
    this.scs.selectArticle(s).subscribe(val => {
      console.log(val)
    })
  }

  filtr() {
    if (this.mc.sub == '') {
      this.getCompany()
    } else {
      this.getCategoryCompany()
    }
  }

  getCompany() {
    this.sub = this.scs.getArticle().subscribe(result => {
      this.companies = result['data'];
    })
  }

  getCategoryCompany() {
    this.sub = this.scs.getCategoryArticle(this.mc.sub).subscribe(result => {
      this.companies = result['data'];
      console.log(this.companies)
    })
  }
  ngOnDestroy() {
  }
}
