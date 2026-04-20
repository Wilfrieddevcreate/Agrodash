import { CustomerDetail } from "@/components/customers/customer-detail";

export const metadata = { title: "Customer profile" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDetail id={id} />;
}
