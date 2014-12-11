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
