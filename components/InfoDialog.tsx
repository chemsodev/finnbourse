import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface InfoDialogProps {
  title: string;
  description: string;
  listItems?: string[];
}

const InfoDialog = ({
  title,
  description,
  listItems = [],
}: InfoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <AiOutlineInfoCircle
          size={20}
          className="text-primary group-hover:text-white"
        />
      </DialogTrigger>
      <DialogContent className="bg-primary border-none text-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-secondary group-hover:text-white text-center text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription>
            <div className="mt-8 ltr:text-left rtl:text-right text-lg text-white">
              {description}
            </div>
            {listItems.length > 0 && (
              <ul className="list-disc ml-6 my-4 ltr:text-left rtl:text-right text-lg text-white">
                {listItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
