type FileAttachment = {
  hash: string;
  filename: string;
  size: number;
  mimeType: string;
  url?: string | null;
  previewUrl?: string;
  cloudStorage?: string;
  cloudStorageId?: string;
};
