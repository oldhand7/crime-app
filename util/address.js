import axios from "axios";

export const getAddress = async (position) => {
  try {
    if (position.lat == null || position.long == null) return "unknown";
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.long}`
    );

    return response.data.display_name;
  } catch (error) {
    console.error("Error getting address:", error);
  }
};
