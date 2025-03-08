public with sharing class CaseDataController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCasesWithAccount() {
      return [SELECT Id, CaseNumber, Subject, Status, Priority, Account.Name, Account.Phone, Account.Website 
              FROM Case 
              WHERE Status <> 'CLosed'
              AND (Priority = 'High' 
              OR Priority = 'Medium')];
    }
  }