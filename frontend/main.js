const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const scrren = $(".screen");

document.addEventListener("DOMContentLoaded", () => {
  $$("button").forEach((btn) => {
    const text = btn.innerText;
    switch (text) {
      case "AC":
        btn.addEventListener("click", (e) => {
          const oldText = scrren.innerText;
          scrren.innerText = oldText.substring(0, oldText.length - 1);
        });
        break;
      case "C":
        btn.addEventListener("click", (e) => {
          scrren.innerText = "";
        });
        break;

      case "=":
        btn.addEventListener("click", (e) => {
          const oldText = scrren.innerText
            .replace("/", "/div/")
            .replace("+", "/add/")
            .replace("-", "/sub/")
            .replace("*", "/mult/")
            .replace("%", "/mod/")
            .replace(".", "/dot/");
          window.location.pathname = `/${oldText}`;
        });
        break;

      default:
        btn.addEventListener("click", (e) => {
          if (scrren.innerText.charAt(scrren.innerText.length - 1) != text)
            scrren.innerText += text;
        });
        break;
    }
  });
  (() => {
    const { pathname } = window.location;
    if (pathname.includes("result/")) {
      scrren.innerText = pathname.split("result/")[1];
    }
  })();
});
