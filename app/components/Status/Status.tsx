/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Icons1 } from "../../icons/Icons1";
import { Shape } from "../../icons/Shape";
import { Subtract } from "../../icons/Subtract";
import { Subtract1 } from "../../icons/Subtract1";
import "./style.css";

interface Props {
  color:
    | "online"
    | "invisible"
    | "offline"
    | "idle"
    | "matching-chuu"
    | "do-not-disturb"
    | "game-chuu";
  className: any;
  statusClassName: any;
  icon?: JSX.Element;
}

export const Status = ({
  color,
  className,
  statusClassName,
  icon = <Icons1 className="icons-1" />,
}: Props): JSX.Element => {
  return (
    <div className={`status ${className}`}>
      {["matching-chuu", "offline", "online"].includes(color) && (
        <div className={`div ${color} ${statusClassName}`} />
      )}

      {color === "idle" && <Shape className="instance-node" />}

      {color === "do-not-disturb" && <Subtract className="instance-node" />}

      {color === "invisible" && <Subtract1 className="instance-node" />}

      {color === "game-chuu" && (
        <>
          <div className="div-2" />
          {icon}
        </>
      )}
    </div>
  );
};

Status.propTypes = {
  color: PropTypes.oneOf([
    "online",
    "invisible",
    "offline",
    "idle",
    "matching-chuu",
    "do-not-disturb",
    "game-chuu",
  ]),
};
