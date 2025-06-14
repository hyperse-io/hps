import React from 'react';

export const Parent = ({ children }:any) => {
  const elmemts = [...children].filter((s) => s.type === 'div');
  return  <div>{elmemts}</div>;
};

