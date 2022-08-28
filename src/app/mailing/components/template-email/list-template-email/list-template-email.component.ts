import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { PagerSettings} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {MailingConstant} from '../../../../constant/mailing/mailing.constant';
import {TemplateEmailService} from '../../../services/template-email/template-email.service';
import {TooltipDirective} from '@progress/kendo-angular-tooltip';
import {TemplateEmail} from '../../../../models/mailing/template-email';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TemplateEmailSideNavService} from '../../../services/template-email-side-nav/template-email-side-nav.service';

@Component({
  selector: 'app-list-template-email',
  templateUrl: './list-template-email.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./list-template-email.component.scss']
})
export class ListTemplateEmailComponent implements OnInit {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @Input() source: string;


  private _templateEmail: string;
  filteredTemplate: TemplateEmail[];
  filteredData: TemplateEmail[] = [];
  public templateToShowInSideNav ;
  public showDetailTemplate = false;

  get templateEmail(): string {
   return  this._templateEmail;
 }
 set templateEmail(targetvalue) {
   this._templateEmail = targetvalue;
 }
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };
  private pageSize = NumberConstant.TEN;
  public columnsConfig: ColumnSettings[] = [
    {
      field: MailingConstant.SUBJECT_FIELD,
      title: MailingConstant.SUBJECT_TITLE,
      filterable: true
    },
    {
      field: MailingConstant.NAME_FIELD,
      title: MailingConstant.NAME_TITLE,
      filterable: true
    },
    {
      field: MailingConstant.BODY_FIELD,
      title: MailingConstant.BODY_TITLE,
      filterable: true
    }
  ];
  public gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  constructor( private templateEmailService: TemplateEmailService, private swalWarring: SwalWarring, private translate: TranslateService,
               private growlService: GrowlService, private templateEmailSideNavService: TemplateEmailSideNavService) {
  }
  ngOnInit() {
    this.getTemplateEmails( this.gridSettings.state.skip / NumberConstant.TEN);
    this.templateEmailSideNavService.getResult().subscribe(data => {
      if (!data) {
        this.getTemplateEmails( this.gridSettings.state.skip / NumberConstant.TEN);
      }
    });
  }
  onPageChange(event) {
    this.pageSize = event.take;
    this.getTemplateEmails(event.skip / NumberConstant.TEN);
  }
  public removeHandler({ dataItem }) {
    this.swalWarring.CreateSwal().then((result) => {
      if (result.value) {
        this.templateEmailService.getJavaGenericService().deleteEntity(dataItem.id).subscribe(() => {
          this.growlService.successNotification(this.translate.instant(MailingConstant.SUCCESS_OPERATION));
          this.getTemplateEmails( this.gridSettings.state.skip / NumberConstant.TEN);        });
      }
    });
  }
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
  }

  searchByFilter() {
    if (this._templateEmail) {
      this.applyFilter(NumberConstant.ZERO);
    } else {
      this.getTemplateEmails(this.gridSettings.state.skip / NumberConstant.TEN);
    }
  }
  private getTemplateEmails(page?) {
    if (this._templateEmail) {
      this.applyFilter(page);
    } else {
      this.templateEmailService.getJavaGenericService().getData('pages/' + (page + NumberConstant.ONE)).subscribe(data => {
        if (data) {
          this.gridSettings.gridData = {
            data: data.emailTempDtoList,
            total: data.totalElements
          };
          this.filteredData = data.emailTempDtoList;
        }
      });
    }
  }
  applyFilter(page) {
    this.templateEmailService.getJavaGenericService()
      .getData(`search?organisationName=${this._templateEmail}&page=${page}&size=${this.pageSize}`)
      .subscribe(data => {
      if (data) {
        this.gridSettings.gridData = {
          data: data.emailTempDtoList,
          total: data.totalElements
        };
        this.filteredData = data.emailTempDtoList;
      }
    });
  }
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if ((element.nodeName === 'TD' || element.nodeName === 'TH')
      && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
    } else {
      this.tooltipDir.hide();
    }
  }

  showDetails(event) {
    if (event.columnIndex || event.columnIndex === 0 ) {
      if (event.columnIndex !== event.sender.columns.length - 1) {
        this.showDetailTemplate = true;
        if (this.source) {
          this.templateToShowInSideNav = {value: true, data: event, parent: this.source};
        } else {
          this.templateToShowInSideNav = {value: true, data: event, parent: MailingConstant.TEMPLATEMAIL};
        }
        this.templateEmailSideNavService.show(event, MailingConstant.TEMPLATEMAIL);
      }
      }
  }

  showTemplateDetails(event) {
    this.showDetailTemplate = true;
    if (this.source) {
      this.templateToShowInSideNav = {value: true, data: event, parent: this.source};
    } else {
      this.templateToShowInSideNav = {value: true, data: event, parent: MailingConstant.TEMPLATEMAIL};
    }
  }

  SidNavEvent() {
    this.showDetailTemplate = false;
  }


}


