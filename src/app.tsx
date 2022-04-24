// @ts-ignore
import { Octokit } from 'https://cdn.skypack.dev/octokit' // browser
import { Endpoints } from '@octokit/types'
import { useEffect, useState } from 'preact/hooks'

export function App() {
  type Issue = { title: string; url: string; labels: string[] }
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const issues = await getIssueFromRepo('uta8a', 'grss')
      setIssues(issues)
    }
    fetchData()
  }, [])

  return (
    <>
      <p>HiCoder web会</p>
      <p>issue list</p>
      {issues.map(issue => {
        return (
          <>
            <a href={issue.url}>{issue.title}</a>
            {issue.labels.map(label => {
              return <p>{label}</p>
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
