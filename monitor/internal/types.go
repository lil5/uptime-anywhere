package internal

const (
	S_UP    = "up"
	S_DOWN  = "down"
	S_MAINT = "maint"
)

type ConfigSite struct {
	Name                string `json:"name" required:"true"`
	Url                 string `json:"url" required:"true"`
	Icon                string `json:"icon"`
	Method              string `json:"method"`
	MaxResponseTime     int    `json:"maxResponseTime"`
	Insecure            bool   `json:"insecure"`
	ExpectedStatusCodes []int  `json:"expectedStatusCodes"`
}

type Config struct {
	Sites []ConfigSite `json:"sites" required:"true"`
	Url   string       `json:"url"`
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
