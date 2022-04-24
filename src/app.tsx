// @ts-ignore
import { Octokit } from 'https://cdn.skypack.dev/octokit' // browser
import { Endpoints } from '@octokit/types'
import { useEffect, useState } from 'preact/hooks'

export function App() {
  // HiCoder web会で取り組んでいる個人のプロジェクト一覧
  const repoData = [
    { owner: 'plageoj', name: 'fukagawa-coffee' },
    { owner: 'keigooooo1065', name: 'personal-blog' }
    // { owner: , name: }
  ]

  type Issue = { title: string; url: string; labels: string[] }
  type Repo = { name: string; link: string; issues: Issue[] }

  const [repos, setRepos] = useState<Repo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const repoList = []
      for (const repo of repoData) {
        const issues = await getIssueFromRepo(repo.owner, repo.name)
        repoList.push({
          name: `${repo.owner} / ${repo.name}`,
          link: `https://github.com/${repo.owner}/${repo.name}`,
          issues
        })
      }
      setRepos(repoList)
    }
    fetchData()
  }, [])

  return (
    <>
      <p>HiCoder web会</p>
      <p>issue list</p>
      {repos.map(repo => {
        return (
          <>
            <h1>
              <a href={repo.link}>{repo.name}</a>
            </h1>
            {repo.issues.map(issue => {
              return (
                <div>
                  <a href={issue.url}>{issue.title}</a>
                  {issue.labels.map(label => {
                    return <p>{label}</p>
                  })}
                </div>
              )
            })}
          </>
        )
      })}
    </>
  )
}

const getIssueFromRepo = async (owner: string, repo: string) => {
  const octokit = new Octokit()
  const response: Endpoints['GET /repos/{owner}/{repo}/issues']['response'] =
    await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner,
      repo
    })
  return response.data.map(issue => {
    const labels: string[] = []
    for (const label of issue.labels) {
      if (typeof label !== 'string' && label.name !== undefined) {
        labels.push(label.name)
      }
    }
    return {
      title: issue.title,
      url: issue.html_url,
      labels: labels
    }
  })
}
