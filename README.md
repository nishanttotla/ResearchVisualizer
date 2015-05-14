ResearchVisualizer
==================

A tool for visualizing and exploring research publications. Given the vast collection of research literature that exists and is being produced, searching for the right documents is a challenging problem. This is especially true for someone exploring a new area with little background. ResearchVisualizer aims to fix that by using visualization techniques to make the search process easy.

The tool stores publication metadata as a json file with the following schema:

{
  "id" : Int,
  "title" : String,
  "authors" : List<String>,
  "abstract" : String,
  "keywords" : Option[List<String>],
  "type" : Int,
  "venue" : String,
  "year" : Int
}

Type encodes the type of publication (0-conference, 1-journal, 2-book)

Citations are stored as links between papers

{
  "source" : Int,
  "target" : Int
}

Running locally:
Open a terminal and cd to the project directory. Then start a local server. A simply python server should suffice: python -m SimpleHTTPServer 8888

Then open your browser and go to
localhost:8888

This will open the index.html visualization.

Dependencies:
This tool uses the following Javascript libraries:
1. d3.js (http://d3js.org)
2. underscore.js (http://underscorejs.org/)
