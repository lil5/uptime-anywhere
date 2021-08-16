package main

import (
	"fmt"
	"os"

	"li.last.nl/uppptime/internal"
)

func main() {
	config := internal.LoadConfig()
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

	err = internal.WriteConfigJSON(config)
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

	internal.RunNotifications(config, message)
}
