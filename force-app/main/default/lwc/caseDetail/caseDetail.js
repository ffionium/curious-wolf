import { LightningElement, api } from 'lwc';

export default class CaseDetail extends LightningElement {


    // @api caseDetails;

    @api selectedCaseDetails;
    @api caseNumber;

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