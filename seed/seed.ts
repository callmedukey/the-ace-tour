import { packages } from "@/db/schemas";
import { drizzle } from "drizzle-orm/neon-http";
import * as schemas from "@/db/schemas";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  const db = drizzle(process.env.DATABASE_URL as string, {
    schema: schemas,
  });

  await db.insert(packages).values([
    {
      id: "la-departure",
      ENGaccentText: "LA Departure",
      KOaccentText: "LA 출발",
      ENGfirstPoint: "Los Angeles",
      KOfirstPoint: "로스앤젤레스",
      ENGsecondPoint: "Santa Monica",
      KOsecondPoint: "산타모니카",
      ENGthirdPoint: "San Diego",
      KOthirdPoint: "샌디에이고",
      ENGprice: "$599",
      KOprice: "599달러",
      ENGbuttonText: "Book now",
      KObuttonText: "지금 예약하기",
      buttonLink: "/tours",
      mostPopular: true,
    },
    {
      id: "las-vegas-departure",
      ENGaccentText: "Las Vegas Departure",
      KOaccentText: "라스베가스 출발",
      ENGfirstPoint: "Las Vegas",
      KOfirstPoint: "라스베가스",
      ENGsecondPoint: "Las Vegas",
      KOsecondPoint: "라스베가스",
      ENGthirdPoint: "Las Vegas",
      KOthirdPoint: "라스베가스",
      ENGprice: "$599",
      KOprice: "599달러",
      ENGbuttonText: "Book now",
      KObuttonText: "지금 예약하기",
      buttonLink: "/tours",
      mostPopular: true,
    },
    {
      id: "semi-package",
      ENGaccentText: "Semi Package",
      KOaccentText: "세미패키지",
      ENGfirstPoint: "Los Angeles",
      KOfirstPoint: "로스앤젤레스",
      ENGsecondPoint: "Las Vegas",
      KOsecondPoint: "라스베가스",
      ENGthirdPoint: "San Diego",
      KOthirdPoint: "샌디에이고",
      ENGprice: "$599",
      KOprice: "599달러",
      ENGbuttonText: "Book now",
      KObuttonText: "지금 예약하기",
      buttonLink: "/tours",
      mostPopular: true,
    },
  ]);
};

seed();
