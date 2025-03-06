"use client";

import { Country } from "@/interfaces/countries";
import { createContext, useContext, useEffect, useState } from "react";

type CountryStateType = {
  countries: {
    value: string;
    label: string;
    states: Record<string, string>[];
  }[];
};

const initialValues: CountryStateType = {
  countries: [],
};

const CountryStatesContext = createContext<CountryStateType>(initialValues);

export const CountryStatesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [countries, setCountries] = useState<
    { value: string; label: string; states: Record<string, string>[] }[]
  >([]);

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    const response = await fetch("/data/countries+states.json");
    const data = (await response.json()) as Country[];

    setCountries(
      data
        .filter((item) => item.states.length > 0)
        .map((country) => ({
          value: country.name,
          label: country.name,
          states: country.states,
        }))
    );
  };

  return (
    <CountryStatesContext.Provider value={{ countries }}>
      {children}
    </CountryStatesContext.Provider>
  );
};

export const useCountryStatesContext = () => useContext(CountryStatesContext);
