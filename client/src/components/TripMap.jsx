import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";

function FitMapToPlaces({ places }) {
  const map = useMap();

  useEffect(() => {
    if (!places.length) return;

    const bounds = places.map((place) => [
      place.latitude,
      place.longitude,
    ]);

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [map, places]);

  return null;
}

function TripMap({ trip }) {
  const places = [];

  trip.itinerary?.days?.forEach((day) => {
    day.activities?.forEach((activity) => {

      if (
        activity.latitude !== null &&
        activity.longitude !== null &&
        activity.latitude !== undefined &&
        activity.longitude !== undefined
      ) {
        places.push({
          ...activity,
          day: day.day,
        });
      }

    });
  });

  if (!places.length) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-7 shadow">
        <h2 className="text-2xl font-bold">
          🗺 Trip Map
        </h2>

        <p className="mt-3 text-slate-500">
          Location data is not available for this itinerary.
        </p>
      </div>
    );
  }

  const firstPlace = places[0];

  return (
    <div className="mt-8 rounded-2xl bg-white p-7 shadow">

      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">
          🗺 Your Trip Map
        </h2>

        <p className="mt-1 text-slate-500">
          Explore your planned locations
        </p>
      </div>

      <div className="h-[420px] overflow-hidden rounded-xl">

        <MapContainer
          center={[
            firstPlace.latitude,
            firstPlace.longitude,
          ]}
          zoom={12}
          className="h-full w-full"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitMapToPlaces places={places} />

          {places.map((place, index) => (
            <CircleMarker
              key={`${place.day}-${index}`}
              center={[
                place.latitude,
                place.longitude,
              ]}
              radius={9}
            >

              <Popup>
                <div>
                  <strong>
                    Day {place.day}: {place.place}
                  </strong>

                  <br />

                  {place.time}

                  <br />

                  ₹{place.estimatedCost}
                </div>
              </Popup>

            </CircleMarker>
          ))}

        </MapContainer>
      </div>

    </div>
  );
}

export default TripMap;