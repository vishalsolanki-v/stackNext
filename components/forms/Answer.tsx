"use client";
import React, { useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
interface AnswerT {
  authorId:string,
question:string,
questionId:string,
}
const Answer = ({authorId,questionId,question}:AnswerT) => {
  const pathname = usePathname()
  const [submitting, setSubmitting] = useState(false);
  const { mode } = useTheme()!;
  const editorRef = useRef(null);
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });
  const handleCreateAnswer = async (values:z.infer<typeof AnswerSchema>) => {
    // console.log("working");
    setSubmitting(true);
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      })
      form.reset();
      if(editorRef.current){
        const editor = editorRef.current as any;
        editor.setContent('');
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
    finally{
      setSubmitting(false)
    }
  };
  return (
    <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
      <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
      <Button className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500
      shadow-none dark:text-primary-500">
        <Image
        src="/assets/icons/stars.svg"
        alt="star"
        width={12}
        height={12}
        className="object-contain"
        onClick={()=>{}}
        />
        Generate an AI Answer
      </Button>
    </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "codesample",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | ",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Answer;
