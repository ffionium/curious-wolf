/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// adapterId from adaptedModule
import getCases from '@salesforce/apex/CaseDataController.getCases';
import updateCasePriority from '@salesforce/apex/CaseDataController.updateCasePriority';
// import { refreshApex } from "@salesforce/apex";

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

// caseDatatable is extending LightningElement class
export default class caseDatatable extends LightningElement {

    // @api decorator not actually needed; properties are reactive by default (habit)
    // @api does make properties available to parent components
    columns = CASE_COLUMNS;
    columnsExpanded = EXPANDED_CASE_COLUMNS;

    // values for the combobox
    priorities = priorities;
    cases;
    casesExpanded;

    // @track only needed for deep reactivity in complex objects or arrays.
    priority = 'All';
    selectedPriority = 'Choose a priority filter';
    showExpanded = false;

    @track selectedRows;
    @track selectedRow;
    rowsSize;

    // wire service, @wire adapterId, adapterConfig
    // Apex call because array of sObjects, with related object fields below
    // @wire makes it reactive, so when filter changes in handlePriorityFilter, table is updated
    @wire(getCases, { filter: '$priority' })
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data.map(caseRecord => {
                return {
                    ...caseRecord
                };
            });
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getCases, { filter: '$priority' })
    wiredCasesExpanded({ error, data }) {
        if (data) {
            this.casesExpanded = data.map(caseRecord => {
                return {
                    ...caseRecord,
                    AccountName: caseRecord.Account.Name,
                    AccountPhone: caseRecord.Account.Phone,
                    ContactName: caseRecord.Contact.Name,
                    ContactEmail: caseRecord.Contact.Email
                };
            });
        } else if (error) {
            console.error(error);
        }
    }

    handlePriorityFilter(event) {
        try {
            this.selectedPriority = event.target.value;
            // this.priority = this.selectedPriority;
        } catch (error) {
            console.error('Error in handlePriorityFilter:', error);
        }
    }

    // not needed necessarily, wanted to tie it to a button. 
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

    // promise
    handleCaseSelection(event) {
        
        this.selectedRows = event.detail.selectedRows;
        this.selectedRow = event.detail.selectedRows[0];
        this.rowsSize = this.selectedRows.length;
        // this.handleRefresh();

        const rowSelectionPromise = new Promise((fulfill, decline) => {   
            if (this.rowsSize <= 1) {
                fulfill(this.selectedRows);
            } else {
                decline('Too many rows selected.')
            }
         
        });
    
    // promise not actually needed, demo puropses. No asynchronous operations here, no need to use them to handle events
    rowSelectionPromise
        .then((rows) => {

            console.log('rows: ' + JSON.stringify(rows));
            if(rows.length === 0) {
                this.selectedRow = '';                
            }            
            this.handleRefresh();           
        })
        .catch((error) => {
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

    // this actually does need promise, as we're waiting for a database operation to complete
    async changePriority(event) {
        let newPriority = event.detail.priority;
        let caseId = event.detail.caseId;
        console.log('new priority: ' + newPriority);
        console.log('caseId in parent: ' + caseId);
            await updateCasePriority({ priority: newPriority, caseId: caseId })
                .then(result => {
                    console.log(result);          
                })
                .catch(error => {
                    console.error(error);
                });
        window.location.reload();
    }  

}