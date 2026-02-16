export interface HomeViewProps {
  readonly queryValue: string;
  readonly onQueryChange: (value: string) => void;
  readonly onSendMessage: (text: string) => void;
}
