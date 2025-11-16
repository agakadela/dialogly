export default async function CompanionSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <div>CompanionSessionPage {id}</div>;
}
