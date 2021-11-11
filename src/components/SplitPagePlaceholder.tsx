import { styled } from "@mui/system";

export function SplitPagePlaceholder() {
    return <Root sx={{ height: "180px", width: "127px" }}></Root>;
}

const Root = styled("div")({
    borderRadius: "6px",
    flex: "0 0 127px",
    border: "2px dashed #ccc",
});
