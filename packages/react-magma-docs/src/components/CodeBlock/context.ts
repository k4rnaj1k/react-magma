import React from 'react';
import { Language } from 'prism-react-renderer';

interface CodeBlockContextValue {
  language: Language;
  noRender: boolean;
  noCode: boolean;
  noCopy: boolean;
  noCodeSandbox: boolean;
  startExpanded: boolean;
  themeNameOverride?: string;
  title: string;
}
export const CodeBlockContext = React.createContext<CodeBlockContextValue>({
  language: 'typescript',
  title: 'Code Example',
  noCode: false,
  noCopy: false,
  noCodeSandbox: false,
  noRender: false,
  startExpanded: false,
  themeNameOverride: undefined,
});
