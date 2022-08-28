import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AppConfig } from "../../../../COM/config/app.config";
import { SharedConstant } from "../../../constant/shared/shared.constant";
import { ZipCode } from "../../../models/shared/zip-code";
import { ResourceService } from "../resource/resource.service";
import { DataTransferShowSpinnerService } from "../spinner/data-transfer-show-spinner.service";

@Injectable()
export class ZipCodeService extends ResourceService<ZipCode> {
  // tslint:disable-next-line: max-line-length
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'base', 'ZipCode', 'Shared');
  }
 
  

}