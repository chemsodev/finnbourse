import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const PasserUnOrdreSkeleton = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-md border  w-1/2 flex gap-4 items-center p-2">
          <Skeleton className="h-8 w-8" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-24" />
            <Skeleton className="h-2 w-12" />
          </div>
        </div>
        <div className="rounded-md border  w-1/2 flex flex-col gap-10 items-center p-8 mt-4">
          <div className="flex justify-between w-full gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex justify-between w-full gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex justify-between w-full gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex justify-between w-full gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex justify-between w-full gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex justify-between w-full gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Separator />
          <div className="flex justify-between w-full gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="rounded-md border  w-1/2 flex flex-col gap-10 items-center p-4 h-12 mt-4"></div>
        <div className="flex justify-center w-full">
          <div className="flex justify-center w-1/2 gap-4">
            <div className="bg-gray-100 rounded-md w-32 h-12"></div>
            <div className="bg-primary rounded-md w-full h-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasserUnOrdreSkeleton;
