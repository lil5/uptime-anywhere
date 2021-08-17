# Development

## File Structure

- `docs`: Markdown documentation about this prodject
- `monitor`: A golang cli applicaton
- `template-repo`: Location for built files to include in the release
- `website`: A [svelte js](https://svelte.dev/) application using [tailwindcss](https://tailwindcss.com/)
  Only the reactive parts of the application are rendered by svelte the loading html is directly written in `index.html`

## Start Developing

It is expected that you have installed **GoLang** and **NodeJS** on your computer.

### Installation

**1. Monitor**

1. Open a terminal in `./monitor`
2. Run `go get` to install dependencies
3. Then run `npm install` to install npm developer dependencies for hot reloads during development

**2. Website**

1. Open a terminal in `./website`
2. Run `npm install` to install dependencies

### Dev Environment (hot reloading)

**1. Monitor**

1. Open a terminal in `./monitor`
2. Run `npm run dev` to reload if something changes in `*.go` or in the config.json file.
   > `npm run start` runs the go program once.

**2. Website**

1. Open a terminal in `./website`
2. Run `npm run dev` to run website in [localhost:3000](http://localhost:3000/)

### Build

1. Open a terminal at the root of this project
2. Change dir to website `cd website`
3. Run `npm run build`
4. Change dir to monitor `cd ../monitor`
5. Run `npm run build`
6. The result is inside `template-repo`

## JavaScript Flow

```plantuml
start
:get `config.json`;
:get sites csv;
while(for each site)
  :find csv records
  till 1, 7 or 30 days ago;
  :calculate average milliseconds of 7 days;
  :calculate percentage uptime of 7 days;
endwhile
:html is loaded;
:generate html;
:generate chart;
stop

```
