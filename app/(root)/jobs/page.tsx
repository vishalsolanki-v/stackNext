import type { Metadata } from "next";

import JobCard from "@/components/cards/JobCard";
import JobsFilter from "@/components/filters/JobFilter";
import Pagination from "@/components/Pagination";
import {
  fetchCountries,
  fetchJobs,
} from "@/lib/actions/job.action";

export const metadata: Metadata = {
  title: "Developer Jobs",
  description:
    "Explore developer job opportunities and discover roles from companies around the world.",
  alternates: { canonical: "/jobs" },
};

const Page = async ({ searchParams }: RouteParams) => {
  const { query, location, page } = await searchParams;
  const searchQuery = [query, location].filter(Boolean).join(", ");

  const { jobs, isNext } = await fetchJobs({
    query: searchQuery,
    page: page ?? "1",
  });

  const countries = await fetchCountries();
  const parsedPage = parseInt(page ?? 1);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="flex">
        <JobsFilter countriesList={countries} />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {jobs?.length > 0 ? (
          jobs
            ?.filter((job: Job) => job.job_title)
            .map((job: Job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later
          </div>
        )}
      </section>

      {jobs.length > 0 && <Pagination page={parsedPage} isNext={isNext} />}
    </>
  );
};

export default Page;
