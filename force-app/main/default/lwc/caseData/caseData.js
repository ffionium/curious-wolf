import { LightningElement, wire, track, api } from 'lwc';
import getCases from '@salesforce/apex/CaseDataController.getCases';
// import getCasesExpanded from '@salesforce/apex/CaseDataController.getCasesExpanded';

const CASE_COLUMNS = [
    { label: 'Case Number', fieldName: 'CaseNumber' },
    { label: 'Subject', fieldName: 'Subject' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Priority', fieldName: 'Priority' }
];

const EXPANDED_CASE_COLUMNS = [
    { label: 'Case Number', fieldName: 'CaseNumber' },
    { label: 'Subject', fieldName: 'Subject' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Priority', fieldName: 'Priority' },
    { label: 'Account Name', fieldName: 'AccountName', type: 'text' },
    { label: 'Account Phone', fieldName: 'AccountPhone', type: 'phone' },
    { label: 'Contact Name', fieldName: 'ContactName', type: 'text' },
    { label: 'Contact Email', fieldName: 'ContactEmail', type: 'text' }
  ];

const priorities = [
    { label: 'All', value: 'All'},
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];  

export default class caseDatatable extends LightningElement {

    @api columns = CASE_COLUMNS;
    @api columnsExpanded = EXPANDED_CASE_COLUMNS;
    priorities = priorities;
    cases;
    casesExpanded;

    @track priority = 'All';
    @api selectedPriority = 'Choose a priority filter';
    @track showExpanded = false;

    @wire(getCases, { filter: '$priority' })
    wiredCases({ error, data }) {
        // data: array of Case records
        if (data) {
            console.log('data: ' + data);

            // map() loops through records to return new object
            this.cases = data.map(caseRecord => {
                return {
                    // keep fields as they are (because field API names are the same as columns defined above), map related object fields specifically
                    ...caseRecord
                };
            });
            console.log('cases: ' + this.cases);
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getCases, { filter: '$priority' })
    wiredCasesExpanded({ error, data }) {
        // data: array of Case records
        if (data) {
            // map() loops through records to return new object
            this.casesExpanded = data.map(caseRecord => {
                return {
                    ...caseRecord,
                    AccountName: caseRecord.Account.Name,
                    AccountPhone: caseRecord.Account.Phone,
                    ContactName: caseRecord.Contact.Name,
                    ContactEmail: caseRecord.Contact.Email
                };
            });
            console.log('cases expanded: ' + this.casesExpanded);
        } else if (error) {
            console.error(error);
        }
    }

    // handle filter drop-down 
    handlePriorityFilter(event) {
        try {
            this.selectedPriority = event.target.value;
            console.log('Selected Priority:', this.selectedPriority);
        } catch (error) {
            console.error('Error in handlePriorityFilter:', error);
        }
    }

    handleFilterButton() {
        try {
            this.priority = this.selectedPriority;
            refreshApex(this.wiredCases);
        } catch (error) {
            console.error('Error in handleFilterButton:', error);
        } 
        
    }

    handleToggleButton() {
        this.showExpanded = !this.showExpanded;
    }

}