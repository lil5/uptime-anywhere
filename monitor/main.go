package main

import (
	"li.last.nl/uppptime/internal"
)

func main() {
	config := internal.LoadConfig()

	result := internal.CallAll(config.Sites)

	err := internal.WriteAll(result)
	if err != nil {
		panic(err)
	}
}
