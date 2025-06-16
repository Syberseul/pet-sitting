export const getMaskedId = (id: string): string => {
  if (!id) return "";
  if (id.length <= 2) return id;
  return `${id[0]}******${id[id.length - 1]}`;
};

export const getDaysGap = (d1: string, d2: string): number => {
  try {
    const date1 = new Date(d1),
      date2 = new Date(d2);

    const timeDiff = Math.abs(date2.getTime() - date1.getTime());

    return Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  } catch (error) {
    return 0;
  }
};

export const exportDataAsCsv = (data: any[], baseFilename = "tours") => {
  if (!data || data.length === 0) {
    console.warn("No data needs to extract");
    return;
  }
  const getDatePrefix = () => {
    const validStartDates = data
      .map((item) => item.startDate)
      .filter((date) => date)
      .map((date) => new Date(date))
      .filter((date) => !isNaN(date.getTime()));

    if (validStartDates.length === 0) return "";

    const today = new Date();

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}_${month}_${year}`;
    };

    return `${formatDate(today)}_`;
  };

  const datePrefix = getDatePrefix();

  const collectFieldPaths = (obj: any, parentPath = ""): string[] => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        return collectFieldPaths(value, currentPath);
      }

      return [currentPath];
    });
  };

  const allFieldPaths = [
    ...new Set(data.flatMap((item) => collectFieldPaths(item))),
  ];

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : null;
    }, obj);
  };

  const valueToString = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value))
      return value.map((v) => valueToString(v)).join("; ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const exportToCsv = ({
    filename,
    headers,
    data,
  }: {
    filename: string;
    headers: string[];
    data: any[][];
  }) => {
    const escapeCsvValue = (val: any) => {
      if (val == null) return "";
      const str = String(val);
      return str.includes(",") ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const headerRow = headers.map(escapeCsvValue).join(",");
    const dataRows = data
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const csvContent = [headerRow, dataRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const headers = allFieldPaths.map((path) => {
    return path
      .split(".")
      .map((part) => part.replace(/([A-Z])/g, " $1"))
      .join(" ")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());
  });

  const content = data.map((item) => {
    return allFieldPaths.map((path) => {
      const value = getNestedValue(item, path);
      return valueToString(value);
    });
  });

  exportToCsv({
    filename: `${datePrefix}${baseFilename}.csv`,
    headers,
    data: content,
  });
};
