package internal

import (
	"net/http"
	"sync"
	"time"
)

// 2s
const TIMEOUT = 2000000000

func CallAll(sites []ConfigSite) []*ResultSite {
	h := &http.Client{
		Timeout: TIMEOUT,
	}

	var wg sync.WaitGroup
	cR := make(chan *ResultSite)
	for _, site := range sites {
		wg.Add(1)
		go callAsync(wg, cR, h, site)
	}

	results := []*ResultSite{}
	for range sites {
		result := <-cR
		results = append(results, result)
	}

	return results
}

func callAsync(wg sync.WaitGroup, c chan *ResultSite, h *http.Client, site ConfigSite) {
	defer wg.Done()
	res := call(h, site)

	c <- res
}

func call(h *http.Client, site ConfigSite) *ResultSite {
	status := S_DOWN
	request, _ := http.NewRequest(http.MethodGet, site.Url, nil)

	timer := time.Now()
	var resp *http.Response
	if request != nil {
		resp, _ = h.Do(request)
	}
	elapsed := time.Since(timer)

	httpCode := 0

	if resp != nil {
		httpCode = resp.StatusCode

		if ok := resp.StatusCode >= 200 && resp.StatusCode < 300; ok {
			status = S_UP
		}
	}

	result := ResultSite{
		Name:         site.Name,
		Status:       status,
		ResponseTime: int(elapsed.Milliseconds()),
		HttpCode:     httpCode,
		Timestamp:    getTimestampNow(),
	}

	return &result
}

func getTimestampNow() string {
	return time.Now().Format(time.RFC3339)
}
