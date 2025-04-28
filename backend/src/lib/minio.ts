import {db} from "@db/db";
import {sql} from "drizzle-orm";

export async function getPathByID(id: number): Promise<string> {
  try {
    const folders = await db.execute(sql`
    WITH RECURSIVE folder_path AS (
      SELECT id, name, parent_id
      FROM entries
      WHERE id = ${id}
    
      UNION ALL
    
      SELECT e.id, e.name, e.parent_id
      FROM entries e
      INNER JOIN folder_path fp ON e.id = fp.parent_id
    )
    SELECT name FROM folder_path;
  `);

    const namesPath = folders.rows.map(row => row.name).reverse();
    return namesPath.join("/");
  } catch (e) {
    console.error(e);
    return "/"
  }
}