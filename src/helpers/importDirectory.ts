import path = require("path");

const importFile = async (file: string) => {
  const { name, ext } = path.parse(file);

  if (name !== "index" && ext === ".ts") {
    const exports = await import(`./${file}`);

    return [name, exports] as const;
  }
};

export const importDirectory = async (dir: string) => {};
