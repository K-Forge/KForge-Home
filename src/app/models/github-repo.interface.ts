export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string; homepage: string | null; language: string | null;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
}
