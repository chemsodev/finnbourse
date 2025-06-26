import StaticOrdresTable from "./StaticOrdresTable";

const DashItem1 = () => {
  return (
    <div className="md:w-[40%] h-full ">
      <StaticOrdresTable pageType="dashboard" maxRows={5} />
    </div>
  );
};

export default DashItem1;
