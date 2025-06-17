import OrdresTable from "../gestion-des-ordres/OrdresTable";

const DashItem1 = async () => {
  return (
    <div className="md:w-[40%] h-full ">
      <OrdresTable pageType="dashboard" skip={0} searchquery="" state="99" />
    </div>
  );
};

export default DashItem1;
