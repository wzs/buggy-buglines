import { useEffect, useState } from "react";

interface SearchFormProps {
  origin: string;
  destination: string;
  date: string;
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  setDate: (date: string) => void;
  onSearch: () => void;
}

export const SearchForm = (props: SearchFormProps) => {
  const [origin, setOrigin] = useState<string>();
  const [destination, setDestination] = useState<string>();
  const [date, setDate] = useState<string>();
  const [isValid, setIsValid] = useState<boolean>();

  useEffect(() => {
    props.setOrigin(origin);
    props.setDestination(destination);
    props.setDate(date);

    if (origin && destination && date) {
      setIsValid(true);
    }
  }, [destination, origin, date]);

  return (
    <form
      className="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSearch();
      }}
    >
      <h2 className="search-form-title">Find Your Flight</h2>

      <div className="form-row">
        <OriginField origin={origin} setOrigin={setOrigin} />
        <DestinationField
          destination={destination}
          setDestination={setDestination}
        />
      </div>
      <DateField date={date} setDate={setDate} />

      <button type="submit" className="search-button" disabled={!isValid}>
        Search Flights
      </button>
    </form>
  );
};

export const OriginField = (props: {
  origin: string;
  setOrigin: (v: string) => void;
}) => (
  <div className="input-group">
    <label htmlFor="origin">From</label>
    <div className="input-wrapper">
      <input
        id="origin"
        value={props.origin}
        onChange={(e) => props.setOrigin(e.target.value)}
        placeholder="NYC"
      />
    </div>
  </div>
);

export const DestinationField = (props: {
  destination: string;
  setDestination: (v: string) => void;
}) => (
  <div className="input-group">
    <label htmlFor="destination">To</label>
    <div className="input-wrapper">
      <input
        id="destination"
        value={props.destination}
        onChange={(e) => props.setDestination(e.target.value)}
        placeholder="Las Vegas"
      />
    </div>
  </div>
);

export const DateField = (props: {
  date: string;
  setDate: (d: string) => void;
}) => {
  return (
    <div className="input-group">
      <label htmlFor="dateInput">From Date</label>
      <div className="input-wrapper">
        <input
          id="dateInput"
          type="date"
          value={props.date}
          onChange={(e) => {
            props.setDate(e.target.value);
          }}
          placeholder="MM/DD/YYYY"
        />
      </div>
    </div>
  );
};
