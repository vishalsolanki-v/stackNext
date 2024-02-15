import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { getAllUsers } from '@/lib/actions/user.action'
import SharedFilter from '@/components/shared/SharedFilter';
import { UserFilters } from '@/constant/filters';
import Link from 'next/link';
import UserCard from '@/components/card/userCard';
import NoResult from '@/components/shared/NoResult';
import TagCard from '@/components/card/TagCard';
  
const Page = async () => {
    const result = await getAllTags({});
  return (
   <>
   <h1 className="h1-bold text-dark100_light900">All Tags</h1> 
                
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchBar
                    route="/tags"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search by tag..."
                    otherClasses="flex-1"
                />
                <SharedFilter filters={UserFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"
                    /> 
            </div>
          <section className='mt-12 flex flex-wrap gap-4'>
              {result?.tags?.length > 0 ? result?.tags?.map((tag) => (
                  <TagCard key={tag._id} tag={tag}/>
              )) : 
              <NoResult title="No Tags Found" description="It looks like there are no tags" link="/ask-question" linkTitle="Ask a Question"/>
              }
          </section>
   </>
  )
}

export default Page