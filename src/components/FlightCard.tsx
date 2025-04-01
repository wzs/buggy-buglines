import { useState, useEffect } from "react";

export default function FlightCard(props) {
  const [expanded, setExpanded] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(
      props.flight.price * 1.2 + (props.flight.airline === "Delta" ? 200 : 100),
    );
  }, [props]);

  return (
    <div className="flight-card" onClick={() => setExpanded(!expanded)}>
      <div className="flight-header">
        <h3>
          {props.flight.airline} ({props.flight.flightNumber})
        </h3>
        <span className="flight-price">
          {props.userData.currency.symbol +
            " " +
            (props.flight.price / 100) * props.userData.currency.rate}
        </span>
      </div>

      <div className="flight-info">
        <div>{props.flight.formattedDate}</div>
        <div>{props.flight.formattedDuration}</div>
        <div>
          {props.flight.origin} → {props.flight.destination}
        </div>
      </div>

      <div className={`flight-details ${expanded ? "" : "hidden"}`}>
        <span>
          Total (with fee): $
          {props.userData.currency.symbol +
            " " +
            (totalPrice / 100) * props.userData.currency.rate}
        </span>
        {props.flight.isHiddenCity && <span>Hidden-City</span>}
      </div>
    </div>
  );
}
