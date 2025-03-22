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

  text: string[];
}

const InfoDialog = ({ title, text }: InfoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <AiOutlineInfoCircle
          size={20}
          className="text-primary group-hover:text-white"
        />
      </DialogTrigger>
      <DialogContent className=" bg-primary border-none text-white">
        <DialogHeader>
          <DialogTitle className="font-bold  text-orange-500 group-hover:text-white text-center text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription>
            <div className="mt-8 ltr:text-left rtl:text-right text-lg text-white">
              {text[0]}
            </div>
            <ul className=" list-disc ml-6 my-4 ltr:text-left rtl:text-right text-lg text-white">
              {text[1] && <li>{text[1]} </li>}
              {text[2] && <li>{text[2]} </li>}
              {text[3] && <li>{text[3]} </li>}
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
