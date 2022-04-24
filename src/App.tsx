// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Octokit } from 'https://cdn.skypack.dev/octokit' // browser

import type { Endpoints } from '@octokit/types'
import { useEffect, useState } from 'react'
import { Card, Link, CardContent, Typography } from '@mui/material'

type Issue = { title: string; url: string; labels: string[] }
type Repo = { name: string; link: string; issues: Issue[] }

export function App() {
  // HiCoder web会で取り組んでいる個人のプロジェクト一覧
  const repoData = [
    { owner: 'plageoj', name: 'fukagawa-coffee' },
    { owner: 'keigooooo1065', name: 'personal-blog' }
    // { owner: , name: }
  ]

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
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          my: '20px',
          fontSize: {
            lg: 60,
            md: 40,
            sm: 30,
            xs: 20
          }
        }}>
        HiCoder web会 Issue List
      </Typography>
      {repos.map(repo => {
        return (
          <RepoCard
            link={repo.link}
            name={repo.name}
            issues={repo.issues}></RepoCard>
        )
      })}
      <Link
        href="https://github.com/uta8a/web-issue-list"
        sx={{
          float: 'right',
          mr: '20px',
          fontSize: {
            lg: 30,
            md: 20,
            sm: 15,
            xs: 10
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
              lg: 60,
              md: 40,
              sm: 30,
              xs: 20
            }
          }}>
          ✨{' '}
          <Link href={props.link} underline="hover">
            {props.name}
          </Link>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: {
              lg: 30,
              md: 20,
              sm: 15,
              xs: 10
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
                          lg: 30,
                          md: 20,
                          sm: 15,
                          xs: 10
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
