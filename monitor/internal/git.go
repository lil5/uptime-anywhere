package internal

import (
	"fmt"
	"os/exec"
	"strings"
)

func RunGit(result []*ResultSite) error {
	msg := buildMessage(result)

	err := runGitCommand([]string{"add", "data/*.csv"})
	if err != nil {
		return err
	}

	err = runGitCommand([]string{"commit", fmt.Sprintf("-m \"%s\"", msg)})
	if err != nil {
		return err
	}

	err = runGitCommand([]string{"push", "origin"})
	if err != nil {
		return err
	}

	return nil
}

func buildMessage(result []*ResultSite) string {
	isAllUp := true
	sitesDown := []string{}
	for i, _ := range result {
		site := result[i]
		if site.Status != S_UP {
			isAllUp = false
			sitesDown = append(sitesDown, site.Name)
			break
		}
	}

	if isAllUp {
		return "🟩 all sites are up"
	}

	sIsAre := "is"
	if len(sitesDown) > 1 {
		sIsAre = "are"
	}
	return fmt.Sprintf("🟥 %s %s down", strings.Join(sitesDown, ", "), sIsAre)
}

func runGitCommand(args []string) error {
	cmd := exec.Command("git", args...)

	err := cmd.Run()
	if err != nil {
		return err
	}
	return nil
}
