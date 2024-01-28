"use client"
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { QuestionSchema } from '@/lib/validations'
import { Badge } from '../ui/badge';
import Image from 'next/image';


const type = 'edit'
const Question = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const editorRef = useRef(null);
    // 1. Define your form.
    const form = useForm<z.infer<typeof QuestionSchema>>({
        resolver: zodResolver(QuestionSchema),
        defaultValues: {
            title: "",
            explanation:'',
            tags: [],
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof QuestionSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
        setIsSubmitting(true)
        try {
            // add api 
        } catch (error) {
          
        }
        finally{
            setIsSubmitting(false)
        }
        console.log(values)
    }

    const generateTagsHandle = (e:React.KeyboardEvent<HTMLInputElement>,field:any) => {
        if(e.key === 'Enter' && field.name === 'tags'){
            e.preventDefault();
            const tagInput = e.target as HTMLInputElement;
            const tagValue = tagInput.value.trim();
            if(tagValue!==''){
                if(tagValue.length>15){
                    return form.setError('tags',{
                        type:'required',
                        message: 'Tag should be less than 15 characters',
                    })
                }
                if(!field.value.includes(tagValue as never)){
                    form.setValue('tags',[...field.value,tagValue]);
                    tagInput.value = '';
                    form.clearErrors('tags');
                }
                else{
                    form.trigger();
                }
            }
        }
    }
    const deleteTag = (tag:string,field:any)=>{
        const newTags = field.value.filter((t:string) => t!==tag);
        form.setValue('tags',newTags);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col'>
                            <FormLabel className='paragraph-semibold text-dark400_light800'>Title 
                                <span className='text-primary-500'>*</span></FormLabel>
                            <FormControl className='mt-3.5'>
                                <Input className='no-focus paragraph-regular background-light900_dark300 light-border-2
                text-dark300_light700 min-h-[56px] border' {...field} />
                            </FormControl>
                            <FormDescription className='body-regular mt-2.5 text-light-500'>
                                Be specific and imagine you are asking Question to another person.
                                This is your public display name.
                            </FormDescription>
                            <FormMessage className='text-red-500' />
                        </FormItem>
            
                    )}
                />
                <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='paragraph-semibold text-dark400_light800'>Detailed Explanation of your Problem 
                                <span className='text-primary-500'>*</span></FormLabel>
                            <FormControl className='mt-3.5'>
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                    onInit={(evt, editor) => {
                                        // @ts-ignore
                                        editorRef.current = editor}}
                                    initialValue=""
                                    init={{
                                        height: 350,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
                                            'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 
                                            'fullscreen', 'insertdatetime', 'media', 'table', 'codesample', 'wordcount',
                                        ],
                                        toolbar: 'undo redo | ' +
           'codesample bold italic forecolor | alignleft aligncenter ' +
           'alignright alignjustify | bullist numlist outdent indent | ',
                                        content_style: 'body { font-family:Inter; font-size:16px }'
                                    }}
                                />
                            </FormControl>
                            <FormDescription className='body-regular mt-2.5 text-light-500'>
                                IIntroduce the problem and expand on what you put in this title. Minimum 50 characters.
                            </FormDescription>
                            <FormMessage className='text-red-500' />
                        </FormItem>
            
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col'>
                            <FormLabel className='paragraph-semibold text-dark400_light800'>Tags 
                                <span className='text-primary-500'>*</span></FormLabel>
                            <FormControl className='mt-3.5'>
                                <>
                                    <Input className='no-focus paragraph-regular 
                                background-light900_dark300 light-border-2 text-dark300_light700 
                                 min-h-[56px] border' placeholder='Add tags...' onKeyDown={(e) => generateTagsHandle(e, field)} />
                                    {field.value.length > 0 && (
                                        <div className='flex-start mt-2.5 gap-2.5'> {field.value.map((tag) => (
                                            <Badge key={tag} className='subtle-medium background-light800_dark400
                                            text-dark400_light500 flex items-center justify-center gap-2 rounded-md
                                            border-none px-4 py-2 capitalize' onClick={(e)=>deleteTag(tag,field)}>
                                                {tag}
                                                <Image src="/assets/icons/close.svg"
                                                    alt='delete'
                                                    width={12}
                                                    height={12}
                                                    className='cursor-pointer object-contain invert-0 dark:invert'
                                                />
                                            </Badge>
                                        ))}</div>)}
                                </>
                            </FormControl>
                            <FormDescription className='body-regular mt-2.5 text-light-500'>
                                Add Upto 4 tags be specific about the tags.
                            </FormDescription>
                            <FormMessage className='text-red-500' />
                        </FormItem>
            
                    )}
                />
                <Button type="submit" className='primary-gradient w-fit !text-light-900' disabled={isSubmitting}>
                    {isSubmitting ? (<>{
                        type==='edit' ? 'Editing...':'Posting...'
                    }
                    </>):(<>{
                        type==='edit'? 'Edit Question':'Ask A Question'
                    }
                    </>)}
                </Button>
            </form>
        </Form>
    )
}

export default Question
