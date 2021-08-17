package internal

import (
	"crypto/tls"
	"fmt"
	"os"
	"strconv"

	slack "github.com/ashwanthkumar/slack-go-webhook"

	gomail "gopkg.in/gomail.v2"
)

func RunNotifications(c *Config, message string, hasSMTP bool, hasSlack bool) {

	if hasSMTP {
		body := BuildMessageBody(c, M_HTML)
		ok := runSmtp(message, body)

		if !ok {
			fmt.Print("Email not sent!")
			os.Exit(1)
		}
	}

	if hasSlack {
		body := BuildMessageBody(c, M_MARKDOWN)
		ok := runSlack(fmt.Sprintf("%s\n\n%s", message, body))

		if !ok {
			fmt.Print("Slack not sent!")
			os.Exit(1)
		}
	}
}

func runSlack(msg string) (ok bool) {
	username := os.Getenv("SLACK_USERNAME")
	webhookUrl := os.Getenv("SLACK_WEBHOOK_URL")
	channel := os.Getenv("SLACK_CHANNEL")

	payload := slack.Payload{
		Text:     msg,
		Username: username,
		Channel:  channel,
	}
	err := slack.Send(webhookUrl, "", payload)
	if len(err) > 0 {
		fmt.Printf("error: %s\n", err)
	} else {
		ok = true
	}

	return ok
}

func runSmtp(title string, body string) (ok bool) {
	host := os.Getenv("SMTP_HOST")
	port, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	from := os.Getenv("SMTP_FROM")
	to := os.Getenv("SMTP_TO")

	if host == "" || port == 0 || user == "" || pass == "" || from == "" || to == "" || err != nil {
		return false
	}

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader(title)
	m.SetBody("text/html", body)

	d := gomail.NewDialer(host, port, user, pass)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	err = d.DialAndSend(m)

	return err == nil
}
