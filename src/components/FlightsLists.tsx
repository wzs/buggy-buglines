import React from "react";
import { Flight, UserData } from "./api.ts";
import { formatDate } from "./App.tsx";
import FlightCard from "./FlightCard";

function FlightsList({
  flights,
  promoCode,
  onResetFilters,
  userData,
}: {
  flights: Array<Flight>;
  promoCode?: string;
  onResetFilters?: () => void;
  userData: UserData;
}) {
  if (!flights) {
    return (
      <p>
        No flights found.
        {onResetFilters && <a onClick={onResetFilters}>Reset filters</a>}
      </p>
    );
  }

  const processedFlights = flights.map((flight) => {
    return {
      ...flight,
      formattedDuration: `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`,
      formattedDate: formatDate(flight.departureDate, true),
    };
  });

  const hasHiddenCity =
    processedFlights.filter((flight) => flight.isHiddenCity).length > 0;

  return (
    <div className="flights-list">
      {hasHiddenCity && (
        <h2>${userData.name.toUpperCase()}, check hidden city offers!</h2>
      )}
      {processedFlights.map((flight, index) => (
        <FlightCard
          key={index}
          flight={flight}
          promo={promoCode}
          userData={userData}
        />
      ))}
    </div>
  );
}

const MemoizedFlightsList = React.memo(FlightsList, compareFlightsIds);
export default MemoizedFlightsList;

function compareFlightsIds(
  a: { flights: Array<Pick<Flight, "id">> },
  b: { flights: Array<Pick<Flight, "id">> },
) {
  return JSON.stringify(a.flights) === JSON.stringify(b.flights);
}
