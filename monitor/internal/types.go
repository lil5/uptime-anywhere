package internal

const (
	S_UP    = "up"
	S_DOWN  = "down"
	S_MAINT = "maint"
)

type ConfigSite struct {
	Name string `required:"true"`
	Url  string `required:"true"`
}

type Config struct {
	Owner string       `required:"true"`
	Repo  string       `required:"true"`
	Sites []ConfigSite `required:"true"`
}

type ResultSite struct {
	Name        string
	Status      string
	RequestTime int
	HttpCode    int
	Timestamp   string
}
