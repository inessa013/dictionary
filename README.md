# VocabTrainer 

A browser-based application for learning and practicing English vocabulary with Russian translations.

VocabTrainer allows users to create personal dictionaries, practice vocabulary through interactive tests, track their progress, and customize the interface.

## Link
 https://inessa013.github.io/dictionary/

 ## Status
**In development.**
VocabTrainer is a personal project built with vanilla JavaScript, HTML, and CSS.

## Features - Interface
- Dark and light themes.
- Persistent theme preferences.
- Sidebar navigation between application sections.
- Dynamic interface rendering using JavaScript.

## Technologies

- **HTML5** — application structure and semantic markup.
- **CSS3** — styling, layout, and themes.
- **JavaScript (ES6+)** — application logic, DOM manipulation, events, and ES modules.
- **JSON** — initial vocabulary data.
- **Web Storage API** — saving application data in `localStorage` and `sessionStorage`.
- **Fetch API** — loading vocabulary data.



### Prerequisites

- A modern web browser.
- Visual Studio Code.
- The Live Server extension for Visual Studio Code.

### Installation and Launch

1. Clone or download the repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension if it is not already installed.
4. Open `index.html`.
5. Click **Go Live** to launch the application in your browser.

A local HTTP server is required because the application loads JSON data using the Fetch API. Opening `index.html` directly through the `file://` protocol may prevent the data from loading correctly.

## Data Storage

VocabTrainer currently works on the client side without a backend.

- `localStorage` stores supported persistent data, including personal dictionaries and test statistics.
- `sessionStorage` can preserve the active application section during the current browser session.
- Initial vocabulary data is loaded from a JSON file.

Stored data remains in the browser and is not automatically synchronized between devices.

## Development Goals

The project focuses on building practical JavaScript skills through a real application, including:

- Modular JavaScript architecture.
- Working with arrays, objects, and JSON data.
- DOM manipulation and event handling.
- Dynamic rendering of application components.
- Form handling and input validation.
- Browser storage and data persistence.
- Managing application state and test logic.

## Future Improvements

- Complete and refine multiple-choice testing.
- Improve validation and error handling.
- Expand learning statistics and progress tracking.
- Improve accessibility and responsive design.
- Introduce a backend for account management and cross-device synchronization.
