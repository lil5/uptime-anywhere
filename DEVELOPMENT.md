# Development

## File Structure

- `monitor`: A NodeJS cli applicaton
- `public`: Location for built files to include for the webhost
- `website`: A [svelte js](https://svelte.dev/) application using [tailwindcss](https://tailwindcss.com/)
  Only the reactive parts of the application are rendered by svelte the loading html is directly written in `index.html`

## Start Developing

It is expected that you have installed **NodeJS** on your computer.

### Installation

**1. Monitor**

1. Open a terminal in `./monitor`
2. Run `npm install` to install dependencies

**2. Website**

1. Open a terminal in `./website`
2. Run `npm install` to install dependencies

### Dev Environment (hot reloading)

**1. Monitor**

1. Open a terminal in `./monitor`
2. Run `npm run dev` to runs the cli program.

**2. Website**

1. Open a terminal in `./website`
2. Run `npm run dev` to run website in [localhost:3000](http://localhost:3000/)

### Build

1. Open a terminal at the root of this project
2. Change dir to website `cd website`
3. Run `npm run ci`
4. Change dir to monitor `cd ../monitor`
5. Run `npm run ci:topublic`
6. The result is inside `public`

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
