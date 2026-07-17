import { redirect } from "next/navigation";

export default function UsernamePage({
  params,
}: {
  params: { username: string };
}) {
  redirect(`/seller/${params.username}`);
}