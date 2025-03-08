public with sharing class CaseDataController {
  

  // add filter parameter
  // condense to one method using Database.QueryLocator and string

  @AuraEnabled(cacheable=true)
  public static List<Case> getCases(String filter) {

    List<Case> caseList = new List<Case>();
    String query;

    if (filter <> 'All') {
      query = 'SELECT Id, CaseNumber, Subject, Status, Priority, Account.Name, Account.Phone, Account.Website, Contact.Name, Contact.Email FROM Case WHERE Status <> \'Closed\' AND Priority = \'' + filter + '\'';
    } else {
      query = 'SELECT Id, CaseNumber, Subject, Status, Priority, Account.Name, Account.Phone, Account.Website, Contact.Name, Contact.Email FROM Case WHERE Status <> \'Closed\'';
    }
    
    try {
      caseList = Database.query(query);
      return caseList;
    } catch (Exception e) {
      throw new AuraHandledException('Error fetching cases: ' + e.getMessage());
    }
  }

  // @AuraEnabled(cacheable=true)
  // public static List<Case> getCasesExpanded(String filter) {
  //   return [SELECT Id, CaseNumber, Subject, Status, Priority, Account.Name, Account.Phone, Account.Website, Contact.Name, Contact.Email
  //           FROM Case 
  //           WHERE Status <> 'CLosed'
  //           AND (Priority = 'High' 
  //           OR Priority = 'Medium')];
  // }
}