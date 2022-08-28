export const Language = 'language';
export const FormatDate = 'format_date';
export const Languages = {
  FR: {
    id: 'fr-FR',
    label: 'FR',
    value: 'fr',
    name: 'Français',
    format_date: 'dd/MM/yyyy',

  },
  EN: {
    id: 'en-EN',
    label: 'EN',
    value: 'en',
    name: 'English',
    format_date: 'MM/dd/yyyy',
    sale_state_labels: ['billed amount', 'remaining amount']
  }
};
export const MODAL_SETTINGS = {
  modalClass: 'modal fade ngx-modal  modal-body-scrolable',
  modalDialogClass: 'modal-dialog modal-dialog-centered modal-md',
  closeButtonTitle: 'CLOSE',
  closeButtonClass: 'close icon-close close-icon',
  contentClass: 'modal-content modal-md',
  bodyClass: 'modal-body',
};

export const englishMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
  'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
];

export const frenshMonthNames = ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
];

export const period = ['', 'CURRENT_MONTH', 'LAST_MONTH', 'LAST_SIX_MONTH', 'CURRENT_YEAR', 'LAST_YEAR'];

export const Labels = {
  EN: {
    sale_state_labels: ['Inoviced Amount (TTC)', 'Remaining Amount (TTC)'],
    sale_purchase_labels: ['Purchases', 'Sales'],
    purchase_state_labels: ['accepted', 'ongoing', 'Rejected'],
    starters_exits_labels: ['Entry', 'Exit'],
    time_to_fill_labels: ['Delay Before Recruitment', 'Recruitment Duration']
  },
  FR: {
    sale_state_labels: ['Montant facturé (TTC)', 'Montant restant (TTC)'],
    sale_purchase_labels: ['Vente', 'Achat'],
    purchase_state_labels: ['Acceptée', 'en cours', 'Refusée'],
    starters_exits_labels: ['Entrées', 'Sorties'],
    time_to_fill_labels: ['Délai avant recrutement', 'Durée de recrutement']
  }
};
