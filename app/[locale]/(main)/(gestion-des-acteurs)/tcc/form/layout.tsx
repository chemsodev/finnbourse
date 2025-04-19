export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="shadow-inner rounded-md bg-gray-50">{children}</div>;
}
