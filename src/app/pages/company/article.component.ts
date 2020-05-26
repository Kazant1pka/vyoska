import { Component, OnInit, OnDestroy} from '@angular/core';
import { ShowService } from 'src/app/services/show.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  article: any = this.scs.currentArticle
  avrat: any = 0
  progress: number

  constructor(private scs: ShowService, public auth: AuthService) {
    this.scs.currentArticleUpdate() 
  }
  ngOnInit() {
    this.scs.currentArticleUpdate()
    this.update()
  }

  update() {
    
    this.avrat = 0
    this.scs.selectArticle(this.scs.articleId).subscribe(value => {
      this.article = value[0];
      //this.avrat = (this.avrat / this.company.rating.length).toFixed(1);
    })
  }

  onRating(rating: number) {
    console.log(rating);
  }
  ngOnDestroy() {
  }
}
