export const mergeArraysByUniqueKey = (
  existingArray: any[],
  newArray: any[],
  key: string,
) => {
  const map = new Map();

  // Add existing items to the map
  existingArray.forEach((item: any) => {
    map.set(item[key], item);
  });

  // Override with new items
  newArray.forEach((item: any) => {
    map.set(item[key], item);
  });

  // Convert back to array
  return Array.from(map.values());
};
