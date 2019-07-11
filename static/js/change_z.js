// Data from chatbot (currently sample data)
var data = [
  {
      "response": "OK! Show the location of the muscles for legs on the SVG!"
  },
  {
      "info": "upper body",
      "tab": "location"
  }
]

// Function to highlight muscle groups
function showmuscle() {
  // console.log(data[1]["info"]);
  // Input from the chatbot
  var muscle = data[1]["info"];

  // Identify SVG element from chatbot "info"
  var elem = synonyms(muscle);
  console.log(elem);

  // Check if multiple muscle groups are returned or if single, and highlight
  if (Array.isArray(elem)){
    elem.forEach(function(element) {
      console.log(element);
      // var x = document.getElementsByClassName(element);
      // x[0].style.fill = "red";
      var x = document.getElementsByClassName(element);
      var i;
      for (i = 0; i < x.length; i++) {
          x[i].style.fill = "red";
      }
    })
  } else {
    console.log(elem);
    var x = document.getElementsByClassName(elem);
    console.log(x);
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.fill = "red";
    }
    };

}

// Function to reset the SVG image on new chatbot input
function reset() {
  // Array of SVG parts that can be highlighted
  var svgParts = ["delt", "pecs", "biceps", "abs", "forearm",
                  "obliques", "quads", "low_leg", "calf", "traps",
                  "triceps", "lats", "spine", "hams", "glutes"]

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
  var low_legs = ["lower legs"];
  var quads = ["quadriceps", "quads", "thighs", "biceps femoris"];
  var hams = ["back of legs", "hamstrings", "hammies"];
  var calves = ["calves", "soleus", "gastrocnemius"];
  var core = ["stomach", "belly", "gut"];
  var abs = ["abdomen", "abs", "six-pack", "rectus abdominis"];
  var obliques = ["external obliques", "obliques"];
  var glutes = ["gluteus maximus", "glutes", "butt"];


  if (shoulders.includes(input)){
    return ["delt", "traps"] 
  } else if (delts.includes(input)){
    return ["delt"]
  } else if (traps.includes(input)){
    return "traps"
  } else if (chest.includes(input)){
    return "pecs"
  } else if (core.includes(input)){
    return ["abs", "obliques"]
  } else if (abs.includes(input)){
    return "abs"
  } else if (obliques.includes(input)){
    return "obliques"
  } else if (arms.includes(input)){
    return ["biceps", "triceps", "forearm"]
  } else if (biceps.includes(input)){
    return "biceps"
  } else if (forearms.includes(input)){
    return "forearm"
  } else if (calves.includes(input)){
    return "calf"
  } else if (quads.includes(input)){
    return "quads"
  } else if (back.includes(input)){
    return ["traps", "lats", "spine"]
  } else if (spine.includes(input)){
    return "spine"
  } else if (lats.includes(input)){
    return "lats"
  } else if (glutes.includes(input)){
    return "glutes"
  } else if (hams.includes(input)){
    return "hams"
  } else if (triceps.includes(input)){
    return "triceps"
  } else if (upper.includes(input)){
    return ["pecs", "abs", "obliques", "biceps", "forearm", "delt", "lats", "traps", "triceps"]
  } else if (legs.includes(input)){
    return ["quads", "low_leg", "glutes", "hams", "calf"]
  } else if (ulegs.includes(input)){
    return ["quads", "glutes", "hams"]
  } else if (low_legs.includes(input)){
    return ["low_leg", "calf"]
  };
}
