import { redirect } from "next/navigation";

type UnlockPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function UnlockPage({ searchParams }: UnlockPageProps) {
  const params = await searchParams;
  const nextPath = params.next;

  if (nextPath) {
    redirect(`/?next=${encodeURIComponent(nextPath)}`);
  }

  redirect("/");
}
