// Indian academic year: April -> March
const ACADEMIC_MONTHS = [
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March",
];

// April-December belong to the year the session starts in;
// January-March belong to the following calendar year.
const getAcademicYear = (month, sessionStartYear) => {
  const janToMar = ["January", "February", "March"];
  return janToMar.includes(month) ? sessionStartYear + 1 : sessionStartYear;
};

// Figures out which academic session "today" falls in
// (e.g. Feb 2027 belongs to the session that started April 2026).
const getCurrentSessionStartYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = Jan ... 11 = Dec
  return month < 3 ? year - 1 : year;
};

module.exports = { ACADEMIC_MONTHS, getAcademicYear, getCurrentSessionStartYear };