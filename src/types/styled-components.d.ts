import 'styled-components';
import { DefaultTokens } from '../styles/tokens';

declare module 'styled-components' {
  export interface DefaultTheme extends DefaultTokens {}
}
