import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo
} from "react";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

export const ThemeContext = React.createContext(null);

export const useThemeContext = () => useContext(ThemeContext);

const createTheme = palette =>
  createMuiTheme({
    palette: {
      type: palette
    },
    typography: {
      useNextVariants: true
    }
  });

export function ThemeProvider({ children }) {
  const [palette, setPalette] = useState(
    global.localStorage.getItem("palette") || "light"
  );

  const [theme, setTheme] = useState(() => createTheme(palette));

  const toggleDarkLightTheme = useCallback(() => {
    setPalette(s => (s === "light" ? "dark" : "light"));
  }, [setPalette]);

  useEffect(() => {
    setTheme(createTheme(palette));
    global.localStorage.setItem("palette", palette);
  }, [palette]);

  const themeValue = useMemo(
    () => ({
      theme: theme,
      palette,
      toggleDarkLightTheme
    }),
    [theme, palette, toggleDarkLightTheme]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <MuiThemeProvider theme={theme}>
        <StyledThemeProvider
          theme={{
            ...theme,
            breakpoints: ["576px", "768px", "992px", "1200px"]
          }}
        >
          {children}
        </StyledThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
