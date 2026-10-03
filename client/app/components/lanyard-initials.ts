// "Rahul Panchal" -> "RP": shown on a card until there's a photo
export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
