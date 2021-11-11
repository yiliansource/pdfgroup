import { Container } from "@mui/material";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren<unknown>) {
    return <Container>{children}</Container>;
}
