import { Header } from "@/components";
import { FC, PropsWithChildren } from "react";

const Template: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Template;
