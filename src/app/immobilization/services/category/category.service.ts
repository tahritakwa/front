import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Category } from '../../../models/immobilization/category.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';


@Injectable()
export class CategoryService extends ResourceService<Category> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'category', 'Category', 'Immobilisation');
  }
}
