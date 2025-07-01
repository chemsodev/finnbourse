export default async function SecondaryMarketPage() {
  //   const t = await getTranslations("GestionDesTitres");

  return (
    <div className=" motion-preset-focus motion-duration-2000 ">
      <div className="mt-3 flex flex-col gap-4">{/* <MyMarquee /> */}</div>
      <div className="flex justify-center m-12 ">
        <h1 className="text-3xl font-bold text-primary  text-center md:ltr:text-left md:rtl:text-right">
          {/* {t("secondaryMarket")} */} Secondary market
        </h1>
      </div>
    </div>
  );
}
