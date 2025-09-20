import React from "react";

export const Time = React.memo(() => {
    return (
      <p>iframe time {Date.now()}</p>
    );
  });