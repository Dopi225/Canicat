export const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };
  
  export const getDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
  
    const diff = end - start;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  
    return days <= 0 ? 0 : days;
  };
  