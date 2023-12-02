import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

const Hero = () => {
  return (
    <div className="space-y-4 px-1 text-center sm:space-y-12">
      <div className="relative text-3xl font-semibold text-primary-foreground">
        <svg
          className="absolute left-1/2 top-0 -z-10
         h-[120%] w-[130%] -translate-x-1/2"
          width="390"
          height="100"
          viewBox="0 0 390 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.7313 23.391C109.247 17.6251 202.879 17.179 296.54 16.1553C297.212 16.148 331.206 14.1268 312.8 17.3748C288.651 21.6365 264.284 24.06 239.956 27.0495C165.808 36.1608 92.1668 51.1955 17.3573 51.1955C-61.7473 51.1955 175.566 51.1955 254.671 51.1955C276.866 51.1955 299.061 51.1955 321.255 51.1955C337.706 51.1955 354.07 50.2428 370.279 53.3093C385.217 56.1353 356.375 57.2669 353.288 57.6995C329.843 60.9835 306.503 64.7998 282.801 65.5855C259.326 66.3637 235.932 65.9662 212.476 67.618C173.892 70.3352 135.291 74.5097 96.7871 78.187C76.3725 80.1367 55.5268 79.0182 35.4871 83.4715C32.8341 84.061 40.8187 84.7132 43.5358 84.7722C63.5749 85.2079 83.6547 84.8535 103.698 84.8535C142.017 84.8535 180.336 84.8535 218.655 84.8535C262.079 84.8535 306.333 83.3902 349.385 83.3902"
            stroke="#008080"
            strokeWidth="30"
            strokeLinecap="round"
          />
        </svg>
        Talk Tide
      </div>
      <h1 className="text-4xl font-bold leading-normal text-primary sm:text-5xl sm:leading-none">
        <span className="relative isolate inline-block align-baseline">
          <svg
            className="absolute left-1/2 top-[70%] -z-10 w-full -translate-x-1/2"
            width="253"
            height="40"
            viewBox="0 0 253 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.2446 24.7346C13.0311 20.7503 37.0529 17.4177 40.1223 17.4177C49.6272 17.4177 58.4559 15.9543 67.9268 15.9543C85.4875 15.9543 103.048 15.9543 120.609 15.9543C160.142 15.9543 198.154 20.3445 237.68 20.3445"
              stroke="#008080"
              strokeWidth="20"
              strokeLinecap="round"
            />
          </svg>

          <span className=""> Connect </span>
        </span>{" "}
        With Your Favorite Ones
      </h1>
      <Link
        href="/chat"
        className={buttonVariants({ className: "text-[18px] ", size: "lg" })}
      >
        Connect Now
      </Link>
    </div>
  );
};

export default Hero;
