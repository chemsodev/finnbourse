import Link from "next/link";
import InfoDialog from "@/components/InfoDialog";
import { MarketCardProps } from "@/types/gestionTitres";

export default function MarketCard({
  title,
  description,
  listItems = [],
  href,
  Icon,
}: MarketCardProps) {
  return (
    <div className="w-52 h-52 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col cursor-pointer gap-2">
      <div className="block group-hover:hidden h-5" />
      <div className="hidden group-hover:flex ltr:justify-end w-full mr-8">
        <InfoDialog
          title={title}
          description={description}
          listItems={listItems}
        />
      </div>
      <Link href={href} className="flex flex-col gap-3 w-full h-36">
        <div className="font-bold text-lg text-primary group-hover:text-white text-center">
          {title}
        </div>
        <div className="flex justify-center">
          <Icon />
        </div>
      </Link>
    </div>
  );
}
