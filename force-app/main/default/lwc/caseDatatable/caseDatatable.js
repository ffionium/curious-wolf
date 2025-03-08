import { LightningElement, wire } from 'lwc';
import getCasesWithAccount from '@salesforce/apex/CaseDataController.getCasesWithAccount';

// const COLUMNS = [
//   { label: 'Case Number', fieldName: 'CaseNumber' },
//   { label: 'Subject', fieldName: 'Subject' },
//   { label: 'Status', fieldName: 'Status' },
//   { label: 'Priority', fieldName: 'Priority' },
//   { label: 'Account Name', fieldName: 'AccountName', type: 'text' },
//   { label: 'Account Phone', fieldName: 'AccountPhone', type: 'phone' }
// ];

export default class caseDatatable extends LightningElement {
  // columns = COLUMNS;
  cases;

  @wire(getCasesWithAccount)
  wiredCases({ error, data }) {
    // data: array of Case records
    if (data) {
      // map() loops through records to return new object
      this.cases = data.map(caseRecord => {
        return {
          // keep fields as they are (because field API names are the same as columns defined above), map related object fields specifically
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