import React, { useState } from "react";
import { Flight } from "./api.ts";

export enum SortOrder {
  price,
  duration,
}

type FilterPanelProps = {
  priceFilter: number;
  setPriceFilter: (price: number) => void;
  airlineFilter: string;
  setAirlineFilter: (airline: string) => void;
  sortBy: SortOrder;
  setSortBy: (sortBy: SortOrder) => void;
  flights: Array<Flight>;
  selecteDayOfWeeks: Array<number>;
  setDayOfWeekFilter: (day: number) => void;
  onResetFilters?: () => void;
};

export default function FilterPanel(props: FilterPanelProps) {
  const {
    priceFilter,
    setPriceFilter,
    airlineFilter,
    setAirlineFilter,
    sortBy,
    setSortBy,
    flights,
    selecteDayOfWeeks,
    setDayOfWeekFilter,
    onResetFilters,
  } = props;

  const airlineToFlightsNo = flights.reduce(
    (acc, flight) => {
      return {
        ...acc,
        [flight.airline]: (acc[flight.airline] || 0) + 1,
      };
    },
    {} as Record<string, number>,
  );

  const handleRangeChange = (e: any) => setPriceFilter(e.target.value);

  const handleAirlineChange = (e: any) => setAirlineFilter(e.target.value);

  const options = [
    <option value="" key="all">
      All
    </option>,
  ];
  for (const key in airlineToFlightsNo) {
    options.push(
      <option
        value={key}
        key={key}
      >{`${key} (${pluralize(airlineToFlightsNo[key])})`}</option>,
    );
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        <button className="reset-filters-link" onClick={onResetFilters}>
          Reset
        </button>
      </div>

      <div className="filter-group">
        <label>Max Price: ${priceFilter || 2000}</label>
        <input
          type="range"
          min="0"
          max={2000}
          value={priceFilter || 2000}
          onChange={handleRangeChange}
        />
      </div>

      <div className="filter-group">
        <label>Airline:</label>
        <select value={airlineFilter} onChange={handleAirlineChange}>
          {options}
        </select>
      </div>

      <div className="filter-group">
        <label>Sort by:</label>
        <div className="sort-buttons">
          <button
            className={sortBy === SortOrder.price ? "active" : ""}
            onClick={() => setSortBy(SortOrder.price)}
          >
            Price
          </button>
          <button
            className={sortBy === SortOrder.duration ? "active" : ""}
            onClick={() => setSortBy(SortOrder.duration)}
          >
            Duration
          </button>
        </div>
      </div>

      <div className="filter-group">
        <label>Day of Week</label>
        <div className="day-of-week-selector">
          {daysOfWeek.map((_, index) => (
            <Pill
              day={index}
              onClick={setDayOfWeekFilter}
              isSelected={selecteDayOfWeeks.includes(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const Pill: React.FC<{
  day: number;
  isSelected: boolean;
  onClick: (day: number) => void;
}> = (props) => {
  const [isSelected, setSelected] = useState(props.isSelected);

  return (
    <span
      key={props.day}
      className={`day-pill ${isSelected ? "selected" : ""}`}
      onClick={() => {
        setSelected((prev) => !prev);
        props.onClick(props.day);
      }}
    >
      {daysOfWeek[props.day]}
    </span>
  );
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const pluralize = (no: number) => {
  if (no === 1) {
    return "1 flight";
  } else if (no > 1) {
    return `${no} flights`;
  }
  return `no flights`;
};
