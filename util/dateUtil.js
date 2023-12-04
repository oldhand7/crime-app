export const formattedDate = (date) => {
  return (
    new Date(date).getMonth() +
    1 +
    "." +
    new Date(date).getDate() +
    ". " +
    new Date(date).getHours() +
    ":" +
    new Date(date).getMinutes()
  );
};

export const isYesterdayOrToday = (date) => {
  let dt = new Date(date);
  if (
    dt.getDate() == new Date().getDate() ||
    dt.getDate() == new Date().getDate() - 1
  )
    return true;
  return false;
};

const getAddress = async (user) => {
  try {
    if (user.lat == null || user.long == null) setAddress("unknown");
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${user.lat}&lon=${user.long}`
    );

    return response.data.display_name;
  } catch (error) {
    console.error("Error getting address:", error);
  }
};
