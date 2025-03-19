/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, wire, track, api } from 'lwc';
import ShowToastEvent from 'lightning/platformShowToastEvent';
import getCases from '@salesforce/apex/CaseDataController.getCases';
import { refreshApex } from "@salesforce/apex";

const CASE_COLUMNS = [
    { label: 'Case Number', fieldName: 'CaseNumber' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Priority', fieldName: 'Priority' }
];

const EXPANDED_CASE_COLUMNS = [
    { label: 'Case Number', fieldName: 'CaseNumber' },
    { label: 'Type', fieldName: 'Type' },
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
    @track selectedPriority = 'Choose a priority filter';
    @track showExpanded = false;

    @track selectedRows;
    @track caseNumberInParent;

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
            // put this inside promise?
            refreshApex(this.wiredCases);
        } catch (error) {
            console.error('Error in handleFilterButton:', error);
        } 
        
    }

    handleToggleButton() {
        this.showExpanded = !this.showExpanded;
    }

    // use promise?
    // getSelectedCase(event) {
    //     // this.selectedRows = event.detail.selectedRows;
    //     // console.log('selectedRows --- ' + this.selectedRows.Account.Name);
    //     this.handlePromise();
    //     // Display that fieldName of the selected rows
    //     // for (let i = 0; i < selectedRows.length; i++) {
    //     //     alert('You selected: ' + selectedRows[i].OpportunityName);
    //     // }
    // }

    // showToast(rowsString) {
    //     const evt = new ShowToastEvent({
    //       title: 'Selected Row:',
    //       message: rowsString[0].CaseNumber,
    //       variant: 'info',
    //     });
    //     this.dispatchEvent(evt);
    //   }

    handleCaseSelection(event) {
        console.log('handleCaseSelection Promise...');
        this.selectedRows = event.detail.selectedRows;
        // this.caseNumberInParent = this.selectedRows[0].CaseNumber;
        // pass an executor function to the Promise constructor. Takes function, function args (provided by the promise constructor itself). Order is always same, resolve then reject
        const myPromise = new Promise((fulfill, decline) => {    
            if (this.selectedRows) {
                // call function passed as args in constructor. Anything passed here is available in .then
                fulfill(this.selectedRows);
                console.log('promise fulfilled');
            } else {
                // Anything passed here is available in .catch handler
                decline('No rows selected.');
                console.log('promise declined');
            }
        });
        
        myPromise
            // arg here is whatever was passed in fulfill
            .then((rows) => {
                console.log('executing fulfilled promise...');
                this.selectedRows = rows;
                console.log('selectedRows raw: ' + this.selectedRows);
                let rowsString = JSON.stringify(rows);
                console.log('rowsString --- ' + rowsString); 
                this.caseNumberInParent = this.selectedRows[0].CaseNumber;
                console.log('caseNumberInParent' + this.caseNumberInParent);                              
            })
            // arg here is whatever was passed in decline
            // can also execute if there is error in .then block
            .catch((error) => {
                console.log('promise error');
                console.log(error); 
            });
    }
}