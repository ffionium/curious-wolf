import { createElement } from 'lwc';
import caseData from 'c/caseData';
import getCases from '@salesforce/apex/CaseDataController.getCases';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

const mockGetCases = registerApexTestWireAdapter(getCases);

describe('c-case-datatable', () => {
    afterEach(() => {
        // Clean up DOM after each test
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders case columns correctly', () => {
        const element = createElement('c-caseData', {
            is: caseData
        });
        document.body.appendChild(element);

        const columns = element.columns;
        expect(columns).toEqual([
            { label: 'Case Number', fieldName: 'CaseNumber' },
            { label: 'Subject', fieldName: 'Subject' },
            { label: 'Status', fieldName: 'Status' },
            { label: 'Priority', fieldName: 'Priority' }
        ]);
    });

    it('renders expanded case columns correctly', () => {
        const element = createElement('c-caseData', {
            is: caseData
        });
        document.body.appendChild(element);

        const columnsExpanded = element.columnsExpanded;
        expect(columnsExpanded).toEqual([
            { label: 'Case Number', fieldName: 'CaseNumber' },
            { label: 'Subject', fieldName: 'Subject' },
            { label: 'Status', fieldName: 'Status' },
            { label: 'Priority', fieldName: 'Priority' },
            { label: 'Account Name', fieldName: 'AccountName', type: 'text' },
            { label: 'Account Phone', fieldName: 'AccountPhone', type: 'phone' },
            { label: 'Contact Name', fieldName: 'ContactName', type: 'text' },
            { label: 'Contact Email', fieldName: 'ContactEmail', type: 'text' }
        ]);
    });

    it('handles priority filter change', () => {
        const element = createElement('c-caseData', {
            is: caseData
        });
        document.body.appendChild(element);
        console.log('document console log: ' + document.value);

        const priorityFilter = element.shadowRoot.querySelector('.combobox');
        console.log('priorityFilter: '+ priorityFilter.value);
        priorityFilter.value = 'High';
        priorityFilter.dispatchEvent(new Event('change'));

        const filterButton = element.shadowRoot.querySelector('.button');
        filterButton.dispatchEvent(new Event('click'));

        expect(element.priority).toBe('High');

        // gotta press the button first
    });

    it('toggles expanded view', () => {
        const element = createElement('c-caseData', {
            is: caseData
        });
        document.body.appendChild(element);

        const toggleButton = element.shadowRoot.querySelector('.expandButton');
        toggleButton.dispatchEvent(new Event('click'));

        expect(element.showExpanded).toBe(true);
    });

    // it('fetches cases data', async () => {
    //     const element = createElement('c-case-datatable', {
    //         is: caseData
    //     });
    //     document.body.appendChild(element);

    //     mockGetCases.emit([{ CaseNumber: '0001', Subject: 'Test Case', Status: 'New', Priority: 'High' }]);

    //     await Promise.resolve();

    //     const cases = element.cases;
    //     expect(cases).toEqual([{ CaseNumber: '0001', Subject: 'Test Case', Status: 'New', Priority: 'High' }]);
    // });
});