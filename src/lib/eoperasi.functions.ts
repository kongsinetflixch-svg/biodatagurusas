
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parseEOperasiPDF } from "./eoperasi.server";

export const importEOperasiData = createServerFn({ method: "POST" })
  .inputValidator((data: any) => z.object({ 
    fileBase64: z.string(),
    fileName: z.string() 
  }).parse(data))
  .handler(async ({ data }) => {
    return await parseEOperasiPDF(data.fileBase64);
  });
