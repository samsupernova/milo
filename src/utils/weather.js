// Weather utility functions
export const parseEventDate = (dateStr) => {
  // Parse date string like "Sun, May 18"
  const currentYear = new Date().getFullYear();
  const parts = dateStr.split(", ")[1]?.split(" ");
  
  if (!parts || parts.length < 2) {
    return null;
  }
  
  const monthStr = parts[0];
  const day = parseInt(parts[1]);
  
  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  
  const month = monthMap[monthStr];
  if (month === undefined) return null;
  
  // Create date object
  let eventDate = new Date(currentYear, month, day);
  
  // If the date is in the past, assume it's next year
  const today = new Date();
  if (eventDate < today) {
    eventDate = new Date(currentYear + 1, month, day);
  }
  
  return eventDate;
};

export const getISODate = (dateStr) => {
  const date = parseEventDate(dateStr);
  if (!date) return null;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const getWeatherIcon = (code) => {
  if (code === 0) return "sun";
  if (code <= 3) return "cloud";
  if (code <= 67) return "rain";
  return "cloud";
};

export const getWeatherDescription = (code) => {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 67) return "Rainy";
  return "Cloudy";
};
