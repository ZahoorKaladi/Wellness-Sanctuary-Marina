export const getLocalizedText = (data, field, language) => {
  if (!data) return "";
  // If language is German ('de') and a German field exists, return it
  if (language === 'de' && data[`${field}_de`]) {
    return data[`${field}_de`];
  }
  // Otherwise return the default (English) field
  return data[field];
};