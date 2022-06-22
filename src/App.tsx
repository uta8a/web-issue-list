import { Card, CardContent, Link, Typography } from '@mui/material'
import type { Endpoints } from '@octokit/types'
import { useEffect, useState } from 'react'

type Issue = { title: string; url: string; labels: string[] }
type Repo = {
  name: string
  link: string
  lastCommitAt: string | undefined
  issues: Issue[]
}
type GithubError = {
  message: string
  documentation_url: string
}

export function App() {
  // HiCoder web会で取り組んでいる個人のプロジェクト一覧
  const repoData = [
    { owner: 'plageoj', name: 'fukagawa-coffee' },
    { owner: 'keigooooo1065', name: 'personal-blog' },
    { owner: 'kenty02', name: 'hukame' },
    { owner: 'ozhr', name: 'personal' },
    { owner: 'Zuaki21', name: 'Zuaki21.github.io' }
    // { owner: , name: }
  ]

  const [repos, setRepos] = useState<Repo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const repoList = []
      for (const repo of repoData) {
        const lastCommitAt = await getLastCommitTime(repo.owner, repo.name)
        const issues = await getIssueFromRepo(repo.owner, repo.name)
        repoList.push({
          name: `${repo.owner} / ${repo.name}`,
          link: `https://github.com/${repo.owner}/${repo.name}`,
          lastCommitAt,
          issues
        })
      }
      setRepos(repoList)
    }
    fetchData()
  }, [])

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          my: '20px',
          fontSize: {
            lg: 80,
            md: 60,
            sm: 40,
            xs: 30
          }
        }}>
        HiCoder web会 Issue List
      </Typography>
      {repos.map(repo => (
        <RepoCard {...repo} />
      ))}
      <Link
        href="https://github.com/uta8a/web-issue-list"
        sx={{
          float: 'right',
          mr: '20px',
          mb: '20px',
          fontSize: {
            lg: 45,
            md: 30,
            sm: 20,
            xs: 20
          }
        }}>
        GitHub Repository
      </Link>
    </>
  )
}

const RepoCard = (props: Repo) => {
  return (
    <Card
      variant="outlined"
      sx={{ mx: '20px', mb: '20px', backgroundColor: '#efffde' }}>
      <CardContent>
        <Typography
          variant="h2"
          sx={{
            mb: '10px',
            fontSize: {
              lg: 80,
              md: 60,
              sm: 40,
              xs: 30
            }
          }}>
          ✨{' '}
          <Link href={props.link} underline="hover">
            {props.name}
          </Link>
        </Typography>
        <Typography
          sx={{
            fontSize: {
              lg: 45,
              md: 30,
              sm: 20,
              xs: 20
            }
          }}>
          🕑 {props.lastCommitAt}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: {
              lg: 45,
              md: 30,
              sm: 20,
              xs: 20
            }
          }}>
          {props.issues.map(issue => {
            return (
              <div>
                #{' '}
                <Link href={issue.url} underline="hover">
                  {issue.title}
                </Link>
                {issue.labels.map(label => {
                  return (
                    <Typography
                      component="span"
                      sx={{
                        ml: '10px',
                        fontSize: {
                          lg: 45,
                          md: 30,
                          sm: 20,
                          xs: 20
                        }
                      }}>
                      {label}
                    </Typography>
                  )
                })}
              </div>
            )
          })}
        </Typography>
      </CardContent>
    </Card>
  )
}

const getLastCommitTime = async (owner: string, repo: string) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
  )

  if (response.status >= 200 && response.status < 300) {
    const data:
      | Endpoints['GET /repos/{owner}/{repo}/commits']['response']['data'] = await response.json()
    const commit = data[0].commit
    if (commit.author !== null && commit.author.date)
      return new Date(commit.author.date).toLocaleString()
    else return 'Unknown author'
  } else {
    const { message }: GithubError = await response.json()
    return message
  }
}

const getIssueFromRepo = async (owner: string, repo: string) => {
  const data: Endpoints['GET /repos/{owner}/{repo}/issues']['response']['data'] =
    await (
      await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`)
    ).json()
  return data.map(issue => {
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
