import { SessionBonus } from './session-bonus.model';
import { ViewRef } from '@angular/core';
export class SessionBonusSection {
    sessionBonusList: SessionBonus[];
    sessionId: number;
    BonusId: number;
    viewReference: ViewRef;
    index: number;
}
