package internal

import (
	"fmt"
	"os/exec"
)

func RunGit(message string) error {
	err := runGitCommand([]string{"add", "public/data/"})
	if err != nil {
		return err
	}

	err = runGitCommand([]string{"commit", fmt.Sprintf("-m \"%s\"", message)})
	if err != nil {
		return err
	}

	err = runGitCommand([]string{"push", "origin"})
	if err != nil {
		return err
	}

	return nil
}

func runGitCommand(args []string) error {
	cmd := exec.Command("git", args...)

	err := cmd.Run()
	if err != nil {
		return err
	}
	return nil
}
