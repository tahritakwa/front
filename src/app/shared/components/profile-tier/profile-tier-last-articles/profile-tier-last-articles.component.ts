import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiersService } from '../../../../purchase/services/tiers/tiers.service';

const PURCHASE_DELIVERY_FORM_URL = '/main/purchase/delivery/show/';
const SALES_DELIVERY_FORM_URL = '/main/sales/delivery/show/';

@Component({
  selector: 'app-profile-tier-last-articles',
  templateUrl: './profile-tier-last-articles.component.html',
  styleUrls: ['./profile-tier-last-articles.component.scss']
})
export class ProfileTierLastArticlesComponent implements OnInit {

  @Input() tier;
  public listArticles;
  public document;
  total: number;
  documentUrl;
  constructor(public tiersService: TiersService, private router: Router) { }
  ngOnInit() {
    this.documentUrl = this.tier.IdTypeTiers === 1 ? SALES_DELIVERY_FORM_URL : PURCHASE_DELIVERY_FORM_URL;
    this.getLastArticles(this.tier);
  }
  getLastArticles(tier) {
    this.tiersService.getlastArticles(tier).subscribe(data => {
      this.document = data;
      this.listArticles = data.items;
      if (this.listArticles) {
        this.listArticles.forEach(Article => {
          Article.price = this.formattoCurrency(Article.UnitHtpurchasePrice);
        }
        );
      }
      this.total = data.totalItems - 4;
    });
  }
  formattoCurrency(value = 0) {
    const valueFormatted = value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: this.tier.IdCurrencyNavigation.Code,
      minimumFractionDigits: this.tier.IdCurrencyNavigation.Precision
    });
    return valueFormatted;
  }

  goToDocument() {
    this.router.navigateByUrl(this.documentUrl + this.document.Id + '/' + this.document.DocumentStatus);
  }
}
