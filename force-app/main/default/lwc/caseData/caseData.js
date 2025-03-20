/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCases from '@salesforce/apex/CaseDataController.getCases';
import updateCasePriority from '@salesforce/apex/CaseDataController.updateCasePriority';
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

    @track selectedRow;
    @track caseNumberInParent;
    @track caseDetailsInParent;
    @track casePriorityInParent;

    newPriority;

    @wire(getCases, { filter: '$priority' })
    wiredCases({ error, data }) {
        // data: array of Case records
        if (data) {
            // console.log('data: ' + data);
            // map() loops through records to return new object
            this.cases = data.map(caseRecord => {
                return {
                    // keep fields as they are (because field API names are the same as columns defined above), map related object fields specifically
                    ...caseRecord
                };
            });
            // console.log('cases: ' + this.cases);
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
            // console.log('cases expanded: ' + this.casesExpanded);
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
        } catch (error) {
            console.error('Error in handleFilterButton:', error);
        } 
        
    }

    handleToggleButton() {
        this.showExpanded = !this.showExpanded;
    }

    // don't really need a promise here?
    handleCaseSelection(event) {
        console.log('handleCaseSelection Promise...');
        this.selectedRow = event.detail.selectedRows;
        console.log('selectedRow: ' + this.selectedRow);
        let rowsSize = this.selectedRow.length;
        // this.caseNumberInParent = this.selectedRows[0].CaseNumber;

        // creating promise
        // pass an executor function to the Promise constructor. Takes function, function args (provided by the promise constructor itself). Order is always same, resolve then reject
        const myPromise = new Promise((fulfill, decline) => {   
            if (rowsSize === 1) {
                // call function passed as args in constructor. Anything passed here is available in .then
                fulfill(this.selectedRow);
                console.log('promise fulfilled');
            } else {
                // Anything passed here is available in .catch handler
                decline('No rows/too many rows selected.');
                console.log('promise declined');
            }
        });
        
        // consuming promise
        myPromise
            // arg here is whatever was passed in fulfill
            .then((rows) => {
                console.log('executing fulfilled promise...');

                // refresh
                this.handleRefresh();

                // console.log('selectedRows raw: ' + this.selectedRows);
                // let rowsString = JSON.stringify(rows);
                // console.log('rows: ' + rows);
                // console.log('rowsString --- ' + rowsString); 
                this.caseNumberInParent = rows[0].CaseNumber;
                this.caseSubjectInParent = rows[0].Subject;  
                this.casePriorityInParent = rows[0].Priority;             
            })
            // arg here is whatever was passed in decline
            // can also execute if there is error in .then block
            .catch((error) => {
                console.log('promise error: ' + error);
                this.showToast(error);
            });
    }

    handleRefresh() {
        this.template.querySelector('c-case-detail').assignCaseData();
    }

    showToast(msg) {
        const evt = new ShowToastEvent({
          title: 'Error:',
          message: msg,
          variant: 'error',
        });
        this.dispatchEvent(evt);
    }

    // calling Apex imperatively (calling once, no streaming of data), which returns a promise
    async changePriority(event) {
        let newPriority = event.detail.priority;
        let caseId = event.detail.caseId;
        console.log('new priority: ' + newPriority);
            await updateCasePriority({ priority: newPriority, caseId: caseId })
                .then(result => {
                    console.log(result); // Handle the result
                })
                .catch(error => {
                    console.error(error); // Handle the error
                });
                console.log('success updating case :)')
    }  

}