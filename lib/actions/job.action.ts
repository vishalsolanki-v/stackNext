import {
  getFallbackCountries,
  getFallbackJobs,
} from "../fallback-data";

export const fetchLocation = async (): Promise<string> => {
  try {
    const response = await fetch("http://ip-api.com/json/?fields=country", {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return "United States";
    const location = await response.json();
    return location.country || "United States";
  } catch {
    return "United States";
  }
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name",
      { signal: AbortSignal.timeout(8000) }
    );
    if (!response.ok) return getFallbackCountries();
    const result: unknown = await response.json();
    if (!Array.isArray(result)) return getFallbackCountries();

    const countries = result.filter((country): country is Country => {
      if (!country || typeof country !== "object" || !("name" in country)) {
        return false;
      }
      const name = country.name;
      return Boolean(
        name &&
          typeof name === "object" &&
          "common" in name &&
          typeof name.common === "string"
      );
    });

    return countries.length ? countries : getFallbackCountries();
  } catch {
    return getFallbackCountries();
  }
};

export const fetchJobs = async (
  filters: JobFilterParams
): Promise<{ jobs: Job[]; isNext: boolean }> => {
  const { query, page } = filters;
  const fallback = getFallbackJobs(filters);
  const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;

  if (!apiKey) return fallback;

  const headers = {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  try {
    const url = new URL("https://jsearch.p.rapidapi.com/search");
    url.searchParams.set("query", query || "Software Engineer");
    url.searchParams.set("page", page || "1");

    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return fallback;

    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      !("data" in result) ||
      !Array.isArray(result.data)
    ) {
      return fallback;
    }

    const jobs = result.data.filter((job): job is Job => {
      if (!job || typeof job !== "object") return false;
      return (
        "job_title" in job &&
        typeof job.job_title === "string" &&
        job.job_title.length > 0
      );
    });
    if (jobs.length === 0) return fallback;

    return { jobs, isNext: jobs.length === 10 };
  } catch {
    return fallback;
  }
};
