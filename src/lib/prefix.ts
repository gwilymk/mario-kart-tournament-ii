import nextConfig from "../../next.config";

export const getImageUrl = (url: string) => `${nextConfig.basePath ?? ""}${url}`;
