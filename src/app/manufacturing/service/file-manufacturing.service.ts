import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {FileConstant} from '../../constant/manufuctoring/file.constant';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';


@Injectable()
export class FileManufacturingService extends ResourceServiceJava {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, FileConstant.MANUFACTURING, FileConstant.ENTITY_NAME);
  }

}
