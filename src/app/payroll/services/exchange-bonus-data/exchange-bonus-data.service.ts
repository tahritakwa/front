import {Injectable} from '@angular/core';
import {SessionBonusSection} from '../../../models/payroll/session-bonus-section.model';


@Injectable()
export class ExchangeBonusDataService {
  private index = 0;
  private bonusSessionAllChildrendata: SessionBonusSection[] = [];

  public getIndex(): number {
    return this.index;
  }

  public setIndex(data): void {
    this.index = data;
  }

  public incrementIndex(): void {
    this.index++;
  }

  public getBonusSessionfromPosition(i): SessionBonusSection {
    return this.bonusSessionAllChildrendata[i];
  }

  public getBonusSessionSharedBetweenChildren(): SessionBonusSection[] {
    return this.bonusSessionAllChildrendata;
  }

  public setBonusSessionSharedBetweenChildren(data) {
    this.bonusSessionAllChildrendata = data;
  }

  public appendBonusSessionToSharedData(data) {
    this.bonusSessionAllChildrendata.push(data);
  }
}
