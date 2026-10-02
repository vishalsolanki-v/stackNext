import CommonFilter from "@/components/filters/CommonFilter";
import SavedQuestions from "@/components/questions/SavedQuestions";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { getSavedQuestions } from "@/lib/actions/collection.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Collections = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentPageSize = Number(pageSize) || 10;

  const { success, data, error } = await getSavedQuestions({
    page: currentPage,
    pageSize: currentPageSize,
    query: query || "",
    filter: filter || "",
  });

  const { collection } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <SavedQuestions
        success={success}
        error={error}
        initialCollection={success ? collection || [] : []}
        initialIsNext={data?.isNext || false}
        page={currentPage}
        pageSize={currentPageSize}
        query={query}
        filter={filter}
      />
    </>
  );
};

export default Collections;
