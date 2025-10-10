export function joinCode(len = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // без 0/O/1/I
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random()*alphabet.length)];
  return s;
}
