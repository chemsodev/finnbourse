import React from "react";
import LocaleLink from "./LocaleLink";

const LocalesList = () => {
  return (
    <div className="rounded-md shadow-inner bg-white flex absolute z-50 ltr:right-0 rtl:left-0 -top-12 p-1">
      <LocaleLink locale="en" label="en" />
      <LocaleLink locale="fr" label="fr" />
      <LocaleLink locale="ar" label="ar" />
    </div>
  );
};

export default LocalesList;
