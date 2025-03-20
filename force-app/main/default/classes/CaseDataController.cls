public with sharing class CaseDataController {
  
  @AuraEnabled(cacheable=true)
  public static List<Case> getCases(String filter) {

    List<Case> caseList = new List<Case>();
    String query;

    if (filter <> 'All') {
      query = 'SELECT Id, CaseNumber, Subject, Status, Priority, Type, Account.Name, Account.Phone, Account.Website, Contact.Name, Contact.Email FROM Case WHERE Status <> \'Closed\' AND Priority = \'' + filter + '\'';
    } else {
      query = 'SELECT Id, CaseNumber, Subject, Status, Priority, Type, Account.Name, Account.Phone, Account.Website, Contact.Name, Contact.Email FROM Case WHERE Status <> \'Closed\'';
    }
    
    try {
      caseList = Database.query(query);
      return caseList;
    } catch (Exception e) {
      throw new AuraHandledException('Error fetching cases: ' + e.getMessage());
    }
  }

  @AuraEnabled
  public static void updateCasePriority(String priority, String caseId) {
    System.debug('updateCasePriority called.');
    System.debug('priority: ' + priority);
    System.debug('caseId: ' + caseId);
  }

}