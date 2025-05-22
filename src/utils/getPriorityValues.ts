export function getPriorityValue(item: string) {
  switch (item) {
    case "High Priority Task":
      return "High";
    case "Medium Priority Task":
      return "Medium";
    case "Low Priority Task":
      return "Low";
    default:
      return "Unknown";
  }
}
