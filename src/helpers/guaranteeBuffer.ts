export const guaranteeBuffer = (buffer: string | Buffer | ArrayBuffer) => {
  if (buffer instanceof ArrayBuffer) return Buffer.from(buffer);

  if (typeof buffer === "string") {
    return Buffer.from(
      buffer.replace(/^data:image\/[a-z]+;base64,/, ""),
      "base64"
    );
  }

  return buffer;
};
