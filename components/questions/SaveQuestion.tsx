"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import {
  isDatabaseUnavailable,
  readBrowserValue,
  writeBrowserValue,
} from "@/lib/browser-db";

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const { data } = use(hasSavedQuestionPromise);
  const [hasSaved, setHasSaved] = useState(data?.saved ?? false);
  const storageKey = userId ? `saved:${userId}:${questionId}` : null;

  useEffect(() => {
    setHasSaved(data?.saved ?? false);
    if (!storageKey) return;
    readBrowserValue<boolean>(storageKey)
      .then((saved) => {
        if (saved !== null) setHasSaved(saved);
      })
      .catch(() => {});
  }, [data?.saved, storageKey]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast({
        title: "You need to be logged in to save a question",
        variant: "destructive",
      });

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) {
        if (isDatabaseUnavailable(error?.message) && storageKey) {
          const saved = !hasSaved;
          await writeBrowserValue(storageKey, saved);
          setHasSaved(saved);
          toast({
            title: saved
              ? "Question saved on this device"
              : "Question removed from this device",
          });
          return;
        }
        throw new Error(error?.message || "An error occurred");
      }

      const saved = data?.saved ?? !hasSaved;
      setHasSaved(saved);
      if (storageKey) writeBrowserValue(storageKey, saved).catch(() => {});

      toast({
        title: `Question ${saved ? "saved" : "unsaved"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
