import { mockFileSystem } from "./mockData";

export async function getFolder(path: string) {
  console.log(`Fetching folder at: ${path}`);
  await delay(300); // эмуляция задержки сети
  const data = mockFileSystem[path];
  if (!data) throw new Error("Folder not found");
  return data;
}

export async function getFile(path: string) {
  console.log(`Fetching file at: ${path}`);
  await delay(300); // эмуляция задержки сети
  const fileName = path.split("/").pop();
  if (!fileName) throw new Error("Invalid file path");

  // Ищем файл в родительской папке
  const folderPath = path.substring(0, path.lastIndexOf("/")) || "/";
  const folder = mockFileSystem[folderPath];

  if (!folder || !folder.files.includes(fileName)) {
    throw new Error("File not found");
  }

  // Можно вернуть например текст файла или просто инфу
  return {
    name: fileName,
    content: `This is a mock content of ${fileName}.`,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
