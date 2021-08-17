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

type Config struct {
	Sites []ConfigSite `required:"true" json:"sites" yaml:"sites"`
	Url   string       `json:"url" yaml:"url"`
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
