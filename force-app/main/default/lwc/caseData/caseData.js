/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
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
    @track selectedRow;
    rowsSize;

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

    handleCaseSelection(event) {
        
        this.selectedRows = event.detail.selectedRows;
        this.selectedRow = event.detail.selectedRows[0];
        this.rowsSize = this.selectedRows.length;

        const rowSelectionPromise = new Promise((fulfill, decline) => {   
            if (this.rowsSize <= 1) {
                fulfill(this.selectedRows);
            } else {
                decline('Too many rows selected.')
            }
         
    });
    
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