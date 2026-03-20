import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const demoUsers = [
  {
    id: "u1",
    username: "student1",
    name: "Alex Student",
    email: "alex@school.edu",
    password: "demo123",
    role: "student" as const,
    grade: "8",
    classIds: ["c1"] as string[],
  },
  {
    id: "u2",
    username: "teacher1",
    name: "Sarah Jenkins",
    email: "sarah.j@school.edu",
    password: "demo123",
    role: "teacher" as const,
    grade: null,
    classIds: [] as string[],
  },
  {
    id: "u3",
    username: "admin1",
    name: "Dr. Admin",
    email: "admin@school.edu",
    password: "demo123",
    role: "admin" as const,
    grade: null,
    classIds: [] as string[],
  },
];

async function seed() {
  for (const user of demoUsers) {
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, user.username))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(usersTable).values(user);
      console.log(`✓ Seeded: ${user.username}`);
    } else {
      console.log(`  Already exists: ${user.username}`);
    }
  }
  console.log("Done!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
