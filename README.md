# Flask CSV to Excel Converter

A modern, premium-styled Flask web application that allows users to upload CSV files, preview the data in a responsive table, and convert them to Excel (.xlsx) format with a single click.

## Features

- **Drag & Drop Interface**: Easy file upload with a modern UI.
- **Instant Preview**: View the first 5 rows of your CSV data before converting.
- **One-Click Conversion**: Seamlessly convert CSVs to Excel files.
- **Conversion History**: Tracks your recent conversions locally.
- **Dark/Light Mode**: Toggle between themes for better visibility.
- **Responsive Design**: Works on various screen sizes.

## Prerequisites

- Python 3.7+
- pip (Python package manager)

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory:

    ```bash
    cd csv-to-excel-python
    ```

3. Create a virtual environment:

    ```bash
    python -m venv .venv
    ```

4. Activate the virtual environment:
    - **Windows**:

        ```bash
        .venv\Scripts\activate
        ```

    - **macOS/Linux**:

        ```bash
        source .venv/bin/activate
        ```

5. Install the dependencies:

    ```bash
    pip install -r requirements.txt
    ```

## Usage

1. Start the Flask application:

    ```bash
    python app.py
    ```

2. Open your web browser and go to:

    ```
    http://127.0.0.1:5000
    ```

3. Drag and drop a CSV file or click to browse.
4. Review the data preview.
5. Click **Convert & Download** to get your Excel file.

## Technologies

- **Backend**: Flask, Pandas, OpenPyXL
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with Glassmorphism effects, Google Fonts (Outfit)
