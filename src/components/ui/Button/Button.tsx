import clsx from 'clsx';
import { ButtonHTMLAttributes, FC } from 'react';

import classes from './styles.module.sass';

type TButton = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<TButton> = ({ children, className, ...props }) => {
  return (
    <button className={clsx(classes.btn, className)} {...props}>
      {children}
    </button>
  );
};
