// Структура "папок" и "файлов"
export const mockFileSystem = {
  "/": {
    folders: ["b", "projects"],
    files: ["readme.txt", "welcome.pdf"],
  },
  "/b": {
    folders: ["images"],
    files: ["notes.docx"],
  },
  "/b/images": {
    folders: [],
    files: ["photo1.jpg", "photo2.png"],
  },
  "/projects": {
    folders: ["react", "nodejs"],
    files: [],
  },
  "/projects/react": {
    folders: [],
    files: ["app.jsx", "README.md"],
  },
  "/projects/nodejs": {
    folders: [],
    files: ["server.js", "package.json"],
  },
};
