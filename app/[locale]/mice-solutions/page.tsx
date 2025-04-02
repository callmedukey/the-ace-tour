import { MiceHero } from "./components/mice-hero";
import { setRequestLocale } from "next-intl/server";
import { MiceCards } from "./components/mice-cards";

export const revalidate = 604800;

const MICEPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  setRequestLocale((await params).locale);
  return (
    <main className="">
      <MiceHero />
      <MiceCards />
    </main>
  );
};

export default MICEPage;
