import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DeadLineDocumentService } from '../../../../sales/services/dead-line-document/dead-line-document.service';

@Component({
  selector: 'app-cash-register-balance-section',
  templateUrl: './cash-register-balance-section.component.html',
  styleUrls: ['./cash-register-balance-section.component.scss']
})
export class CashRegisterBalanceSectionComponent implements OnInit {

  @ViewChild('canvasBalanceLineChart', { read: ElementRef }) public canvasBalanceLineChart: ElementRef;

  lineChartData: any[] = [
    {
      data: [85, 72, 78, 62, 77, 75, 55, 75, 80, 67, 80, 82], label: 'Caisse de recette'
    },
    {
      data: [65, 50, 80, 70, 67, 55, 63, 50, 70, 70, 67, 75], label: 'Caisse de dépense'
    }
  ];


  lineChartLabels: any[] = ['Janvier', 'Février', 'Marse', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  lineChartOptions = {
    responsive: true,
  };

  lineChartColors = [
    {
      borderColor: '#c9e1e3',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    {
      borderColor: '#fbaeae',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    }
  ];

  lineChartLegend = true;
  lineChartType = 'line';

 
  startDate: Date;
  endDate: Date;
  constructor(public elementRef: ElementRef, public deadLineDocumentService: DeadLineDocumentService) { }

  ngOnInit() {
    this.initBalanceLineChart();
  }

  initBalanceLineChart() {
  }

  doSearch() {

  }
}
