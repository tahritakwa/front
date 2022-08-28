import { Injectable, Inject } from '@angular/core';
import { ResourceServiceJava } from '../../../shared/services/resource/resource.serviceJava';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GridComponent } from '@progress/kendo-angular-grid';
import { Operation } from '../../../../COM/Models/operations';
import { ValidationService } from '../../../shared/services/validation/validation.service';


@Injectable()
export class ReportingService extends ResourceServiceJava {

    constructor(@Inject(HttpClient) http, @Inject(AppConfig) appConfigAccounting,
        private fb: FormBuilder, private validationService: ValidationService) {
        super(http, appConfigAccounting, 'accounting', ReportingConstant.ENTITY_NAME);
    }

    public lineClickHandler(editedRowIndeX: number, rowIndex: number, dataItem: any, grid: GridComponent) {
        if (editedRowIndeX === undefined) {
            return this.editHandler(rowIndex, dataItem, grid);
        }
        return undefined;
    }

    initReportConfigForm(dataItem: any) {
        return this.fb.group({
            id: [dataItem.id],
            lineIndex: [dataItem.lineIndex],
            label: [dataItem.label],
            previousFiscalYear: [dataItem.previousFiscalYear],
            previousFiscalYearAmount: [dataItem.previousFiscalYearAmount.toFixed(NumberConstant.THREE)],
            fiscalYear: [dataItem.fiscalYear],
            amount: [dataItem.amount.toFixed(NumberConstant.THREE)],
            reportType: [dataItem.reportType],
            negative: [dataItem.negative],
            formula: [dataItem.formula, Validators.required],
            annexCode: [dataItem.annexCode],
            highlighted: [dataItem.highlighted],
        });
    }

    public editHandler(rowIndex: number, dataItem: any, grid: GridComponent) {
        const reportConfigFormGroup = this.initReportConfigForm(dataItem);
        grid.editRow(rowIndex, reportConfigFormGroup);
        return reportConfigFormGroup;
    }

    public saveHandler(rowIndex: number, formGroup: FormGroup, terminateOperation: Function) {
        if ((formGroup as FormGroup).valid) {
            const reportLine = formGroup.value;
            if (reportLine.id) {
                this.callService(Operation.PUT, ReportingConstant.REPORT_LINE, reportLine).finally(()=>{
                  terminateOperation(rowIndex);
                }).subscribe();
            }
        } else {
            this.validationService.validateAllFormFields(formGroup as FormGroup);
        }
    }

}
