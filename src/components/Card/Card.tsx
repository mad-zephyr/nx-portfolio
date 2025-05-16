import { FC } from "react";
import classes from "./styles.module.sass";
import Image from "next/image";

type TCard = {
  img: string;
};

export const Card: FC<TCard> = ({ img }) => {
  return (
    <div className={classes.card}>
      <div className={classes.inner}>
        <Image src={img} alt="" fill />
      </div>
    </div>
  );
};
