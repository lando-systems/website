const theme_attrib = "data-theme";
const theme_element = document.documentElement;

const set_theme = (theme) => {
  if (theme) {
    theme_element.setAttribute(theme_attrib, theme);
    localStorage.setItem(theme_attrib, theme);
  } else {
    // no theme specified, reset to default
    theme_element.removeAttribute(theme_attrib);
    localStorage.removeItem(theme_attrib);
  }
};

const theme_toggle_element = document.getElementById("theme-toggle");
theme_toggle_element.addEventListener("click", (event) => {
  const page_theme = theme_element.getAttribute(theme_attrib);
  const stored_theme = localStorage.getItem(theme_attrib);
  const theme = stored_theme ? stored_theme : page_theme;
  set_theme(theme === "dark" ? "light" : "dark");
});

const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
themeMedia.addEventListener("change", (event) => {
  // ignore system preference if there's already an override set on <html>
  const is_overridden = theme_element.getAttribute(theme_attrib);
  if (is_overridden) {
    return;
  }

  const prefers_dark = event.matches;
  set_theme(prefers_dark ? "dark" : "light");
});

// set initial theme based on localStorage or system preference
const initial_sys_pref = themeMedia.matches ? "dark" : "light";
const initial_theme = localStorage.getItem(theme_attrib) || initial_sys_pref;
set_theme(initial_theme);
