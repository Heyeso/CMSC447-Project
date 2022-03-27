# CMSC447 Project (Crime Data Visualizer)
## Getting Started

### Prerequisites

* npm - Download the latest version of Node.js at https://nodejs.org/en/download/

 * python - Douwnload the latest version of python at https://www.python.org/downloads/

### Installation (windows)

1. Clone the repo
   ```sh
   git clone https://github.com/Heyeso/CMSC447-Project.git
   ```
2. Install NPM packages
   ```sh
   cd client
   npm i
   ```
3. Install venv
    ```sh
    cd server
    py -3 -m venv venv
    ```
4. Install flask
    ```sh
    venv\Scripts\activate
    pip install Flask
    ```
### Run (windows)

1. Run server (Run whole application)
   ```sh
   cd client
   npm build
   ```
   ```sh
   cd server
   venv\Scripts\activate
   python server.py
   ```
2. Run client (only)
   ```sh
   cd client
   npm start
   ```
