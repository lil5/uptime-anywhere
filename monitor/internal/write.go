package internal

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const DELIMITER = ","

const csvHeaders = "name,status,requestTime,httpCode,timestamp"

func WriteAll(resultSites []*ResultSite) error {
	for i, _ := range resultSites {
		resultSite := resultSites[i]
		err := write(resultSite)
		if err != nil {
			return err
		}
	}

	return nil
}

func write(resultSite *ResultSite) error {
	csvData := strings.Join([]string{
		resultSite.Name,
		fmt.Sprint(resultSite.Status),
		fmt.Sprint(resultSite.RequestTime),
		fmt.Sprint(resultSite.HttpCode),
		resultSite.Timestamp,
	}, DELIMITER)

	fp := filepath.Join("..", "data", fmt.Sprintf("%s.csv", resultSite.Name))

	exists := isExists(fp)

	if exists {
		// append the data on to the existing file
		file, err := os.OpenFile(fp, os.O_APPEND|os.O_WRONLY, 0644)
		if err != nil {
			return err
		}
		defer file.Close()

		s := fmt.Sprintf("\n%s", csvData)
		_, err = file.WriteString(s)
		if err != nil {
			return err
		}
	} else {
		// create file and write the csv headers then the first line of data
		file, err := os.OpenFile(fp, os.O_WRONLY|os.O_CREATE, 0644)
		if err != nil {
			return err
		}
		defer file.Close()

		s := fmt.Sprintf("%s\n%s", csvHeaders, csvData)
		_, err = file.WriteString(s)
		if err != nil {
			return err
		}
	}

	return nil
}

func isExists(fp string) bool {
	if _, err := os.Stat(fp); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}
