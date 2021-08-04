package internal

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const DELIMITER = ","
const LATER_THAN = 6 * time.Hour

const csvHeaders = "status,responseTime,httpCode,timestamp"

func WriteConfigJSON(config *Config) error {
	fp := filepath.Join("..", "data", "config.json")

	contents, err := json.Marshal(config)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(fp, contents, 0644)
	return err
}

func WriteAll(resultSites []*ResultSite) (bool, error) {
	hasAnyWitten := false
	for i, _ := range resultSites {
		resultSite := resultSites[i]
		hasWritten, err := write(resultSite)
		if err != nil {
			return false, err
		}
		if hasWritten {
			hasAnyWitten = true
		}
	}

	return hasAnyWitten, nil
}

func write(resultSite *ResultSite) (bool, error) {
	hasWritten := false
	csvData := strings.Join([]string{
		resultSite.Status,
		fmt.Sprint(resultSite.ResponseTime),
		fmt.Sprint(resultSite.HttpCode),
		resultSite.Timestamp,
	}, DELIMITER)

	fp := filepath.Join("..", "data", fmt.Sprintf("%s.csv", resultSite.Name))

	exists, finfo := isExists(fp)

	if exists {
		file, err := os.OpenFile(fp, os.O_APPEND|os.O_RDWR, 0644)
		if err != nil {
			return hasWritten, err
		}
		defer file.Close()

		// see if it is nessacary to write
		if !shouldWrite(file, finfo, resultSite.Timestamp, resultSite.Status) {
			return hasWritten, nil
		}

		// append the data on to the existing file
		s := fmt.Sprintf("\n%s", csvData)
		_, err = file.WriteString(s)
		if err != nil {
			return hasWritten, err
		} else {
			hasWritten = true
		}
	} else {
		// create file and write the csv headers then the first line of data
		file, err := os.OpenFile(fp, os.O_WRONLY|os.O_CREATE, 0644)
		if err != nil {
			return hasWritten, err
		}
		defer file.Close()

		s := fmt.Sprintf("%s\n%s", csvHeaders, csvData)
		_, err = file.WriteString(s)
		if err != nil {
			return hasWritten, err
		} else {
			hasWritten = true
		}
	}

	return hasWritten, nil
}

func shouldWrite(
	file *os.File,
	finfo *fs.FileInfo,
	currentTimestamp string,
	currentStatus string,
) bool {
	lastLine, err := readLastLine(file, finfo)
	if err != nil {
		fmt.Printf("Error: %r", err)
		return true
	}

	lastCsvData := strings.SplitN(lastLine, DELIMITER, 5)
	if len(lastCsvData) < 5 {
		fmt.Printf("Unable to read last entry: %s", lastLine)
		return true
	}

	lastStatusStr := lastCsvData[1]
	if lastStatusStr == "" {
		fmt.Printf("Last entry status is empty")
		return true
	}
	if lastStatusStr != currentStatus {
		return true
	}

	lastDateStr := lastCsvData[4]
	lastTime, err := time.Parse(time.RFC3339, lastDateStr)
	if err != nil {
		fmt.Printf("unable to parse date from last entry: %r", err)
		return true
	}

	currentTime, err := time.Parse(time.RFC3339, currentTimestamp)
	if err != nil {
		fmt.Printf("Unable to parse date from current entry: %r", err)
		return true
	}

	lastTimePlusNHours := lastTime.Add(LATER_THAN)
	isNotLaterThanNHours := currentTime.Before(lastTimePlusNHours)
	if isNotLaterThanNHours {
		return false
	}

	return true
}

func isExists(fp string) (bool, *fs.FileInfo) {
	finfo, err := os.Stat(fp)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
	}
	return true, &finfo
}

func readLastLine(file *os.File, finfo *fs.FileInfo) (string, error) {
	buf := make([]byte, 62)
	start := (*finfo).Size() - 62
	_, err := file.ReadAt(buf, start)
	if err != nil {
		return "", err
	}
	s := fmt.Sprintf("%s", buf)
	return s, nil
}
