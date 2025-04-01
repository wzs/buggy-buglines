export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string; //datetime
  duration: number; // in minutes
  price: number; //in cents
  aircraft: string;
  isHiddenCity: boolean;
}

type ResponseType = {
  success: boolean;
  flights?: Flight[];
  error?: string;
};

export const fetchFlights = (
  origin: string,
  destination: string,
  departDate: string,
) => {
  const url =
    "http://localhost:3001?from=" +
    origin +
    "&to=" +
    destination +
    "&depart=" +
    departDate;

  return fetch(url).then(
    (response) => response.json() as Promise<ResponseType>,
  );
};

export const fetchBestDeals = () => {
  // assume this is a different endpoint
  return fetchFlights("NYC", "ANY", "2025-10-10").then((res) => ({
    bestDeals: res.flights.slice(0, 3),
  }));
};

export type UserData = {
  name: string;
  currency: {
    symbol: string;
    name: string;
    rate: number;
  };
};

export const fetchUserData = () => {
  // assume this is a different endpoint
  return new Promise<UserData>((resolve) => {
    setTimeout(() => {
      resolve({
        name: "pawel",
        currency: {
          symbol: "€",
          name: "EUR",
          rate: 0.8,
        },
      });
    }, 1000);
  });
};
