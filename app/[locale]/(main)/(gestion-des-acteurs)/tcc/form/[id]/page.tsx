"use client";

import FormPage from "../page";

export default function EditFormPage({ params }: { params: { id: string } }) {
  return <FormPage params={params} />;
}
