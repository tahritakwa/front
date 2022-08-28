import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentRequest } from '../../../models/payroll/document-request.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentRequestService } from '../../services/document-request/document-request.service';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { DocumentRequestConstant } from '../../../constant/payroll/document-request.constant';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-validate-document-details',
  templateUrl: './validate-document-details.component.html',
  styleUrls: ['./validate-document-details.component.scss']
})
export class ValidateDocumentDetailsComponent implements OnInit, OnDestroy {
  public Documents: number[] = [];
  public listOfDocuments: DocumentRequest [];
  public UserPicture: any;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  public companyCurrency;
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
    };

    private subscriptions: Subscription[] = [];
  constructor(private dataRoute: ActivatedRoute, private translate: TranslateService, private documentRequestService: DocumentRequestService, private router: Router) {
    this.Documents = this.dataRoute.snapshot.queryParams[UserConstant.LIST_ID];
  }

  ngOnInit() {
    this.getDocumentsFromListId();
  }

  getDocumentsFromListId() {
    this.subscriptions.push(this.documentRequestService.getDocumentsFromListId(this.Documents).subscribe(result => {
      this.listOfDocuments = result;
    }));
  }

  deleteUserFromListUsersId(id: number) {
    this.listOfDocuments = this.listOfDocuments.filter(item => item.Id !== id);
  }

  validateMassiveDocuments(listOfDocuments: DocumentRequest []) {
    this.subscriptions.push(this.documentRequestService.validateMassiveDocuments(listOfDocuments).subscribe(() => {
        this.router.navigateByUrl(DocumentRequestConstant.DOCUMENTS);
      }
    ));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
