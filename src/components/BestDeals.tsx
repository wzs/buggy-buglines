import { useEffect, useState } from "react";
import { fetchBestDeals, Flight } from "./api.ts";
import { formatDate } from "./App.tsx";

const DealsList = (props: { bestDeals: Flight[] }) => {
  return (
    <div className="deals-list">
      {props.bestDeals.map((deal: Flight) => (
        <div key={deal.id} className="deal-card">
          <img
            src={`https://i.skiplagged.com/cities_640/${deal.destination.toLowerCase()}.jpg`}
            className="deal-image-placeholder"
            alt={`Image of ${deal.destination}`}
          />
          <div>
            <h3>
              {deal.destination}, {formatDate(deal.departureDate)}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

const BestDeals = () => {
  const [bestDeals, setBestDeals] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBestDeals()
      .then(({ bestDeals }) => {
        setBestDeals(bestDeals);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const DealsLoading = () => (
    <div>
      <p>Loading best deals...</p>
    </div>
  );

  return isLoading ? (
    <DealsLoading />
  ) : (
    <div className="best-deals">
      <h2>Best Deals</h2>
      <DealsList bestDeals={bestDeals} />
    </div>
  );
};

export default BestDeals;
