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

  // Itinerary activities se
  // valid coordinates collect karte hain
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

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  // =========================
  // NO LOCATION DATA
  // =========================

  if (!places.length) {
    return (
      <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8">

        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Trip Locations
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Map unavailable
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Location coordinates are not available
          for the activities in this itinerary.
        </p>

      </section>
    );
  }

  const firstPlace = places[0];

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Trip Locations
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Your Trip Map
          </h2>

          <p className="mt-2 text-slate-500">
            Explore the locations included in
            your itinerary.
          </p>

        </div>

        <p className="text-sm font-medium text-slate-500">
          {places.length}{" "}
          {places.length === 1
            ? "location"
            : "locations"}
        </p>

      </div>


      {/* MAP */}

      <div className="h-[360px] overflow-hidden rounded-xl border border-slate-200 sm:h-[460px]">

        <MapContainer
          center={[
            firstPlace.latitude,
            firstPlace.longitude,
          ]}
          zoom={12}
          scrollWheelZoom={false}
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
              radius={8}
            >

              <Popup>

                <div className="min-w-40">

                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Day {place.day}
                  </p>

                  <p className="mt-1 font-bold">
                    {place.place}
                  </p>

                  {place.time && (
                    <p className="mt-2">
                      {place.time}
                    </p>
                  )}

                  <p className="mt-1">
                    Estimated cost: ₹
                    {formatCurrency(
                      place.estimatedCost
                    )}
                  </p>

                </div>

              </Popup>
            </CircleMarker>
          ))}

        </MapContainer>

      </div>

      <p className="mt-3 text-xs text-slate-400">
        Scroll zoom is disabled to make page
        navigation easier. Use the map controls
        to zoom.
      </p>

    </section>
  );
}

export default TripMap;