import { prisma } from "@/db/prisma";

import NewsLatterCard from "./_mods/card";

export default async function AdminNewslettersPage() {
  const count = await prisma.$queryRaw`
    SELECT 
    (SELECT COUNT(*) FROM newsletters WHERE sent_at::date = CURRENT_DATE) AS today_count,
    (SELECT COUNT(*) FROM newsletters WHERE EXTRACT(YEAR FROM sent_at) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM sent_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS this_month_count,
    (SELECT COUNT(*) FROM newsletters) as total
  `;
  const nl = await prisma.newsletters.findMany({
    take: 100,
    orderBy: {
      sentAt: "desc",
    },
  });

  return <NewsLatterCard count={count ?? {}} dataSource={nl} />;
}
