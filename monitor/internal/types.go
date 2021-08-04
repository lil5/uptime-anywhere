package internal

const (
	S_UP    = "up"
	S_DOWN  = "down"
	S_MAINT = "maint"
)

type ConfigSite struct {
	Name string `required:"true" json:"name"`
	Url  string `required:"true" json:"url"`
}

type Config struct {
	Host   string       `required:"true" json:"host"`
	Owner  string       `required:"true" json:"owner"`
	Repo   string       `required:"true" json:"repo"`
	Branch string       `required:"true" json:"branch"`
	Sites  []ConfigSite `required:"true" json:"sites"`
}

type ResultSite struct {
	Name         string
	Status       string
	ResponseTime int
	HttpCode     int
	Timestamp    string
}
