export default function sanitize(sn) {
  if (typeof sn === "number") {
    return sn;
  } else {
    return parseInt(sn.slice(0, -2));
  }
}
