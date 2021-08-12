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

	"github.com/icza/backscanner"
)

const DELIMITER = ","
const LATER_THAN = 6 * time.Hour

const csvHeaders = "status,responseTime,httpCode,timestamp"

func WriteConfigJSON(config *Config) error {
	fp := filepath.Join("..", "data", "config.json")

	contents, err := json.MarshalIndent(config, "", "\t")
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(fp, contents, 0644)
	return err
}

func WriteAll(resultSites []*ResultSite) (bool, *[]*SiteStatusChange, error) {
	hasAnyWitten := false
	sscList := []*SiteStatusChange{}
	for i, _ := range resultSites {
		resultSite := resultSites[i]
		hasWritten, ssc, err := write(resultSite)
		if err != nil {
			return false, nil, err
		}
		if hasWritten {
			hasAnyWitten = true
			sscList = append(sscList, ssc)
		}
	}

	return hasAnyWitten, &sscList, nil
}

func write(resultSite *ResultSite) (bool, *SiteStatusChange, error) {
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
			return hasWritten, nil, err
		}
		defer file.Close()

		// see if it is nessacary to write
		ssc, err := getStatusChange(resultSite.Name, file, finfo, resultSite.Timestamp, resultSite.Status)
		if err != nil {
			return hasWritten, nil, err
		}

		if !ssc.ShouldWrite() {
			return hasWritten, nil, nil
		}

		// append the data on to the existing file
		s := fmt.Sprintf("\n%s", csvData)
		_, err = file.WriteString(s)
		if err != nil {
			return hasWritten, nil, err
		} else {
			hasWritten = true
			return hasWritten, ssc, nil
		}
	} else {
		// create file and write the csv headers then the first line of data
		file, err := os.OpenFile(fp, os.O_WRONLY|os.O_CREATE, 0644)
		if err != nil {
			return hasWritten, nil, err
		}
		defer file.Close()

		s := fmt.Sprintf("%s\n%s", csvHeaders, csvData)
		_, err = file.WriteString(s)
		if err != nil {
			return hasWritten, nil, err
		} else {
			hasWritten = true
			return hasWritten, &SiteStatusChange{
				Name:          resultSite.Name,
				First:         true,
				ChangedToUp:   resultSite.Status == "up",
				ChangedToDown: resultSite.Status != "up",
			}, nil
		}
	}
}

func getStatusChange(
	siteName string,
	file *os.File,
	finfo *fs.FileInfo,
	currentTimestamp string,
	currentStatus string,
) (*SiteStatusChange, error) {
	lastLine, err := readLastLine(file, finfo)
	if err != nil {
		return &SiteStatusChange{
			Name:  siteName,
			First: true,
		}, nil
	}

	lastCsvData := strings.SplitN(lastLine, DELIMITER, 4)
	if len(lastCsvData) < 4 {
		returnErr := fmt.Errorf("unable to read last entry: %s\nLength is %d but should be 4", lastLine, len(lastCsvData))
		return nil, returnErr
	}

	lastStatusStr := lastCsvData[0]
	if lastStatusStr == "" {
		fmt.Printf("last entry status is empty\nlastStatusStr: '%s'\n%v\n", lastStatusStr, lastCsvData)
		return &SiteStatusChange{
			Name:       siteName,
			LaterThanN: true,
		}, nil
	}
	if lastStatusStr != currentStatus {
		if currentStatus == "up" {
			return &SiteStatusChange{
				Name:        siteName,
				ChangedToUp: true,
			}, nil
		}

		return &SiteStatusChange{
			Name:          siteName,
			ChangedToDown: true,
		}, nil
	}

	lastDateStr := lastCsvData[3]
	lastTime, err := time.Parse(time.RFC3339, lastDateStr)
	if err != nil {
		returnErr := fmt.Errorf("unable to parse date from last entry: %r", err)
		return nil, returnErr
	}

	currentTime, err := time.Parse(time.RFC3339, currentTimestamp)
	if err != nil {
		returnErr := fmt.Errorf("unable to parse date from current entry: %r", err)
		return nil, returnErr
	}

	lastTimePlusNHours := lastTime.Add(LATER_THAN)
	isNotLaterThanNHours := currentTime.Before(lastTimePlusNHours)

	return &SiteStatusChange{
		Name:       siteName,
		LaterThanN: !isNotLaterThanNHours,
	}, nil
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

func readLastLine(f *os.File, stat *fs.FileInfo) (string, error) {
	scanner := backscanner.New(f, int((*stat).Size()))

	line, _, err := scanner.LineBytes()
	if err != nil {
		return "", err
	}

	return string(line), nil
}
