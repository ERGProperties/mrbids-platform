import { redirect } from "next/navigation";

type Props = {
  params: {
    username: string;
  };
};

export default function LegacySellerPage({
  params,
}: Props) {
  redirect(`/${params.username}`);
}