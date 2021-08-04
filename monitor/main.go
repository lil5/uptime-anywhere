package main

import (
	"fmt"
	"os"

	"li.last.nl/uppptime/internal"
)

func main() {
	config := internal.LoadConfig()

	result := internal.CallAll(config.Sites)

	hasWritten, err := internal.WriteAll(result)
	if err != nil {
		fmt.Print(err)
		os.Exit(1)
	}
	if !hasWritten {
		os.Exit(0)
	} else {
		err = internal.WriteConfigJSON(config)
		if err != nil {
			fmt.Print(err)
			os.Exit(1)
		}
	}

	// err = internal.RunGit(result)
	// if err != nil {
	// 	fmt.Print(err)
	// 	os.Exit(1)
	// }
}
