"use client";
import { ThemeProvider as NextThemeProvider } from "@teispace/next-themes";
import React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemeProvider>) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
