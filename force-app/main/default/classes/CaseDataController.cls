public with sharing class CaseDataController {
  
  // static: doesn't need to be mutable as there is no need to create classes deriving from CaseDataController, with different applications/requirements
  @AuraEnabled(cacheable=true)
  public static List<Case> getCases(String filter) {

    List<Case> caseList = new List<Case>();
    String query;

    // could use a utility class for SOQL query, passing in field names as a List argument. Schema class to get lists of fields
    if (filter <> 'All') {
      query = 'SELECT Id, CaseNumber, Subject, Status, Priority, Type, Account.Name, Account.Phone, Account.Website, Contact.Name, Contact.Email FROM Case WHERE Status <> \'Closed\' AND Priority = \'' + filter + '\'';
    } else {
      query = 'SELECT Id, CaseNumber, Subject, Status, Priority, Type, Account.Name, Account.Phone, Account.Website, Contact.Name, Contact.Email FROM Case WHERE Status <> \'Closed\'';
    }
    
    // Error handling
    try {
      // Database.query allows for more dynamic queries
      caseList = Database.query(query);
      return caseList;
    } catch (Exception e) {
      // AuraHandledException can be passed back to javascript contoller
      throw new AuraHandledException('Error fetching cases: ' + e.getMessage());
    }
  }

  @AuraEnabled
  public static void updateCasePriority(Integer priority, String caseId) {
    System.debug('updateCasePriority called.');
    System.debug('priority: ' + priority);
    System.debug('caseId: ' + caseId);

    Case caseToUpdate = [SELECT Id, Priority FROM Case WHERE Id = :caseId];

    if (caseToUpdate <> null) {

      if (priority >= 3) {
        caseToUpdate.Priority = 'High';
      } else if ( priority <= 1) {
        caseToUpdate.Priority = 'Low';
      } else {
        caseToUpdate.Priority = 'Medium';
      }
      

      try {
        update caseToUpdate;
      } catch (Exception e) {
        throw new AuraHandledException('Error fetching cases: ' + e.getMessage());
      }

    }
  }

}