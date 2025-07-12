// Date utility functions for API integration

/**
 * Format date to DD/MM/YYYY format for API and display
 * @param date - Date object or date string (can be DD/MM/YYYY or ISO format)
 * @returns formatted date string (DD/MM/YYYY)
 */
export const formatDateForAPI = (date: Date | string): string => {
  // If it's already a string, check if it's in DD/MM/YYYY format
  if (typeof date === 'string') {
    // Check if it's already in DD/MM/YYYY format
    const ddmmyyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (ddmmyyyyRegex.test(date)) {
      return date; // Already in correct format
    }
    
    // Try to parse as ISO date or other formats
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date provided');
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    
    return `${day}/${month}/${year}`;
  }
  
  // Handle Date object
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  return `${day}/${month}/${year}`;
};

/**
 * Parse date from backend format (dd-mm-yy, HH:mm) to Date object
 * @param dateString - Date string from backend
 * @returns Date object
 */
export const parseDateFromAPI = (dateString: string): Date => {
  // Backend format: "25-03-24, 14:30"
  const [datePart, timePart] = dateString.split(', ');
  
  if (!datePart || !timePart) {
    throw new Error('Invalid date format from API');
  }
  
  const [day, month, year] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  
  if (!day || !month || !year || !hours || !minutes) {
    throw new Error('Invalid date format from API');
  }
  
  // Convert 2-digit year to 4-digit year
  const fullYear = parseInt(year) + 2000;
  
  return new Date(
    fullYear,
    parseInt(month) - 1, // Month is 0-indexed in Date constructor
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  );
};

/**
 * Format date for display in UI (DD/MM/YYYY format)
 * @param date - Date object or date string (can be DD/MM/YYYY or ISO format)
 * @returns formatted date string for display in DD/MM/YYYY format
 */
export const formatDateForDisplay = (date: Date | string): string => {
  // If it's already a string, check if it's in DD/MM/YYYY format
  if (typeof date === 'string') {
    // Check if it's already in DD/MM/YYYY format
    const ddmmyyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (ddmmyyyyRegex.test(date)) {
      return date; // Already in correct format
    }
    
    // Try to parse as ISO date or other formats
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'; // Return fallback instead of throwing error
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    
    return `${day}/${month}/${year}`;
  }
  
  // Handle Date object
  if (isNaN(date.getTime())) {
    return 'Invalid Date'; // Return fallback instead of throwing error
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format date and time for display in UI
 * @param date - Date object or date string (can be DD/MM/YYYY or ISO format)
 * @returns formatted date and time string for display
 */
export const formatDateTimeForDisplay = (date: Date | string): string => {
  // If it's a string, try to parse it appropriately
  if (typeof date === 'string') {
    // Check if it's in DD/MM/YYYY format and convert to ISO for Date parsing
    const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = date.match(ddmmyyyyRegex);
    
    if (match) {
      const [, day, month, year] = match;
      // Convert to ISO format for proper Date parsing
      const isoDate = `${year}-${month}-${day}`;
      const dateObj = new Date(isoDate);
      
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObj.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    // Try to parse as other date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Handle Date object
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get current date in API format
 * @returns current date in dd/mm/yyyy format
 */
export const getCurrentDateForAPI = (): string => {
  return formatDateForAPI(new Date());
};

/**
 * Add days to a date and return in API format
 * @param date - Base date
 * @param days - Number of days to add
 * @returns formatted date string
 */
export const addDaysToDateForAPI = (date: Date | string, days: number): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const newDate = new Date(dateObj);
  newDate.setDate(newDate.getDate() + days);
  return formatDateForAPI(newDate);
};

/**
 * Validate if a date string is in correct format for API
 * @param dateString - Date string to validate
 * @returns boolean indicating if format is valid
 */
export const isValidAPIDateFormat = (dateString: string): boolean => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
};
