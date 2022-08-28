export class SettlementHistory {
    static readonly SettlementHistoryList = [
        {
            Id: 1,
            Code: 'code_1',
            SettlementReference: 'ref1',
            IdTiersNavigation: 'tiers1',
            SettlementDate: '30/01/2020',
            IdPaymentMethodNavigation: 'cheq',
            AmountWithCurrency: 70
        },
        {
            Id: 2,
            Code: 'code_2',
            SettlementReference: 'ref2',
            IdTiersNavigation: 'tiers2',
            SettlementDate: '29/01/2020',
            IdPaymentMethodNavigation: 'cheq',
            AmountWithCurrency: 5620
        },
        {
            Id: 3,
            Code: 'code_3',
            SettlementReference: 'ref3',
            IdTiersNavigation: 'tiers3',
            SettlementDate: '14/02/2020',
            IdPaymentMethodNavigation: 'espèce',
            AmountWithCurrency: 1520
        },
        {
            Id: 4,
            Code: 'code_4',
            SettlementReference: 'ref4',
            IdTiersNavigation: 'tiers4',
            SettlementDate: '26/03/2020',
            IdPaymentMethodNavigation: 'trait',
            AmountWithCurrency: 850
        },
        {
            Id: 5,
            Code: 'code_5',
            SettlementReference: 'ref5',
            IdTiersNavigation: 'tiers5',
            SettlementDate: '16/02/2020',
            IdPaymentMethodNavigation: 'virement',
            AmountWithCurrency: 1203
        },
        {
            Id: 6,
            Code: 'code_6',
            SettlementReference: 'ref6',
            IdTiersNavigation: 'tiers6',
            SettlementDate: '30/04/2020',
            IdPaymentMethodNavigation: 'cheq',
            AmountWithCurrency: 3520
        }
    ];

    static readonly TreeViewData: any[] = [
        {

            Id: 1,
            Text: 'cheq1: 70',
            Items:  [
                {   Text: 'cheq2(100): 30',
                    Items: [
                        {   Text: 'trait1(60): 20'},
                        {   Text : 'ech2: 10',
                            Items: [
                                {   Text: 'espèce(50): 10'}
                            ]
                        }
                    ]
                },
                {   Text: 'ech1: 40',
                    Items: [
                        { Text: 'virement(80): 30'},
                        {
                           Text: 'ech3: 10',
                           Items: [
                                {   Text: 'cheq3(60): 10'}
                            ]
                        }
                    ]
                }
            ],
            IdSettlement: 1
        },
        {
            Id: 2,
            Text: 'ref2',
            Items: [
                { Text: 'Bed Linen' },
                { Text: 'Curtains & Blinds' },
                { Text: 'Carpets' }
            ],
            IdSettlement: 2
        },
        {
            Id: 3,
            Text: 'ref3',
            Items: [
                { Text: 'Bed Linen' },
                { Text: 'Curtains & Blinds' },
                { Text: 'Carpets' }
            ],
            IdSettlement: 3
        },
        {
            Id: 4,
            Text: 'ref4',
            Items: [
                { Text: 'Bed Linen' },
                { Text: 'Curtains & Blinds' },
                { Text: 'Carpets' }
            ],
            IdSettlement: 4
        },
        {
            Id: 5,
            Text: 'ref5',
            Items: [
                { Text: 'Bed Linen' },
                { Text: 'Curtains & Blinds' },
                { Text: 'Carpets' }
            ],
            IdSettlement: 5
        }
    ];
}
