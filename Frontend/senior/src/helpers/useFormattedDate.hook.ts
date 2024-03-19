const useFormattedDate = () => {
  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    const originalDate = new Date(date);
    const formattedDate = originalDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  return { formatDate };
};

export default useFormattedDate;
