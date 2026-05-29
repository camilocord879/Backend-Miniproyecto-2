export const isInstitutionalEmail = (email: string): boolean => {

  return email.toLowerCase().endsWith(".edu.co");

};