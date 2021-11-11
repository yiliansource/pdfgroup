import { styled } from "@mui/system";

export function SplitPagePlaceholder() {
    return <Root sx={{ height: "187px", width: "127px" }}></Root>;
}

const Root = styled("div")({
    borderRadius: "6px",
    border: "2px dashed #ccc",
});
