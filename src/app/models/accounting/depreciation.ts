import {Injectable} from '@angular/core';
import {DepreciationAssets} from './depreciation-assets';

@Injectable()
export class Depreciation {
  public depreciationAssets: DepreciationAssets;

  public constructor() {}
}
