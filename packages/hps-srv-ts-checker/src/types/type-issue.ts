type IssueSeverity = 'error' | 'warning';

interface IssuePosition {
  line: number;
  column: number;
}

interface IssueLocation {
  start: IssuePosition;
  end: IssuePosition;
}

export interface Issue {
  severity: IssueSeverity;
  code: string;
  message: string;
  file?: string;
  location?: IssueLocation;
}
