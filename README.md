ResearchVisualizer
==================

A tool for visualizing and exploring research publications. Given the vast collection of research literature that exists and is being produced, searching for the right documents is a challenging problem. This is especially true for someone exploring a new area with little background. ResearchVisualizer aims to fix that by using visualization techniques to make the search process easy.

The tool stores publication metadata as a json file with the following schema:

{
  "title" : String,
  "authors" : List<String>,
  "abstract" : String,
  "keywords" : Option[List<String>],
  "conference" : Option[String],
  "journal" : Option[String],
  "year" : Int
}

Citations are stored as links between papers

{
  "source" : Int,
  "target" : Int
}
