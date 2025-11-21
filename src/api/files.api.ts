export const filesAxios = () => {
  const { $api } = useNuxtApp();
  return {
    uploadAvatar: (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return $api.post("/files/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    deleteAvatar: () => $api.delete("/files/avatar"),
  };
};
