"use client";

import React from "react";
import { IconPrefix, Prefix } from "~/config/constants";
import { ConfigProvider } from "antd";

import { DefaultTheme } from "./config";

const withTheme = (props: { children: React.ReactNode }) => (
  <>
    <ConfigProvider
      prefixCls={Prefix}
      iconPrefixCls={IconPrefix}
      theme={DefaultTheme}
    >
      {props.children}
    </ConfigProvider>
  </>
);

export default withTheme;
