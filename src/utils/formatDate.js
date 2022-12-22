export default function formatDate(dateObj) {
    if (!dateObj) {
      return null;
    }
    var date = new Date(dateObj);
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
  
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const output = `${day}/${month}/${year}`;
    return output;
}