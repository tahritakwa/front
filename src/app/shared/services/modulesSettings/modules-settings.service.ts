import {Inject, Injectable} from '@angular/core';
import {ResourceService} from '../resource/resource.service';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ModulesSettings} from '../../../models/shared/ModulesSettings.model';

@Injectable()
export class ModulesSettingsService extends ResourceService<ModulesSettings> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base');
  }

}
