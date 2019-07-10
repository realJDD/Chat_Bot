// Data from chatbot (currently sample data)
var data = [
  {
      "response": "OK! Show the location of the muscles for legs on the SVG!"
  },
  {
      "info": "upper legs",
      "tab": "location"
  }
]

// Function to highlight muscle groups
function showmuscle() {
  console.log(data[1]["info"]);
  // Input from the chatbot
  var muscle = data[1]["info"];

  // Identify SVG element from chatbot "info"
  var elem = synonyms(muscle);
  console.log(elem);

  // Check if multiple muscle groups are returned or if single, and highlight
  if (Array.isArray(elem)){
    elem.forEach(function(element) {
      console.log(element);
      document.getElementById(element).style.zIndex = 1;
    })
  } else {
    document.getElementById(elem).style.zIndex = 1;
  };

}

// Function to reset the SVG image on new chatbot input
function reset() {
  // Array of SVG parts that can be highlighted
  var svgParts = ["Chest", "Abs", "Biceps", "Forearms", 
              "Lower Legs", "delts", "rear_delts", "spine", "Upper Legs", "Back_muscles", 
              "Glutes", "Hamstrings", "Calf", "Triceps", "lats", "obliques", "traps"];

  // Loop through to change z-index to behind base image
  var i;
  for (i = 0; i < svgParts.length; i++) {
    document.getElementById(svgParts[i]).style.zIndex = -1;
}
}

// Function to isolate SVG element from chatbot output
function synonyms(input) {
  var upper = ["upper body"];
  var shoulders = ["shoulders"];
  var delts = ["deltoids", "delts"];
  var traps = ["trapezius", "traps"];
  var chest = ["chest", "breasts", "sternum", "pectorals", "pecs"];
  var back = ["back"];
  var spine = ["spinal erectors", "spine"];
  var lats = ["latissimus dorsi", "lats"];
  var arms = ["arms"];
  var biceps = ["guns", "pythons", "biceps brachii", "biceps"];
  var triceps = ["triceps", "triceps brachii"];
  var forearms = ["forearms"];
  var legs = ["legs"];
  var ulegs = ["upper legs", "top of legs"];
  var quads = ["quadriceps", "quads", "thighs", "biceps femoris"];
  var hams = ["back of legs", "hamstrings", "hammies"];
  var calves = ["lower legs", "calves", "soleus", "gastrocnemius"];
  var core = ["stomach", "belly", "gut"];
  var abs = ["abdomen", "abs", "six-pack", "rectus abdominis"];
  var obliques = ["external obliques", "obliques"];
  var glutes = ["gluteus maximus", "glutes", "butt"];


  if (shoulders.includes(input)){
    return ["rear_delts", "delts", "traps"] 
  } else if (delts.includes(input)){
    return ["rear_delts", "delts"]
  } else if (traps.includes(input)){
    return "traps"
  } else if (chest.includes(input)){
    return "Chest"
  } else if (core.includes(input)){
    return ["Abs", "obliques"]
  } else if (abs.includes(input)){
    return "Abs"
  } else if (obliques.includes(input)){
    return "obliques"
  } else if (arms.includes(input)){
    return ["Biceps", "Triceps", "Forearms"]
  } else if (biceps.includes(input)){
    return "Biceps"
  } else if (forearms.includes(input)){
    return "Forearms"
  } else if (calves.includes(input)){
    return "Calf"
  } else if (quads.includes(input)){
    return "Upper Legs"
  } else if (back.includes(input)){
    return "Back_muscles"
  } else if (spine.includes(input)){
    return "spine"
  } else if (lats.includes(input)){
    return "lats"
  } else if (glutes.includes(input)){
    return "Glutes"
  } else if (hams.includes(input)){
    return "Hamstrings"
  } else if (triceps.includes(input)){
    return "Triceps"
  } else if (upper.includes(input)){
    return ["Chest", "Abs", "Biceps", "Forearms", "Shoulders", "Back_muscles", "Triceps"]
  } else if (legs.includes(input)){
    return ["Lower Legs", "Upper Legs", "Glutes", "Hamstrings", "Calf"]
  } else if (ulegs.includes(input)){
    return ["Upper Legs", "Glutes", "Hamstrings"]
  };
}
