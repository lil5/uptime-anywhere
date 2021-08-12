# Website Structure

## Flow

```plantuml
start
:get `config.yml`;
:get sites csv;
while(for each site)
	:find csv records
	till 7 days ago;
	:calculate average milliseconds of 7 days;
	:calculate percentage uptime of 7 days;
endwhile
:html is loaded;
:generate html;
:generate chart;
stop

```
