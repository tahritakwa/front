import {Component} from '@angular/core';
import {DetailOperationConstant} from '../../../constant/manufuctoring/detailOperation.constant';
import {Subscription} from 'rxjs/Subscription';
import {OperationService} from '../../service/operation.service';
import {DetailOperationService} from '../../service/detail-operation.service';
import {FabricationArrangementService} from '../../service/fabrication-arrangement.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-detail-operation-card',
  templateUrl: './detail-operation-card.component.html',
  styleUrls: ['./detail-operation-card.component.scss']
})
export class DetailOperationCardComponent {
  private subscription$: Subscription;
  idFabricationArrangement: number;
  detailOperation: any;
  readonly NOT_LANCED = DetailOperationConstant.STATUS_OPERATION_NOT_LANCED;
  readonly IN_PROGRESS = DetailOperationConstant.STATUS_OPERATION_IN_PROGRESS;
  readonly PAUSED = DetailOperationConstant.STATUS_OPERATION_PAUSED;
  readonly RESUMED = DetailOperationConstant.STATUS_OPERATION_RESUMED;
  readonly FINISHED = DetailOperationConstant.STATUS_OPERATION_FINISHED;

  constructor(
    private operationService: OperationService,
    private fabricationArrangementService: FabricationArrangementService,
    private detailOperationService: DetailOperationService,
    private router: Router) {
  }

  changeStatusDetailOperationAndRefreshPage(idOperation: any, newStatus: any) {
    this.changeStatusDetailOperation(idOperation, newStatus)
      .then(response => this.router.
      navigate([DetailOperationConstant.DETAIL_OPERATION_COMPONENT_URL + '/' + this.idFabricationArrangement]));
  }

  changeStatusDetailOperation(idOperation: any, newStatus: any) {
    return new Promise((resolve, reject) => {
      this.fabricationArrangementService.getJavaGenericService()
        .getEntityList(DetailOperationConstant.CHANGER_OPERATION +
          `?idOperation=${idOperation}&idFabrication=${this.idFabricationArrangement}&status=${newStatus}`)
        .subscribe(data => {
          resolve(data);
        });

    });
  }

  /*get description for current status*/
  getStatusDescription(status) {
    let description: string;
    switch (status) {
      case DetailOperationConstant.STATUS_OPERATION_NOT_LANCED: {
        description = DetailOperationConstant.DESCRIPTION_STATUS_OPERATION_NOT_LANCED;
        break;
      }
      case DetailOperationConstant.STATUS_OPERATION_IN_PROGRESS: {
        description = DetailOperationConstant.DESCRIPTION_STATUS_OPERATION_IN_PROGRESS;

        break;
      }
      case DetailOperationConstant.STATUS_OPERATION_PAUSED: {
        description = DetailOperationConstant.DESCRIPTION_STATUS_OPERATION_PAUSED;
        break;
      }
      case DetailOperationConstant.STATUS_OPERATION_RESUMED: {
        description = DetailOperationConstant.DESCRIPTION_STATUS_OPERATION_IN_PROGRESS;
        break;
      }
      case DetailOperationConstant.STATUS_OPERATION_FINISHED: {
        description = DetailOperationConstant.DESCRIPTION_STATUS_OPERATION_FINISHED;
        break;
      }
      default: {
        break;
      }
    }
    return description;
  }


}
