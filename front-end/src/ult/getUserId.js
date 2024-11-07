import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
export const getUserId = (cookieName) => {
  console.log(cookieName);
  console.log("All cookie:", Cookie.get());
  try {
    const jwtCookie = Cookie.get(`${cookieName}`);
    console.log(jwtCookie);
    if (!jwtCookie) throw new Error("Cookie not find");
    const decode = jwtDecode(jwtCookie);
    console.log(decode);
    return decode.id;
  } catch (err) {
    console.log(err);
    return null;
  }
};
