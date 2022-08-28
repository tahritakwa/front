import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DayPilotGanttComponent} from 'daypilot-pro-angular';
import {Subscription} from 'rxjs/Subscription';
import {DetailOperationService} from '../../service/detail-operation.service';
import {FabricationArrangementConstant} from '../../../constant/manufuctoring/fabricationArrangement.constant';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-fab-gantt-diagram',
  templateUrl: './fab-gantt-diagram.component.html',
  styleUrls: ['./fab-gantt-diagram.component.scss']
})
export class FabGanttDiagramComponent implements OnInit, OnDestroy {

  private subscription$: Subscription;
  @ViewChild('gantt')
  gantt: DayPilotGanttComponent;
  config: any = {
    timeHeaders: [
      { groupBy: 'Month', format: 'MMMM yyyy' },
      { groupBy: 'Day', format: 'd' }
    ],
    scale: 'Day',
    start: '2020-06-04',
    days: 60,
    tasks: [],
    links: [],
  };

  constructor(private detailOperationService: DetailOperationService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.subscription$ = this.detailOperationService.getJavaGenericService()
      .getEntityList('')
      .subscribe(detailOperations => {
        const fabs = [];
        this.extractUniqueFabsFromDetailOperation(detailOperations, fabs);
        this.prepareFabsWithDetailOperations(detailOperations, fabs);
        this.addFabToGanttDiagram(fabs);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  extractUniqueFabsFromDetailOperation(detailOperations, fabs) {
    detailOperations.forEach(detailOperation => {
      if (fabs.filter(e => e.id === detailOperation.fabricationArrangement.id).length <=  0) {
        fabs.push(detailOperation.fabricationArrangement);
      }
    });
  }

  prepareFabsWithDetailOperations(detailOperations, fabs) {
    fabs.forEach( fab => {
      fab.detailOperation = [];
      detailOperations.forEach(detailOperation => {
        if (detailOperation.fabricationArrangement.id === fab.id) {
          if (fab.detailOperation.filter(e => e.operation.id === detailOperation.operation.id).length <=  0) {
            fab.detailOperation.push(detailOperation);
          }
        }
      });
    });
  }

  addFabToGanttDiagram(fabs) {
    fabs.forEach(fab => {
      const fabGantt = {
        start:  fab.startDate,
        end:  fab.endDate,
        id: fab.id,
        text: fab.reference,
        complete: 0,
        children: []
      };
      fab.detailOperation.forEach (detailOperation => {
        const subElement = {
          start: detailOperation.startDate,
          end: detailOperation.finishDate,
          id: fab.id + '' + detailOperation.operation.id,
          text: detailOperation.operation.description,
          complete: 0,
        };
        fabGantt.children.push(subElement);
        detailOperation.operation.operationBeforeDtos.forEach( item => {
          const ganttLink = {
            from: fab.id + '' + item.id,
            to: fab.id + '' + detailOperation.operation.id,
            type: FabricationArrangementConstant.GANTT_LINK_FINISH_TO_START
          };
          this.config.links.push(ganttLink);
        });
      });
      this.config.tasks.push(fabGantt);
    });
  }

}
