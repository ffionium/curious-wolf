@IsTest
public class TestCaseDataController {


    @TestSetup
    static void createCases() {

        Case c = new Case();
        c.Subject = 'Issue with Pricing';
        c.Description = 'Customer is not happy with rising prices!';
        c.Status = 'New';
        c.Priority = 'High';
        c.Origin = 'Phone';

        insert c;
        
    }

    @isTest
    static void testGetCasesFiltered() {
    
        String filter = 'High';

        Test.startTest();
        List<Case> cases = CaseDataController.getCases(filter);
        Test.stopTest();

        System.assertEquals(1, cases.size());
    }

    @isTest
    static void testGetCasesAll() {
    
        String filter = 'All';

        Test.startTest();
        List<Case> cases = CaseDataController.getCases(filter);
        Test.stopTest();

        System.assertEquals(1, cases.size());
    }

}