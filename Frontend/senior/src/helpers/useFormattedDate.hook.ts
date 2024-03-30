const useFormattedDate = () => {
  const formatDate = (
    date: string | undefined,
    includeTime: boolean = false
  ) => {
    if (!date) return "";

    const originalDate = new Date(date);
    let formattedDate = "";

    if (includeTime) {
      const formattedTime = originalDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
      formattedDate += `${formattedTime} `;
    }

    formattedDate += originalDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  };

  return { formatDate };
};

export default useFormattedDate;
