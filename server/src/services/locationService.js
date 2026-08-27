const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const geocodePlace = async (
  place,
  destination
) => {
  const query = `${place}, ${destination}`;

  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(query)}` +
    `&format=jsonv2` +
    `&limit=1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "SmartTripAI/1.0 educational-project",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to geocode ${place}`
    );
  }

  const data = await response.json();

  if (!data.length) {
    return null;
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
  };
};

export const addCoordinatesToItinerary =
  async (itinerary, destination) => {

    for (const day of itinerary.days || []) {

      for (const activity of day.activities || []) {

        try {
          const coordinates =
            await geocodePlace(
              activity.place,
              destination
            );

          if (coordinates) {
            activity.latitude =
              coordinates.latitude;

            activity.longitude =
              coordinates.longitude;
          }

        } catch (error) {

          console.error(
            `Location lookup failed for ${activity.place}:`,
            error.message
          );

          activity.latitude = null;
          activity.longitude = null;
        }

        // Respect public Nominatim usage limit
        await sleep(1100);
      }
    }

    return itinerary;
  };