import 'styled-components';
import { Theme } from './styles/ThemeProvider';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
