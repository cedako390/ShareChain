import {db} from "@db/db";
import {usersTable} from "@db/schema";
import {eq} from "drizzle-orm";
import {UnauthorizedError} from "@core/erorrs";

export const authenticate = async (email: string, password: string) => {
  const adminResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1)

  const admin = adminResult[0]
  if (!admin) throw new UnauthorizedError()

  const isValid = await Bun.password.verify(password, admin.password)
  if (!isValid) throw new UnauthorizedError()

  return admin
}
