import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { getAllUsers } from '@/lib/actions/user.action'
import SharedFilter from '@/components/shared/SharedFilter';
import { UserFilters } from '@/constant/filters';
import Link from 'next/link';
import UserCard from '@/components/card/userCard';
  
const Page = async () => {
    const result = await getAllUsers({});
  return (
   <>
   <h1 className="h1-bold text-dark100_light900">All Users</h1> 
                
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchBar
                    route="/community"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search by username..."
                    otherClasses="flex-1"
                />
                <SharedFilter filters={UserFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"
                    /> 
            </div>
          <section className='mt-12 flex flex-wrap gap-4'>
              {result?.Users?.length > 0 ? result?.Users?.map((user) => (
                  <UserCard key={user._id} user={user}/>
              )) : <div className='paragraph-regular text-darkk200_light800 mx-auto max-w-4xl text-center'>
                 <p> No users yet</p>
                 <Link href="/signup" className='mt-4 font-bold text-accent-blue'>Join to be the First Member</Link>
              </div>}
          </section>
   </>
  )
}

export default Page