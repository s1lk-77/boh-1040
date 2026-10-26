// Support for standard side-effect or global imports
// e.g., import "./styles.css";
declare module "*.css";

// Support for CSS Modules
// e.g., import styles from "./styles.module.css";
type CSSModuleClasses = { readonly [key: string]: string };

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.module.css" {
  const classes: CSSModuleClasses;
  export default classes;
}
