import EditProjectPage from "./edit/page";

export default function PartnerProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditProjectPage params={params} />;
}