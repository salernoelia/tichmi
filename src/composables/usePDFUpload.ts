import { ref } from "vue";

export function usePDFUpload() {
  const isProcessing = ref(false);
  const error = ref<string | null>(null);

  async function uploadPDF(
    file: File
  ): Promise<{ data: string; mimeType: string } | null> {
    if (!file.type.includes("pdf") && !file.type.includes("document")) {
      error.value = "Only PDF and document files are supported";
      return null;
    }

    isProcessing.value = true;
    error.value = null;

    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      return {
        data: base64,
        mimeType: file.type,
      };
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to process file";
      console.error("PDF upload error:", err);
      return null;
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    isProcessing,
    error,
    uploadPDF,
  };
}
