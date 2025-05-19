import classes from "./styles.module.sass";

export const Header = () => {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>NX</div>

      <div className={classes.tag}>
        We create solutions <br /> that work for business
      </div>
    </header>
  );
};
