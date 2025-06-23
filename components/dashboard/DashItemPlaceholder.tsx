const DashItemPlaceholder = ({ title }: { title: string }) => {
  return (
    <div className="p-6 border rounded-lg bg-white md:w-[40%]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="text-center text-gray-500">
        <p>Component temporarily disabled</p>
        <p className="text-sm">Resolving GraphQL issues</p>
      </div>
    </div>
  );
};

export default DashItemPlaceholder;
