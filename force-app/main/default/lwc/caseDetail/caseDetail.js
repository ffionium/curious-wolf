import { LightningElement, api, track } from 'lwc';

export default class CaseDetail extends LightningElement {

    // why child component
    // modularity: could use this in a different parent component, make it more dynamic to handle data for different objects
    // Separation of concerns: scope here is to display details, whereas the parent shows a collection of records
    // improved readability

    @api selectedRow;

    @track caseId;
    @track caseSubject;
    @track caseNumber;
    @track casePriority;

    // caseId;
    // caseSubject;
    // caseNumber;
    // casePriority;

    priorityInt;

    flagURL;
    flagVisible = false;

    // hardcoded values: could store as static resources
    highPriority = 'https://myflag.com.au/wp-content/uploads/2017/02/red-hand-waver-flag.jpg';
    mediumPriority = 'https://m.media-amazon.com/images/I/31aNRfZKbBL._SY445_SX342_QL70_ML2_.jpg';
    lowPriority = 'https://i.ebayimg.com/images/g/VzUAAOSwU7BhOSyK/s-l1200.jpg';

    // @api because called by parent component
    @api
    assignCaseData() {
        if(this.selectedRow) {
            console.log('assignCaseData selectedRow: ' + this.selectedRow);
            console.log('assignCaseData selectedRow String: ' + JSON.stringify(this.selectedRow));
            this.caseId = this.selectedRow.Id;
            this.caseNumber = this.selectedRow.CaseNumber;
            this.caseSubject = this.selectedRow.Subject;
            this.casePriority = this.selectedRow.Priority;
            this.renderFlag();
        }
    }

    renderFlag() {

        switch(this.casePriority) {
            case 'High':
              this.flagVisible = true;
              this.flagURL = this.highPriority;
              this.priorityInt = 3;
              break;
            case 'Medium':
                this.flagVisible = true;
                this.flagURL = this.mediumPriority;
                this.priorityInt = 2;
              break;
            case 'Low':
                this.flagVisible = true;
                this.flagURL = this.lowPriority;
                this.priorityInt = 1;
            break;
            default:
                this.flagURL = '';
                this.flagVisible = false;
        }
    }

    // could condense here, make 1 method with parameters
    handlePriorityIncrease() {
        console.log('handlePriorityIncrease clicked.');
        let priorityInt = this.priorityInt+1;
        let caseUpdateId = this.caseId;
        this.dispatchEvent(new CustomEvent('prioritychange', {
            detail: {
                priority: priorityInt,
                caseId: caseUpdateId
            }
        }));
    }

    handlePriorityDecrease() {
        console.log('handlePriorityDecrease clicked.');
        let priorityInt = this.priorityInt-1;
        let caseUpdateId = this.caseId;
        this.dispatchEvent(new CustomEvent('prioritychange', {
            detail: {
                priority: priorityInt,
                caseId: caseUpdateId
            }
        }));
    }

}