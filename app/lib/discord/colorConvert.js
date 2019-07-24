module.exports = {
  intToHex: (i) => {
    const bbggrr = ('000000' + i.toString(16)).slice(-6);
    const rrggbb = bbggrr.substr(4, 2) + bbggrr.substr(2, 2) + bbggrr.substr(0, 2);
    return `#${rrggbb}`;
  },
  hexToInt: (rrggbb) => {
    const bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
    return parseInt(bbggrr, 16);
  },
};
