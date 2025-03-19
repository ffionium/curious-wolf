import { LightningElement, api } from 'lwc';

export default class CaseDetail extends LightningElement {


    // @api caseDetails;

    @api caseDetails;
    @api caseNumber;
    @api casePriority;

    flagURL;
    flagVisible = false;

    highPriority = 'https://myflag.com.au/wp-content/uploads/2017/02/red-hand-waver-flag.jpg';
    mediumPriority = 'https://m.media-amazon.com/images/I/31aNRfZKbBL._SY445_SX342_QL70_ML2_.jpg';
    lowPriority = 'https://i.ebayimg.com/images/g/VzUAAOSwU7BhOSyK/s-l1200.jpg';

    renderedCallback() {
        
        switch(this.casePriority) {
            case 'High':
              this.flagVisible = true;
              this.flagURL = this.highPriority;
              break;
            case 'Medium':
                this.flagVisible = true;
                this.flagURL = this.mediumPriority;
              break;
            case 'Low':
                this.flagVisible = true;
                this.flagURL = this.lowPriority;
            break;
            default:
                this.flagURL = '';
                this.flagVisible = false;
          }

        if (this.casePriority === 'High') {
            this.flagURL = this.highPriority;
        }
    }

    // renderedCallback() {
    //     this.setCaseDetails();
    // }

    // setCaseDetails() {
    //     console.log('selectedCaseDetails --- ' + this.selectedCaseDetails)
    //     this.caseNumber = this.selectedCaseDetails[0].CaseNumber;
    // }

    // set caseNumber(selectedCaseDetails) {
    //     this._caseNumber = selectedCaseDetails[0].CaseNumber;
    //     console.log('CaseNumber in child: ' + this.caseNumber)
    // }

    // @api
    // get caseNumber() {
    //     return this._caseNumber;
    // }

    // promise approach
    // handlePromise() {
    //     const caseDetailPromise = new Promise((success, error) => {
    //         if(this.selectedCaseDetails) {
    //             success(this.selectedCaseDetails[0].CaseNumber);
    //             console.log('caseDetailPromise success!')
    //         } else {
    //             error('No selectedCaseDetails available.')
    //         }
    //     });

    //     caseDetailPromise
    //         .then((caseNumberString) => {
    //             console.log('caseNumber --- ' + caseNumberString)
    //             this.caseNumber = caseNumberString;
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

}