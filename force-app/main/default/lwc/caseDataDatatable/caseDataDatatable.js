import { LightningElement, wire } from 'lwc';
import getCasesWithAccount from '@salesforce/apex/CaseDataController.getCasesWithAccount';

const COLUMNS = [
  { label: 'Case Number', fieldName: 'CaseNumber' },
  { label: 'Subject', fieldName: 'Subject' },
  { label: 'Status', fieldName: 'Status' },
  { label: 'Priority', fieldName: 'Priority' },
  { label: 'Account Name', fieldName: 'AccountName', type: 'text' },
  { label: 'Account Phone', fieldName: 'AccountPhone', type: 'phone' }
];

export default class CaseListView extends LightningElement {
  columns = COLUMNS;
  cases;

  @wire(getCasesWithAccount)
  wiredCases({ error, data }) {
    if (data) {
      this.cases = data.map(caseRecord => {
        return {
          ...caseRecord,
          AccountName: caseRecord.Account.Name,
          AccountPhone: caseRecord.Account.Phone
        };
      });
    } else if (error) {
      console.error(error);
    }
  }
}