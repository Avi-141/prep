function binary(n) {
  let str = String(n);
  if (str === "0") return "0";

  let bits = "";
  while (str !== "0") {
    let carry = 0, next = "";
    for (let i = 0; i < str.length; i++) {
      const cur = carry * 10 + Number(str[i]);
      const q = (cur / 2) | 0;
      carry = cur & 1;
      if (next.length || q) next += q;
    }
    bits = (carry ? "1" : "0") + bits;
    str = next || "0";
  }
  return bits;
}

function binary(decimal) {
	let result = "";
	if (decimal == 0) {
		result = "0";
	}
	while (decimal > 0) {
			result += decimal % 2;
			decimal = Math.floor(decimal/2);
		}
	return result.split("").reverse().join("");
}