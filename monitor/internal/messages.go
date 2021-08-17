package internal

import (
	"fmt"
	"strings"
)

const (
	e_UP   = "🟩"
	e_DOWN = "🟥"

	e_CHANGE  = "📝"
	e_CREATED = "🆕"
	e_TIMER   = "📅"
)

const (
	M_HTML     = 1
	M_MARKDOWN = 2
)

func BuildMessage(resultSites []*ResultSite, sscList []*SiteStatusChange) (string, error) {
	changedToUp := []string{}
	changedToDown := []string{}
	createdAndIsUp := []string{}
	createdAndIsDown := []string{}
	// noChangeAndIsUp := []string{}
	noChangeAndIsDown := []string{}

	for i, _ := range sscList {
		ssc := sscList[i]
		if ssc == nil {
			return "", fmt.Errorf("cannot find SiteStatusChange item\nindex: %d\narr: %v", i, sscList)
		}

		if ssc.First {
			if ssc.ChangedToUp {
				createdAndIsUp = append(createdAndIsUp, ssc.Name)
			} else {
				createdAndIsDown = append(createdAndIsDown, ssc.Name)
			}
		} else {
			if ssc.ChangedToUp {
				changedToUp = append(changedToUp, ssc.Name)
			} else if ssc.ChangedToDown {
				changedToDown = append(changedToDown, ssc.Name)
			} else {
				resultSite := resultSites[i]
				if resultSite.Status != "up" {
					noChangeAndIsDown = append(noChangeAndIsDown, ssc.Name)
				}
				// else {
				// 	noChangeAndIsUp = append(noChangeAndIsUp, ssc.Name)
				// }
			}
		}
	}

	changedToUpEmpty := len(changedToUp) == 0
	changedToDownEmpty := len(changedToDown) == 0
	createdAndIsUpEmpty := len(createdAndIsUp) == 0
	createdAndIsDownEmpty := len(createdAndIsDown) == 0
	// noChangeAndIsUpEmpty := len(noChangeAndIsUp) == 0
	noChangeAndIsDownEmpty := len(noChangeAndIsDown) == 0

	emoji := ""
	if changedToUpEmpty &&
		changedToDownEmpty &&
		createdAndIsUpEmpty &&
		createdAndIsDownEmpty {
		// if noChange is the only not empty
		emoji = e_TIMER
	} else if createdAndIsUpEmpty &&
		createdAndIsDownEmpty {
		// if changed is the only not empty
		emoji = e_CHANGE
	} else {
		// if there is one or more created
		emoji = e_CREATED
	}

	result := ""
	if changedToDownEmpty && createdAndIsDownEmpty && noChangeAndIsDownEmpty {
		result = fmt.Sprintf("%s%s all sites are up", e_UP, emoji)
	} else {
		isAre := grammerIsAre(len(createdAndIsDown))
		result = fmt.Sprintf("%s%s %s %s down", e_DOWN, emoji, strings.Join(createdAndIsDown, ", "), isAre)
	}
	return result, nil
}

func grammerIsAre(n int) string {
	result := "is"
	if n > 1 {
		result = "are"
	}

	return result
}

func BuildMessageBody(c *Config, m int) string {
	bodyTemplate := "For more information please go to the webste status page %s."

	linkTemplate := ""
	switch m {
	case M_HTML:
		linkTemplate = "<a href=\"%s\" alt=\"Status Webpage\">link</a>"
		break
	case M_MARKDOWN:
		linkTemplate = "[link](%s)"
	}

	websiteALink := ""
	if c.Url != "" && linkTemplate != "" {
		websiteALink = fmt.Sprintf(linkTemplate, c.Url)
	}

	return fmt.Sprintf(bodyTemplate, websiteALink)
}
