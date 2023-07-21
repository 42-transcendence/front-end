import PropTypes from "prop-types";
import React from "react";
import "./style.css";

interface Props {
  value: string;
  showCursor: boolean;
  state: "hover" | "typing" | "idle" | "disabled";
  shape: "pill" | "rounded-rect";
  className: any;
}

export const TextField = ({
  value = "Value",
  showCursor = true,
  state,
  shape,
  className,
}: Props): JSX.Element => {
  return (
    <div className={`text-field ${state} ${shape} ${className}`}>
      {["disabled", "idle"].includes(state) && (
        <div className="value">{value}</div>
      )}

      {["hover", "typing"].includes(state) && (
        <>
          <div className="cursor-and-value">
            {state === "typing" && (
              <>
                <div className="text-wrapper">{value}</div>
                <>{showCursor && <div className="cursor" />}</>
              </>
            )}

            {state === "hover" && <div className="highlight" />}
          </div>
          <div className="clear-button">
            {state === "typing" && <div className="clear">􀆄</div>}

            {state === "hover" && <>{value}</>}
          </div>
        </>
      )}
    </div>
  );
};

TextField.propTypes = {
  value: PropTypes.string,
  showCursor: PropTypes.bool,
  state: PropTypes.oneOf(["hover", "typing", "idle", "disabled"]),
  shape: PropTypes.oneOf(["pill", "rounded-rect"]),
};
