const themeAttrib = "data-theme";
const themeElement = document.documentElement;

const setTheme = (theme) => {
  if (theme) {
    themeElement.setAttribute(themeAttrib, theme);
    localStorage.setItem(themeAttrib, theme);
  } else {
    // no theme specified, reset to default
    themeElement.removeAttribute(themeAttrib);
    localStorage.removeItem(themeAttrib);
  }
};

const themeToggleElem = document.querySelector(".color-scheme-toggle");
themeToggleElem.addEventListener("click", (event) => {
  const storedTheme = localStorage.getItem(themeAttrib);
  const currentTheme = themeElement.getAttribute(themeAttrib);
  const theme = storedTheme || currentTheme;
  setTheme(theme === "dark" ? "light" : "dark");
});

const themePrefMedia = window.matchMedia("(prefers-color-scheme: dark)");
themePrefMedia.addEventListener("change", (event) => {
  // ignore system preference if theme is already set on its container element
  const currentTheme = themeElement.getAttribute(themeAttrib);
  if (currentTheme) {
    return;
  }
  const prefersDark = event.matches;
  setTheme(prefersDark ? "dark" : "light");
});

// set initial theme based on localStorage or system preference
const initialSystemPref = themePrefMedia.matches ? "dark" : "light";
const initialTheme = localStorage.getItem(themeAttrib) || initialSystemPref;
setTheme(initialTheme);
