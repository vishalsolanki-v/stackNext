import HomeFilters from "@/components/Home/HomeFilters";
import QuestionCard from "@/components/card/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import SharedFilter from "@/components/shared/SharedFilter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constant/filters";
import { getQuestion } from "@/lib/actions/question.action";
import Link from "next/link";
import React from "react";


export default async function Home() {
    const result = await getQuestion({});
    const Questions = result?.questions;
    const defaultSubject = encodeURIComponent('Regarding your portfolio'); // Subject of the email
    const defaultMessage = encodeURIComponent('Hi Vishal,\n\n'); // Default message
    const linkedInUrl = 'https://www.linkedin.com/in/vishal-solanki2000';
   
    return (
        <>
                <p className='paragraph-regular text-dark200_light800 text-justify mb-5'>Hi their! i hope you are doing good, If you come across any issues, don't worry; this project is currently in progress. However, I've implemented several exciting features, including question posting, answering, upvoting and downvoting, view count tracking, saving questions, user profile pages, tags pages, collections, and a community section. The application is also fully responsive. Feel free to log in and explore these features. If you have any questions or feedback, please don't hesitate to reach out to me at <Link href={`mailto:vishalthakur2463@gmail.com?subject=${defaultSubject}&body=${defaultMessage}`} 
                className="text-blue-500">My Email</Link> or on <Link href={linkedInUrl} target="_blank" className="text-blue-500">Linkedin</Link> . Thank you.  </p>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Question</h1> 
                <Link href='/ask-question' className="flex justify-end max-sm:w-full">
                    <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                        Ask a Question
                    </Button>
                </Link>
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchBar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for Questions"
                    otherClasses="flex-1"
                />
                <SharedFilter filters={HomePageFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"
                    containerClasses="hidden max-md:flex"/> 
                
            </div>
            <HomeFilters/>
            <div className="mt-10 flex w-full flex-col gap-6 ">
                {Questions.length > 0 ? 
                    Questions.map((item)=>(
                        <QuestionCard key={item._id}
                            _id={item._id}
                            title={item.title}
                            tags={item.tags}
                            author={item.author}
                            upvotes={item.upvotes}
                            views={item.views}
                            answer={item.answer}
                            createdAt={item.createdAt}
                        />
                    )) : <NoResult title="There&apos;s no question to show" description="be the first to break the silence! 
                🚀 Ask a question and Kickstart the Discussion.our Query could be the next big thing others could learn from.
                 Get Involved! 💡" link="/ask-question" linkTitle="Ask A Question"/>}
            </div>
        </>
    )
}