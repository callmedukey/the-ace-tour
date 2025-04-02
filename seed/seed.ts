import { admin, packages } from "@/db/schemas";
import { drizzle } from "drizzle-orm/neon-http";
import * as schemas from "@/db/schemas";
import dotenv from "dotenv";
import { hashPassword } from "@/lib/utils/hashPassword";
import createSalt from "@/lib/utils/createSalt";

dotenv.config();

const seed = async () => {
  const db = drizzle(process.env.DATABASE_URL as string, {
    schema: schemas,
  });
  const foundPackages = await db.query.packages.findMany();
  const foundAdmin = await db.query.admin.findMany();

  if (foundAdmin.length > 0) {
    console.log("Admin already exists");
    return;
  } else if (foundAdmin.length === 0) {
    const { salt, hash } = await hashPassword("admin2025@", createSalt());
    await db.insert(admin).values({
      username: "admin",
      password: hash,
      salt,
    });
  }

  if (foundPackages.length > 0) {
    console.log("Packages already exist");
    return;
  } else if (foundPackages.length === 0) {
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
  }
};

seed();
