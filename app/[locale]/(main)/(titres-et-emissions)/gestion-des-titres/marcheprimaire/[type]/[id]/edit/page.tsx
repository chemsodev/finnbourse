import { CreateTitre } from "@/components/titres/CreateTitre";

export default function EditTitrePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <CreateTitre type="edit" />
    </div>
  );
}
