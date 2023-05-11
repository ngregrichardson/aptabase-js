export function newSessionId() {
  if (typeof crypto !== "undefined" && crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${randomString(8)}-${randomString(4)}-${randomString(
    4
  )}-${randomString(4)}-${randomString(12)}`;
}

const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
const charactersLength = characters.length;
function randomString(len: number) {
  let result = "";
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
