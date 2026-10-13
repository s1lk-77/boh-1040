// Support for standard side-effect or global imports
// e.g., import "./styles.css";
declare module "*.css";

// Support for CSS Modules
// e.g., import styles from "./styles.module.css";
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
