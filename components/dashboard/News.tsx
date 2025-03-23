"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface NewsProps {
  title: string;
  content: string;
}

const News = ({ title, content }: NewsProps) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="flex gap-2 p-3 border-b cursor-pointer hover:bg-gray-50 ltr:text-left rtl:text-right">
            <div className="flex flex-col ml-6">
              <div className="font-bold">{title}</div>
              <div className="text-gray-500 text-xs">
                {content.length > 200 ? `${content.slice(0, 200)}...` : content}
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-lg mb-6 text-primary group-hover:text-white text-center">
              {title}
            </DialogTitle>
            <DialogDescription>{content}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default News;
