/**
 * 主题前缀
 */
import type { ThemeConfig } from 'antd'

import { Prefix } from '~/config/constants'

/**
 * Theme
 * @description 默认主题
 * @returns {ThemeConfig}
 */
const DefaultTheme: ThemeConfig = {
  cssVar: {
    prefix: Prefix,
  },
  token: {
    colorPrimary: '#18181B',
    colorPrimaryBg: '#f0f0f0',
    colorInfo: '#18181B',
    colorLink: '#00ADEA',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
    Button: {
      boxShadow: 'none',
      primaryShadow: 'none',
    },
    Select: {
      optionSelectedColor: '#18181B',
    },
    Menu: {
      itemSelectedColor: '#18181B',
      itemActiveBg: '#f0f0f0',
      itemSelectedBg: '#f0f0f0',
    },
    Steps: {
      navArrowColor: 'red',
    },
  },
}

export { DefaultTheme }
