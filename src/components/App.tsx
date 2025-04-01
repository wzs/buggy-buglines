import { useState, useEffect } from "react";
import "../App.css";
import { fetchUserData, fetchFlights, Flight, UserData } from "./api.ts";
import FilterPanel, { SortOrder } from "./FilterPanel.tsx";
import FlightsList from "./FlightsLists.tsx";
import { SearchForm } from "./SearchForm.tsx";
import BestDeals from "./BestDeals.tsx";
import _ from "lodash";

function App() {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [flights, setFlights] = useState<Array<Flight>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [priceFilter, setPriceFilter] = useState<number>(0);
  const [airlineFilter, setAirlineFilter] = useState<string>("");
  const [dayOfWeekFilter, setDayOfWeekFilter] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [sortBy, setSortBy] = useState<SortOrder>(SortOrder.price);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [userData, setUserData] = useState({
    currency: {
      symbol: "$",
      name: "USD",
      rate: 1,
    },
  } as UserData);

  const searchFlights = async () => {
    setLoading(true);

    const { flights } = await fetchFlights(origin, destination, date);

    if (!flights) {
      setFlights([]);
      return;
    }

    setFlights(flights);
    setLoading(false);
  };

  const handleDayFilterClick = (day: number) => {
    setDayOfWeekFilter((dayFilter) => {
      const index = dayFilter.indexOf(day);
      if (index > -1) {
        delete dayFilter[index];
      } else {
        dayFilter.push(day);
      }
      return dayFilter;
    });
  };

  const onResetFilters = () => {
    setPriceFilter(0);
    setAirlineFilter("");
    setDayOfWeekFilter([0, 1, 2, 3, 4, 5, 6]);
    setSortBy(SortOrder.price);
  };

  useEffect(() => {
    if (origin && destination && date) {
      searchFlights();
    }
  }, [origin, destination, date]);

  useEffect(() => {
    fetchUserData().then((userData) => {
      console.log({ userData });
      setUserData(userData);
    });
  }, []);

  useEffect(() => {
    const pricesSorted = flights.map((flight) => flight.price).sort();
    const maxPrice = pricesSorted[pricesSorted.length - 1] / 100;
    setPriceFilter(maxPrice);
  }, [flights]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth);
    });
  }, []);

  const filteredResults = _.filter(flights, (flight) => {
    return (
      (priceFilter ? flight.price / 100 <= priceFilter : true) &&
      (airlineFilter ? flight.airline === airlineFilter : true) &&
      (dayOfWeekFilter
        ? isNaN(Date.parse(flight.departureDate))
          ? true
          : dayOfWeekFilter.includes(
              new Date(Date.parse(flight.departureDate)).getDay(),
            )
        : true)
    );
  });
  _.sortBy(filteredResults, (flight) =>
    sortBy === SortOrder.price ? flight.price : flight.duration,
  );

  return (
    <div>
      <h1>✈ Buggy Buglines ✈</h1>
      <SearchForm
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        date={date}
        setDate={setDate}
        onSearch={searchFlights}
      />
      <div className={windowSize < 768 ? "content-small" : "content-big"}>
        <BestDeals />
        {filteredResults && (
          <FilterPanel
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            airlineFilter={airlineFilter}
            setAirlineFilter={setAirlineFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            flights={flights}
            selecteDayOfWeeks={dayOfWeekFilter}
            setDayOfWeekFilter={handleDayFilterClick}
            onResetFilters={onResetFilters}
          />
        )}
        {loading ? <p>Loading...</p> : null}

        <FlightsList
          flights={filteredResults}
          onResetFilters={flights.length > 0 ? onResetFilters : undefined}
          userData={userData}
        />
      </div>
    </div>
  );
}

export const formatDate = (
  dateString: string,
  showWeekday: boolean = false,
) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return showWeekday
    ? `${weekdays[date.getDay()]}, ${formattedDate}`
    : formattedDate;
};

export default App;
