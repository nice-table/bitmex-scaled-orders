import React from "react";
import Typography from "@material-ui/core/Typography";

export const Header = ({ as, ...props }) => (
  <Typography component={as} variant={as} {...props} />
);
