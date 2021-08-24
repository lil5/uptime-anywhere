package internal

import (
	"crypto/tls"
	"net/http"
	"sync"
	"time"
)

const TIMEOUT = 3 * time.Second

func CallAll(sites []ConfigSite) []*ResultSite {
	var wg sync.WaitGroup
	cR := make(chan *ResultSite)
	for _, site := range sites {
		wg.Add(1)
		go callAsync(wg, cR, site)
	}

	results := []*ResultSite{}
	for range sites {
		result := <-cR
		results = append(results, result)
	}

	return results
}

func callAsync(wg sync.WaitGroup, c chan *ResultSite, site ConfigSite) {
	defer wg.Done()
	res := call(site)

	c <- res
}

func call(site ConfigSite) *ResultSite {
	status := S_DOWN
	method := http.MethodGet
	if isMethod(site.Method) {
		method = site.Method

	}
	request, _ := http.NewRequest(method, site.Url, nil)

	h := &http.Client{
		Timeout: TIMEOUT,
	}
	if site.Insecure {
		h.Transport = &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		}
	}
	if site.MaxResponseTime > 0 {
		h.Timeout = time.Duration(site.MaxResponseTime)
	}

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

func isMethod(m string) bool {
	switch m {
	case http.MethodGet, http.MethodHead, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodConnect, http.MethodOptions, http.MethodTrace:
		return true
	}
	return false
}
