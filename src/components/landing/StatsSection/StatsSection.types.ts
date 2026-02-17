export interface StatItem {
  readonly value: string;
  readonly label: string;
}

export interface StatsSectionProps {
  readonly stats: ReadonlyArray<StatItem>;
  readonly className?: string;
  readonly id?: string;
}
