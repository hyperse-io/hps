import React from "react";

export const Time = React.memo(() => {
    return (
      <p>time {Date.now()}</p>
    );
  });