package internal

const (
	S_UP    = "up"
	S_DOWN  = "down"
	S_MAINT = "maint"
)

type ConfigSite struct {
	Name string `required:"true" json:"name" yaml:"name"`
	Url  string `required:"true" json:"url" yaml:"url"`
}

type ConfigNotifications struct {
	Smtp bool `default:"false" yaml:"smtp"`
}

type Config struct {
	Host          string              `required:"true" json:"host" yaml:"host"`
	Owner         string              `required:"true" json:"owner" yaml:"owner"`
	Repo          string              `required:"true" json:"repo" yaml:"repo"`
	Branch        string              `required:"true" json:"branch" yaml:"branch"`
	Sites         []ConfigSite        `required:"true" json:"sites" yaml:"sites"`
	Notifications ConfigNotifications `json:"notifications" yaml:"notifications"`
	WebsiteUrl    string              `json:"website_url" yaml:"website_url"`
	GithostUrl    string              `json:"githost_url" yaml:"githost_url"`
}

type ResultSite struct {
	Name         string
	Status       string
	ResponseTime int
	HttpCode     int
	Timestamp    string
}

type SiteStatusChange struct {
	Name          string
	ChangedToUp   bool
	ChangedToDown bool
	LaterThanN    bool
	First         bool
}

func (ssc *SiteStatusChange) ShouldWrite() bool {
	return ssc.ChangedToDown || ssc.ChangedToUp || ssc.LaterThanN || ssc.First
}

func (ssc *SiteStatusChange) ShouldNotify() bool {
	return ssc.ChangedToDown || ssc.ChangedToUp || ssc.First
}
