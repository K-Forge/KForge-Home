export interface GithubMemberProject {
    repoName: string;
    repoUrl: string;
    commits: number;
    lastActivityAt: string;
}

export interface GithubMember {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    projects?: GithubMemberProject[];
    lastActivityAt?: string | null;
}
