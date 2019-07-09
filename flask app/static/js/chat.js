$(document).ready(function () {

    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };

    $(function () {
        // Get input text from input box
        function getMessageText() {
            let $message_input = $('.message_input');
            return $message_input.val();
        }

        // Send user input to back end
        function sendToBackend(text) {
            let user_input = new Object();
            user_input.text = text;
            let data = JSON.stringify(user_input);

            $.ajax({
                url: "/sendjson",
                type: "POST",
                dataType: 'json',
                data: data,
                contentType: "application/json; charset=UTF-8"
            });
            $('.message_input').val('')
        }

        // Display message
        function displayMessage(text, message_side) {
            let $messages = $('.messages');

            let message = new Message({
                text: text,
                message_side: message_side
            });

            message.draw();

            $messages.animate({
                scrollTop: $messages.prop('scrollHeight')
            }, 300);
        }

        // Get the response from back end
        async function getResponse() {
            // let response_object = await d3.json(`/sendjson`);
            // let response = response_object["response"];
            let response_list = await d3.json(`/sendjson`);
            let response = response_list[0]["response"];
            let muscle = response_list[1]["info"];
            console.log(response);
            displayMessage(response, "left")
            console.log(response_list[1]["info"])
            showmuscle(muscle)
            showVideo(muscle)
        }

        // Generate a welcome response
        getResponse();

        // When user clicks on "Send" button
        $('.send_message').click(function () {

            displayMessage(getMessageText(), "right");
            sendToBackend(getMessageText());
            setTimeout(function () {
                getResponse()
            }, 1000)
            reset()

        });

        // When user hits "Enter"
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                displayMessage(getMessageText(), "right");
                sendToBackend(getMessageText());
                setTimeout(function () {
                    getResponse()
                }, 1000)
                reset()
            }
        });
    })

    function showmuscle(text) {
        var muscle = text

        // Identify SVG element from chatbot "info"
        var elem = synonyms(muscle);
        console.log(elem);

        // Check if multiple muscle groups are returned or if single, and highlight
        if (Array.isArray(elem)) {
            elem.forEach(function (element) {
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
            "Lower Legs", "Shoulders", "Upper Legs", "Back_muscles",
            "Glutes", "Hamstrings", "Calf", "Triceps"
        ];
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
        var back = ["back", "latissimus dorsi", "lats", "spinal erectors"];
        var arms = ["arms"];
        var biceps = ["guns", "pythons", "biceps brachii", "biceps"];
        var triceps = ["triceps", "triceps brachii"];
        var forearms = ["forearms"];
        var legs = ["legs"];
        var quads = ["upper legs", "top of leg", "quadriceps", "quads", "thighs", "biceps femoris"];
        var hams = ["back of legs", "hamstrings", "hammies"];
        var calves = ["lower legs", "calves", "soleus", "gastrocnemius"];
        var abs = ["abdomen", "abs", "six-pack", "stomach", "belly", "gut", "rectus abdominis", "external obliques", "obliques"];
        var glutes = ["gluteus maximus", "glutes", "butt"];


        if (shoulders.includes(input)) {
            return "Shoulders"
        } else if (delts.includes(input)) {
            return "Shoulders"
        } else if (traps.includes(input)) {
            return "Back_muscles"
        } else if (chest.includes(input)) {
            return "Chest"
        } else if (abs.includes(input)) {
            return "Abs"
        } else if (arms.includes(input)) {
            return ["Biceps", "Triceps", "Forearms"]
        } else if (biceps.includes(input)) {
            return "Biceps"
        } else if (forearms.includes(input)) {
            return "Forearms"
        } else if (calves.includes(input)) {
            return "Calf"
        } else if (quads.includes(input)) {
            return "Upper Legs"
        } else if (back.includes(input)) {
            return "Back_muscles"
        } else if (glutes.includes(input)) {
            return "Glutes"
        } else if (hams.includes(input)) {
            return "Hamstrings"
        } else if (triceps.includes(input)) {
            return "Triceps"
        } else if (upper.includes(input)) {
            return ["Chest", "Abs", "Biceps", "Forearms", "Shoulders", "Back_muscles", "Triceps"]
        } else if (legs.includes(input)) {
            return ["Lower Legs", "Upper Legs", "Glutes", "Hamstrings", "Calf"]
        };
    }

    function showVideo(text){
        var muscle = text 
        if (muscle === "delts"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/dumbbelllateralraise.mp4"
        }
        if (muscle === "traps"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/barbelluprightrow.mp4"
        }
        if (muscle === "pecs"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/reversegripbenchpress.mp4"
        }
        if (muscle === "lats"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/vbarpullup.mp4"
        }
        if (muscle === "spinal erectors"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/seatedcablerow.mp4"
        }
        if (muscle === "quads"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/sumosquat.mp4"
        }
        if (muscle === "hamstrings"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/legcurl.mp4"
        }
        if (muscle === "glutes"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/widesmithmachinesquat.mp4"
        }
        if (muscle === "soleus"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/standingonelegcalfraisewithdumbbell.mp4"
        }
        if (muscle === "calves"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/smithmachinecalfraise.mp4"
        }
        if (muscle === "abs"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/hangingkneeraise.mp4"
        }
        if (muscle === "obliques"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/dumbbellsidebend.mp4"
        }
        if (muscle === "biceps"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/alternatestandingdumbbellcurl.mp4"
        }
        if (muscle === "triceps"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/standingfrenchpress.mp4"
        }
        if (muscle === "forearms"){
            return  document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/wristroller.mp4"
        }
    }

}.call(this));