import { Injectable, enableProdMode } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IAppConfig } from './app-config.env';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';


@Injectable()
export class AppConfig {

  public settings: IAppConfig;
  private env: Object = null;

  constructor(private http: Http) {
  }

  /**
   * Use to get the data found in the second file (config file)
   */
  public getConfig(key: any) {
    return this.settings[key];
  }

  /**
   * Use to get the data found in the first file (env file)
   */
  public getEnv(key: any) {
    return this.env[key];
  }

  //this method is to get env for apm agent
  public getEnvName() {
    return environment.environmentName;
  }

  /**
   * This method:
   *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
   *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
   */
  public load() {
    return new Promise((resolve, reject) => {
      this.env = environment.environmentName;
      let request: any = null;
      request = this.http.get('environments/environment.' + this.env + '.json');
      if (request) {
        request
          .map(res => res.json())
          .catch((error: any) => {
            resolve(error);
            return Observable.throw(error.json().error || 'Server error');
          })
          .subscribe((responseData: any) => {
            this.settings = responseData as IAppConfig;
            resolve(true);
          });
      } else {
        resolve(true);
      }
    });

  }
}
