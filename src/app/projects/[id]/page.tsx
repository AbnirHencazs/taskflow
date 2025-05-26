import { redirect } from 'next/navigation';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  redirect(`/projects/${id}/list`);
}
