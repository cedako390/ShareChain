import {db} from "@db/db";
import {sql} from "drizzle-orm";
import {minioClient} from "@db/minio";

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

export function generateDownloadUrl(bucket: string, objectKey: string, expires = 300) {
  return new Promise<string>((resolve, reject) => {
    minioClient.presignedGetObject(bucket, objectKey, expires, (err, url) => {
      if (err) return reject(err);
      resolve(url);
    });
  });
}
