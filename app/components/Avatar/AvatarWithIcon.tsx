/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Icons } from "../../icons/Icons";
import { Status } from "../Status";
import "./style.css";

interface Props {
  size: "large" | "extra-large" | "medium" | "small";
}

export const AvatarWithIcon = ({ size }: Props): JSX.Element => {
  return (
    <div className={`avatar-with-icon ${size}`}>
      <img
        className="profile-mask"
        alt="Profile mask"
        src={
          size === "large"
            ? "https://anima-uploads.s3.amazonaws.com/projects/64b14af317e3b2a0728b3aa2/releases/64b14bc1c6eacef1ee7ae8ab/img/profile-mask@2x.png"
            : size === "medium"
            ? "https://anima-uploads.s3.amazonaws.com/projects/64b14af317e3b2a0728b3aa2/releases/64b14bc1c6eacef1ee7ae8ab/img/profile-mask-24@2x.png"
            : size === "small"
            ? "https://anima-uploads.s3.amazonaws.com/projects/64b14af317e3b2a0728b3aa2/releases/64b14bc1c6eacef1ee7ae8ab/img/profile-mask-25@2x.png"
            : "https://anima-uploads.s3.amazonaws.com/projects/64b14af317e3b2a0728b3aa2/releases/64b14bc1c6eacef1ee7ae8ab/img/profile-mask-22@2x.png"
        }
      />
      <Status
        className={`${
          size === "large"
            ? "class-5"
            : size === "medium"
            ? "class-6"
            : size === "small"
            ? "class-7"
            : "class-4"
        }`}
        color={size === "extra-large" ? "game-chuu" : "online"}
        icon={
          size === "extra-large" ? (
            <Icons className="icons-instance" />
          ) : undefined
        }
        statusClassName={`${size === "large" && "class"} ${
          size === "medium" && "class-2"
        } ${size === "small" && "class-3"}`}
      />
    </div>
  );
};

AvatarWithIcon.propTypes = {
  size: PropTypes.oneOf(["large", "extra-large", "medium", "small"]),
};
