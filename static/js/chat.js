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
            response = response.replace(/\n/g, '<br>')
            let muscle = response_list[1]["info"];
            let tag = response_list[1]["tag"];
            console.log(response);
            displayMessage(response, "left")
            console.log(response_list[1]["info"])
            showmuscle(muscle)
            showVideo(muscle, tag)
            describeExercise(muscle, tag)
            console.log(tag)
        }

        // Generate a welcome response value.replace(\n, '<br>')
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
            "triceps", "lats", "spine", "hams", "glutes"
        ]

        // Loop through to change color of SVG to black
        var partsLoop;
        for (partsLoop = 0; partsLoop < svgParts.length; partsLoop++) {
            var clear = document.getElementsByClassName(svgParts[partsLoop]);
            console.log(clear);
            var j;
            for (j = 0; j < clear.length; j++) {
                console.log(clear[j]);
                clear[j].style.fill = "black";
            }
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


        if (shoulders.includes(input)) {
            return ["delt", "traps"]
        } else if (delts.includes(input)) {
            return ["delt"]
        } else if (traps.includes(input)) {
            return "traps"
        } else if (chest.includes(input)) {
            return "pecs"
        } else if (core.includes(input)) {
            return ["abs", "obliques"]
        } else if (abs.includes(input)) {
            return "abs"
        } else if (obliques.includes(input)) {
            return "obliques"
        } else if (arms.includes(input)) {
            return ["biceps", "triceps", "forearm"]
        } else if (biceps.includes(input)) {
            return "biceps"
        } else if (forearms.includes(input)) {
            return "forearm"
        } else if (calves.includes(input)) {
            return "calf"
        } else if (quads.includes(input)) {
            return "quads"
        } else if (back.includes(input)) {
            return ["traps", "lats", "spine"]
        } else if (spine.includes(input)) {
            return "spine"
        } else if (lats.includes(input)) {
            return "lats"
        } else if (glutes.includes(input)) {
            return "glutes"
        } else if (hams.includes(input)) {
            return "hams"
        } else if (triceps.includes(input)) {
            return "triceps"
        } else if (upper.includes(input)) {
            return ["pecs", "abs", "obliques", "biceps", "forearm", "delt", "lats", "traps", "triceps"]
        } else if (legs.includes(input)) {
            return ["quads", "low_leg", "glutes", "hams", "calf"]
        } else if (ulegs.includes(input)) {
            return ["quads", "glutes", "hams"]
        } else if (low_legs.includes(input)) {
            return ["low_leg", "calf"]
        };
    }

    function showVideo(muscle, tag) {
        if (tag == "exercise") {
            return function () {
                window.location = '#jumpHere';
                if (muscle == "deltoids") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/dumbbelllateralraise.mp4"
                }
                if (muscle == "delts") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/dumbbelllateralraise.mp4"
                }
                if (muscle == "trapezius") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/barbelluprightrow.mp4"
                }
                if (muscle == "traps") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/barbelluprightrow.mp4"
                }
                if (muscle == "pectorals") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/reversegripbenchpress.mp4"
                }
                if (muscle == "pecs") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/reversegripbenchpress.mp4"
                }
                if (muscle == "latissimus dorsi") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/vbarpullup.mp4"
                }
                if (muscle == "spinal erectors") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/seatedcablerow.mp4"
                }
                if (muscle == "quadriceps") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/sumosquat.mp4"
                }
                if (muscle == "biceps femoris") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/legcurl.mp4"
                }
                if (muscle == "hamstrings") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/legcurl.mp4"
                }
                if (muscle == "hammies") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/reversehacksquat.mp4"
                }
                if (muscle == "gluteus maximus") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/widesmithmachinesquat.mp4"
                }
                if (muscle == "glutes") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/widesmithmachinesquat.mp4"
                }
                if (muscle == "soleus") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/standingonelegcalfraisewithdumbbell.mp4"
                }
                if (muscle == "gastrocnemius") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/smithmachinecalfraise.mp4"
                }
                if (muscle == "calves") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/smithmachinecalfraise.mp4"
                }
                if (muscle == "abs") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/hangingkneeraise.mp4"
                }
                if (muscle == "rectus abdominis") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/hangingkneeraise.mp4"
                }
                if (muscle == "external obliques") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/dumbbellsidebend.mp4"
                }
                if (muscle == "obliques") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/dumbbellsidebend.mp4"
                }
                if (muscle == "biceps") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/alternatestandingdumbbellcurl.mp4"
                }
                if (muscle == "biceps brachii") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/alternatestandingdumbbellcurl.mp4"
                }
                if (muscle == "triceps") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/standingfrenchpress.mp4"
                }
                if (muscle == "triceps brachii") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/standingfrenchpress.mp4"
                }
                if (muscle == "forearms") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/wristroller.mp4"
                }
            }()
        }
    }

    function describeExercise(muscle, tag) {
        if (tag == "exercise") {
            return function () {
                if (muscle == "deltoids") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Dumbbell Lateral Raise Instructions</strong></h5><br>1. The dumbbell lateral raise is a good exercise for building width in your upper body which gives you the V shape. Grab a set of dumbbells and stand straight up with the dumbbells at your sides.<br>2. Your palms should be facing your body. You should be holding the dumbbells slightly off your body, as this keeps the tension on the side delts. This is your starting position for the exercise.<br>3. To execute, slowly raise the dumbbells up to around shoulder height. It's important that you do not let your wrists go above your elbows while raising the weight, as this will take the work off the side delts and put it on the front delts.<br>4. Pause at the top of the movement, and then slowly lower the weight back to the starting position.<br>5. Do not let the dumbbells touch your body, and then raise them for the next rep."
                }
                if (muscle == "delts") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Dumbbell Lateral Raise Instructions</strong></h5><br>1. The dumbbell lateral raise is a good exercise for building width in your upper body which gives you the V shape. Grab a set of dumbbells and stand straight up with the dumbbells at your sides.<br>2. Your palms should be facing your body. You should be holding the dumbbells slightly off your body, as this keeps the tension on the side delts. This is your starting position for the exercise.<br>3. To execute, slowly raise the dumbbells up to around shoulder height. It's important that you do not let your wrists go above your elbows while raising the weight, as this will take the work off the side delts and put it on the front delts.<br>4. Pause at the top of the movement, and then slowly lower the weight back to the starting position.<br>5. Do not let the dumbbells touch your body, and then raise them for the next rep."
                }
                if (muscle == "trapezius") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Barbell Upright Row Instructions</strong></h5><br>1. The barbell upright row is one of the best exercises for building the upper traps and shoulders. Load up a barbell with the weight you want to use and stand facing it with your feet at around shoulder width apart.<br>2. Grasp the barbell with an overhand grip (palms facing down), and hands slightly closer than shoulder width apart.<br>3. Pick the bar up, bending at the knees and keeping your back straight.<br>4. Keeping your back straight and eyes facing forwards, lift the bar straight up while keeping it as close to your body as possible (you should pull the bar up to around chest height - nearly touching your chin).<br>5. Pause, and then slowly lower the bar back to the starting position.<br>6. Repeat for desired reps."
                }
                if (muscle == "traps") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Barbell Upright Row Instructions</strong></h5><br>1. The barbell upright row is one of the best exercises for building the upper traps and shoulders. Load up a barbell with the weight you want to use and stand facing it with your feet at around shoulder width apart.<br>2. Grasp the barbell with an overhand grip (palms facing down), and hands slightly closer than shoulder width apart.<br>3. Pick the bar up, bending at the knees and keeping your back straight.<br>4. Keeping your back straight and eyes facing forwards, lift the bar straight up while keeping it as close to your body as possible (you should pull the bar up to around chest height - nearly touching your chin).<br>5. Pause, and then slowly lower the bar back to the starting position.<br>6. Repeat for desired reps."
                }
                if (muscle == "pectorals") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/reversegripbenchpress.mp4"
                }
                if (muscle == "pecs") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/reversegripbenchpress.mp4"
                }
                if (muscle == "latissimus dorsi") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/vbarpullup.mp4"
                }
                if (muscle == "spinal erectors") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/seatedcablerow.mp4"
                }
                if (muscle == "quadriceps") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/sumosquat.mp4"
                }
                if (muscle == "biceps femoris") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/legcurl.mp4"
                }
                if (muscle == "hamstrings") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/legcurl.mp4"
                }
                if (muscle == "hammies") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/reversehacksquat.mp4"
                }
                if (muscle == "gluteus maximus") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/widesmithmachinesquat.mp4"
                }
                if (muscle == "glutes") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/widesmithmachinesquat.mp4"
                }
                if (muscle == "soleus") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/standingonelegcalfraisewithdumbbell.mp4"
                }
                if (muscle == "gastrocnemius") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/smithmachinecalfraise.mp4"
                }
                if (muscle == "calves") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/smithmachinecalfraise.mp4"
                }
                if (muscle == "abs") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/hangingkneeraise.mp4"
                }
                if (muscle == "rectus abdominis") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/hangingkneeraise.mp4"
                }
                if (muscle == "external obliques") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/dumbbellsidebend.mp4"
                }
                if (muscle == "obliques") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/dumbbellsidebend.mp4"
                }
                if (muscle == "biceps") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/alternatestandingdumbbellcurl.mp4"
                }
                if (muscle == "biceps brachii") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/alternatestandingdumbbellcurl.mp4"
                }
                if (muscle == "triceps") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/standingfrenchpress.mp4"
                }
                if (muscle == "triceps brachii") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/standingfrenchpress.mp4"
                }
                if (muscle == "forearms") {
                    return document.getElementById('exerciseDescription').innerHTML = "https://cdn.muscleandstrength.com/video/wristroller.mp4"
                }
            }()
        }

    }
}.call(this));