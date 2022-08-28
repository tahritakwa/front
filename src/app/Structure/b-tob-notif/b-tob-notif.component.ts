import { Component, OnInit, OnDestroy } from '@angular/core';
import { BTobService } from './service/b-tob.service';
import 'rxjs/add/observable/interval';
import { Router } from '@angular/router';
import { DocumentConstant } from '../../constant/sales/document.constant';

@Component({
  selector: 'app-b-tob-notif',
  templateUrl: './b-tob-notif.component.html',
  styleUrls: ['./b-tob-notif.component.scss']
})
export class BTobNotifComponent implements OnInit, OnDestroy {


  constructor(private bTobService: BTobService, public route: Router) { }
  public countValue: number;
  public timer;
  ngOnInit() {
    this.bTobService.sendNotificationToUser.subscribe(x => {
      this.getOrderCount();
    });
    this.getOrderCount();
   // this.timer = setInterval(() => { this.getOrderCount(); }, 100000);
  }
  public getOrderCount() {
    this.countValue = 0;
    this.bTobService.getOrderCount().toPromise().then(async result => {
      if (result) {
        await new Promise(resolve => resolve(
          this.countValue = result.objectData
        ));
      }
    });
  }
  public redirectToList() {
    this.route.navigateByUrl('/' + DocumentConstant.SALES_ORDER_URL);
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
