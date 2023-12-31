import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import RenderTags from '../RenderTags'

const DesktopRightbar = () => {
    const topQuetion=[
        {_id:1,title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
        { _id:2,title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' },
        {
            _id:3,title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            _id:4,title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            _id:5,title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        }
    ]
    const popularTags = [
        {_id:1,name:'Javascript',totalQuestions:35},
        {_id:2,name:'Next Js',totalQuestions:15},
        {_id:3,name:'React Js',totalQuestions:25},
        {_id:4,name:'Typescript',totalQuestions:10},
        {_id:5,name:'Redux',totalQuestions:5},
    ]
    return (
        <section className='custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0
        flex h-screen w-[350px] 
        flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none'>
            <div>
                <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
                <div className='mt-7 flex w-full flex-col gap-[30px]'>
                    {topQuetion.map((question)=>(
                        <Link href={`/questions/${question._id}`} key={question._id} className='flex cursor-pointer
    items-center justify-center gap-7'>
                            <p className='body-medium text-dark500_light700'>{question.title}</p>
                            <Image src="/assets/icons/chevron-right.svg" 
                                alt='chevron right' width={20} height={20} className='invert-colors'/>
                        </Link>
                    ))}
                </div>
            </div>
            <div className='mt-16'>
                <h3 className='h3-bold text-dark200_light900'>Top Tags</h3>
                <div className='mt-7 flex flex-col gap-4'>
                    {
                        popularTags.map((tag)=>(
                        
                            <RenderTags
                                key={tag._id}
                                _id={tag._id}
                                name={tag.name}
                                totalQuestions={tag.totalQuestions}
                                showCount/>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default DesktopRightbar
