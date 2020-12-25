/** * 是否为mac系统（包含iphone手机） * */
export const isMac = function () {
  return /macintosh|mac os x/i.test(navigator.userAgent);
};

/** * 是否为windows系统 * */
export const isWindows = function () {
  return /windows|win32/i.test(navigator.userAgent);
};
