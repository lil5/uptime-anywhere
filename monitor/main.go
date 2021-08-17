package main

import (
	"fmt"
	"os"

	flag "github.com/ogier/pflag"
	"li.last.nl/uppptime/internal"
)

func main() {
	// configurations from cli
	hasSMTP := flag.Bool("smtp", false, "Will try to email notifications using SMTP credentials")
	hasSlack := flag.Bool("slack", false, "Will try to slack notifications")
	flag.Parse()

	// configurations from config.yml
	config, err := internal.LoadConfig()
	if err != nil {
		fmt.Print(err)
		os.Exit(1)
	}
	envIsDev := os.Getenv("DEV") == "true"

	result := internal.CallAll(config.Sites)

	hasAnyWritten, sscList, err := internal.WriteAll(result)
	if err != nil {
		fmt.Print(err)
		os.Exit(1)
	}
	if !hasAnyWritten {
		os.Exit(0)
	}

	message, err := internal.BuildMessage(result, *sscList)
	if err != nil {
		fmt.Print(err)
		os.Exit(1)
	}

	if !envIsDev {
		err = internal.RunGit(message)
		if err != nil {
			fmt.Print(err)
			os.Exit(1)
		}
	} else {
		fmt.Println("Git will not run in dev mode")
	}

	internal.RunNotifications(config, message, *hasSMTP, *hasSlack)
}
