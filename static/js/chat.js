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
                if (muscle == "lats") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/vbarpullup.mp4"
                }
                if (muscle == "spinal erectors") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/dumbbelldeadlift.mp4"
                }
                if (muscle == "quadriceps") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/sumosquat.mp4"
                }
                if (muscle == "quads") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/sumosquat.mp4"
                }
                if (muscle == "biceps femoris") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/sumosquat.mp4"
                }
                if (muscle == "hamstrings") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/legcurl.mp4"
                }
                if (muscle == "hammies") {
                    return document.getElementById('exerciseVideo').src = "https://cdn.muscleandstrength.com/video/legcurl.mp4"
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
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Reverse Grip Bench Press Instructions</strong></h5><br>1.Set up for the reverse bench press by setting the weight of the bar rack (if it's adjustable) and adding the weight plates you want to use.<br>2. Grasp the barbell with an overhand grip (palms facing down), and hands slightly closer than shoulder width apart.<br>3. Pick the bar up, bending at the knees and keeping your back straight.<br>4. Keeping your back straight and eyes facing forwards, lift the bar straight up while keeping it as close to your body as possible (you should pull the bar up to around chest height - nearly touching your chin).<br>5. Pause, and then slowly lower the bar back to the starting position.<br>6. Repeat for desired reps."
                }
                if (muscle == "pecs") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Reverse Grip Bench Press Instructions</strong></h5><br>1.Set up for the reverse bench press by setting the weight of the bar rack (if it's adjustable) and adding the weight plates you want to use.<br>2. Grasp the barbell with an overhand grip (palms facing down), and hands slightly closer than shoulder width apart.<br>3. Pick the bar up, bending at the knees and keeping your back straight.<br>4. Keeping your back straight and eyes facing forwards, lift the bar straight up while keeping it as close to your body as possible (you should pull the bar up to around chest height - nearly touching your chin).<br>5. Pause, and then slowly lower the bar back to the starting position.<br>6. Repeat for desired reps."
                }
                if (muscle == "latissimus dorsi") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>V-Bar Pull Up Instructions</strong></h5><br>1. To do the v-bar pull up you'll need a pull up bar and a v-bar. Place the v-bar over the top of the pull up bar and grip the bar with a neutral grip.<br>2. Lower your body until you're hanging off the v-bar. This is the starting position.<br>3. To execute the exercise slowly pull yourself up as far as possible. You will need to move your head to the side to avoid hitting the bar.<br>4. Pause, and then slowly lower yourself back to the starting position.<br>5. Repeat for desired reps."
                }
                if (muscle == "lats") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>V-Bar Pull Up Instructions</strong></h5><br>1. To do the v-bar pull up you'll need a pull up bar and a v-bar. Place the v-bar over the top of the pull up bar and grip the bar with a neutral grip.<br>2. Lower your body until you're hanging off the v-bar. This is the starting position.<br>3. To execute the exercise slowly pull yourself up as far as possible. You will need to move your head to the side to avoid hitting the bar.<br>4. Pause, and then slowly lower yourself back to the starting position.<br>5. Repeat for desired reps."
                }
                if (muscle == "spinal erectors") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Dumbbell Deadlift Instructions</strong></h5><br>1. Set up for the dumbbell deadlift by choosing a pair of dumbbells and placing them on the floor in front of you.<br>2. Stand with your feet at around shoulder width apart and position the dumbbells on the floor so that they are on either side of your feet.<br>3. Reach down and grab the dumbbells with a neutral grip (palms facing inward) and drop your hips.Your hips should be in the best, most natural position for leverage so you may need to raise or lower them slightly.<br>4. Make sure your eyes are looking ahead. Your body will follow your head so keep your head up and eyes forward!<br>5. Be sure to keep a straight back and never allow it to round. You are now in the starting position.<br>6. Focus on standing up with the dumbbells - not pulling them from the floor, and lead with your head as you rise.<br>7. Drive with your heals and explode upward (leading with your head) as you rise.<br>8. As the dumbbells rise to knee level, thrust your hips forward and contract your back by bringing your shoulder blades back.<br>9. Pause here for a moment and then reverse the movement by bending at the knees while slowly lowering the weight - keeping the dumbbells under strict control on the descent.<br>10. Reset your stance if necessary and repeat for desired reps."
                }
                if (muscle == "quadriceps") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Sumo Squat Instructions</strong></h5><br>1. The sumo squat is a variation of the regular squat. You will take an aggressively wide stance and point your feet further out than you would with a regular squat. Set up for the exercise by setting the barbell to just below shoulder height and loading the weight you want to use.<br>2. Stand under the bar with your feet at about shoulder width apart.<br>3. Position the bar so that it is resting on the muscles on the top of your back, not on the back of your neck. The bar should feel comfortable. If it doesn't, try adding some padding to the bar.<br>4. Now take your hands over the back and grip the bar with a wide grip for stability. You should now bend at the knees and straighten your back in preparation to take the weight off the rack.<br>5. Keeping your back straight and eyes up, push up through the legs and take the weight off the rack.<br>6. Take a small step back and stabilize yourself while positioning your feet wider than shoulder width and pointing them out.<br>7. Keeping your eyes facing forward slowly lower your body down. Don't lean forward as you come down. Your buttocks should come out and drop straight down.<br>8. Squat down until your thighs are parallel with the floor, and then slowly raise your body back up by pushing through your heels.<br>9. Do not lock the knees out when you stand up, and then repeat the movement.<br>10. Reset your stance if necessary and repeat for desired reps."
                }
                if (muscle == "quads") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Sumo Squat Instructions</strong></h5><br>1. The sumo squat is a variation of the regular squat. You will take an aggressively wide stance and point your feet further out than you would with a regular squat. Set up for the exercise by setting the barbell to just below shoulder height and loading the weight you want to use.<br>2. Stand under the bar with your feet at about shoulder width apart.<br>3. Position the bar so that it is resting on the muscles on the top of your back, not on the back of your neck. The bar should feel comfortable. If it doesn't, try adding some padding to the bar.<br>4. Now take your hands over the back and grip the bar with a wide grip for stability. You should now bend at the knees and straighten your back in preparation to take the weight off the rack.<br>5. Keeping your back straight and eyes up, push up through the legs and take the weight off the rack.<br>6. Take a small step back and stabilize yourself while positioning your feet wider than shoulder width and pointing them out.<br>7. Keeping your eyes facing forward slowly lower your body down. Don't lean forward as you come down. Your buttocks should come out and drop straight down.<br>8. Squat down until your thighs are parallel with the floor, and then slowly raise your body back up by pushing through your heels.<br>9. Do not lock the knees out when you stand up, and then repeat the movement.<br>10. Reset your stance if necessary and repeat for desired reps."
                }
                if (muscle == "biceps femoris") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Sumo Squat Instructions</strong></h5><br>1. The sumo squat is a variation of the regular squat. You will take an aggressively wide stance and point your feet further out than you would with a regular squat. Set up for the exercise by setting the barbell to just below shoulder height and loading the weight you want to use.<br>2. Stand under the bar with your feet at about shoulder width apart.<br>3. Position the bar so that it is resting on the muscles on the top of your back, not on the back of your neck. The bar should feel comfortable. If it doesn't, try adding some padding to the bar.<br>4. Now take your hands over the back and grip the bar with a wide grip for stability. You should now bend at the knees and straighten your back in preparation to take the weight off the rack.<br>5. Keeping your back straight and eyes up, push up through the legs and take the weight off the rack.<br>6. Take a small step back and stabilize yourself while positioning your feet wider than shoulder width and pointing them out.<br>7. Keeping your eyes facing forward slowly lower your body down. Don't lean forward as you come down. Your buttocks should come out and drop straight down.<br>8. Squat down until your thighs are parallel with the floor, and then slowly raise your body back up by pushing through your heels.<br>9. Do not lock the knees out when you stand up, and then repeat the movement.<br>10. Reset your stance if necessary and repeat for desired reps."
                }
                if (muscle == "hamstrings") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Leg Curl Instructions</strong></h5><br>1. The lying leg curl is a great exercise to isolate the hamstrings. Set up for the leg curl by selecting the weight you want to use on the stack and adjusting the padding to suit your leg length.<br>2. Lay face down on the machine. The padding should be positioned just above the back of your ankles. If it's higher than that, adjust the length.<br>3. Tense up the hamstrings by taking the weight slightly off the stack. This is the starting position for the exercise.<br>4. Squeeze the hamstrings and curl the weight up as far as possible.<br>5. Squeeze the hamstring hard, and then slowly lower the weight back to the starting position.<br>6. Repeat for desired reps."
                }
                if (muscle == "hammies") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Leg Curl Instructions</strong></h5><br>1. The lying leg curl is a great exercise to isolate the hamstrings. Set up for the leg curl by selecting the weight you want to use on the stack and adjusting the padding to suit your leg length.<br>2. Lay face down on the machine. The padding should be positioned just above the back of your ankles. If it's higher than that, adjust the length.<br>3. Tense up the hamstrings by taking the weight slightly off the stack. This is the starting position for the exercise.<br>4. Squeeze the hamstrings and curl the weight up as far as possible.<br>5. Squeeze the hamstring hard, and then slowly lower the weight back to the starting position.<br>6. Repeat for desired reps."
                }
                if (muscle == "gluteus maximus") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Wide Smith Machine Squat Instructions</strong></h5><br>1. Set up for the wide smith machine squat by setting the bar to around shoulder height and loading the weight you want to use on the smith machine.<br>2. Stand under the bar with your legs in a wide stance and your toes pointed slightly outward.<br>3. Grasp the bar with a wide grip and position the center of the bar on top of the muscles on your back. The bar should not sit on your neck!<br>4. Keeping your back straight and eyes facing forwards and take the weight off the rack. Take a slight step forward.<br>5. Keeping your eyes facing forwards with a straight back, slowly squat down until your thighs are parallel to the floor.<br>6. Pushing up through the heels, raise the the bar back to the starting position.<br>7. Repeat for desired reps."
                }
                if (muscle == "glutes") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Wide Smith Machine Squat Instructions</strong></h5><br>1. Set up for the wide smith machine squat by setting the bar to around shoulder height and loading the weight you want to use on the smith machine.<br>2. Stand under the bar with your legs in a wide stance and your toes pointed slightly outward.<br>3. Grasp the bar with a wide grip and position the center of the bar on top of the muscles on your back. The bar should not sit on your neck!<br>4. Keeping your back straight and eyes facing forwards and take the weight off the rack. Take a slight step forward.<br>5. Keeping your eyes facing forwards with a straight back, slowly squat down until your thighs are parallel to the floor.<br>6. Pushing up through the heels, raise the the bar back to the starting position.<br>7. Repeat for desired reps."
                }
                if (muscle == "soleus") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Standing One Leg Calf Raise With Dumbbell Instructions</strong></h5><br>1. The 1 leg calf raise holding a dumbbell is a great exercise for working the calves at home without machines. Set up by grasping a dumbbell in your right hand and standing on the edge of a calf raise block or step with the balls of your feet on the edge.<br>2. Take your right leg and hook it behind your left.<br>3. Let your left heel drop as far as possible. This is the starting position.<br>4. Keeping your body straight and eyes facing forwards, raise your left heel up as far as possible.<br>5. Pause and squeeze the calf muscle, and then slowly lower your heal back down as far as possible.<br>6. Repeat for desired reps, and then repeat on the right leg."
                }
                if (muscle == "gastrocnemius") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Smith Machine Calf Raise Instructions</strong></h5><br>1. The smith machine is a good alternative if your gym does not have a standing calf raise machine. Set the bar on the smith machine to around shoulder height and rack up the weight you want to use.<br>3. Step up on the block and position the balls of your feet on the edge.<br>4. Grasp the smith bar with a wide grip and position it across the top of your back muscles (not across the back of your neck!).<br>5. Push up to take the weight off the rack and slowly let your heels drop down as far as possible. This is the starting position.<br>6. Slowly raise your heels as far as you can off the floor.<br>7. Squeeze the calf muscles, and then slowly lower your heels back to the starting position.<br>8. Repeat for desired reps."
                }
                if (muscle == "calves") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Smith Machine Calf Raise Instructions</strong></h5><br>1. The smith machine is a good alternative if your gym does not have a standing calf raise machine. Set the bar on the smith machine to around shoulder height and rack up the weight you want to use.<br>3. Step up on the block and position the balls of your feet on the edge.<br>4. Grasp the smith bar with a wide grip and position it across the top of your back muscles (not across the back of your neck!).<br>5. Push up to take the weight off the rack and slowly let your heels drop down as far as possible. This is the starting position.<br>6. Slowly raise your heels as far as you can off the floor.<br>7. Squeeze the calf muscles, and then slowly lower your heels back to the starting position.<br>8. Repeat for desired reps."
                }
                if (muscle == "abs") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Hanging Knee Raise Instructions</strong></h5><br>1. The hanging knee raise hits your lower abs. You can hang from literally anything to do this exercise, but the most popular method using hanging from a pull up bar.<br>2. Grip the bar with hands around shoulder width apart. Increase the width if you're tall and your feet touch the floor.<br>3. Once you're hanging with your feet slightly off the floor, slowly pull your knees up keeping your legs together.<br>4. Pause for a second, and slowly lower your knees back to the starting position.<br>5. Push up to take the weight off the rack and slowly let your heels drop down as far as possible. This is the starting position."
                }
                if (muscle == "rectus abdominis") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Hanging Knee Raise Instructions</strong></h5><br>1. The hanging knee raise hits your lower abs. You can hang from literally anything to do this exercise, but the most popular method using hanging from a pull up bar.<br>2. Grip the bar with hands around shoulder width apart. Increase the width if you're tall and your feet touch the floor.<br>3. Once you're hanging with your feet slightly off the floor, slowly pull your knees up keeping your legs together.<br>4. Pause for a second, and slowly lower your knees back to the starting position.<br>5. Push up to take the weight off the rack and slowly let your heels drop down as far as possible. This is the starting position."
                }
                if (muscle == "external obliques") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Dumbbell Side Bends Instructions</strong></h5><br>1. This exercise works the obliques. Grasp a set of dumbbells. Stand straight up with one dumbbell in each hand, palms facing in.<br>2. Keep your feet firmly on the floor with a shoulder width stance.<br>3. Keeping your back straight and your eyes facing forwards, bend down to the right as far as you can, then back up again.<br>4. Without pausing at the top, bend down to the left.<br>5. Repeat for desired reps."
                }
                if (muscle == "obliques") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Dumbbell Side Bends Instructions</strong></h5><br>1. This exercise works the obliques. Grasp a set of dumbbells. Stand straight up with one dumbbell in each hand, palms facing in.<br>2. Keep your feet firmly on the floor with a shoulder width stance.<br>3. Keeping your back straight and your eyes facing forwards, bend down to the right as far as you can, then back up again.<br>4. Without pausing at the top, bend down to the left.<br>5. Repeat for desired reps."
                }
                if (muscle == "biceps") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Alternating Standing Dumbbell Curl Instructions</strong></h5><br>1. The standing dumbbell curl is a good way to correct any strength and size imbalances in the biceps as it works each muscle individually. Set up for the exercise by grasping a set of dumbbells and standing straight up with the dumbbells by your side.<br>2. Your palms should be facing up, and the dumbbells not touching your body.<br>3. Before starting the set, take up the slack by lifting up the weight slightly so the tension is on your bicep muscles.<br>4. Starting with your weakest arm (usually the left), curl the dumbbell up as far as possible.<br>5. Squeeze the bicep at the top of the exercise, and then slowly lower the weight down without it touching your body or taking the tension off your bicep.<br>6. Repeat for the other arm.<br>7. That's one rep. Now repeat for the desired amount of reps to complete the set."
                }
                if (muscle == "biceps brachii") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Alternating Standing Dumbbell Curl Instructions</strong></h5><br>1. The standing dumbbell curl is a good way to correct any strength and size imbalances in the biceps as it works each muscle individually. Set up for the exercise by grasping a set of dumbbells and standing straight up with the dumbbells by your side.<br>2. Your palms should be facing up, and the dumbbells not touching your body.<br>3. Before starting the set, take up the slack by lifting up the weight slightly so the tension is on your bicep muscles.<br>4. Starting with your weakest arm (usually the left), curl the dumbbell up as far as possible.<br>5. Squeeze the bicep at the top of the exercise, and then slowly lower the weight down without it touching your body or taking the tension off your bicep.<br>6. Repeat for the other arm.<br>7. That's one rep. Now repeat for the desired amount of reps to complete the set."
                }
                if (muscle == "triceps") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>French Press Instructions</strong></h5><br>1. Set up for the french press by loading a barbell or EZ-bar with the appropriate amount of weight and placing it on the floor in front of you.<br>2. Bend only at the knees and grasp the barbell with an overhand grip (palms facing down) with your hands about 8-12 inches apart.<br>3. Stand up straight with the bar with your feet around shoulder width apart and a slight bend in your knees.<br>4. Lift the bar above your head and bend at your elbows slightly to take the tension onto your triceps. Your palms are now facing upward. This is the starting position for the exercise.<br>5. Keeping your elbows fixed and pointing straight up toward the ceiling, slowly lower the bar down behind your head as far as comfortably possible.<br>6. Pause, and then slowly raise the bar back to the starting position.<br>7. Don't lock your elbows out, and then repeat the movement.<br>8. Repeat for desired reps."
                }
                if (muscle == "triceps brachii") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>French Press Instructions</strong></h5><br>1. Set up for the french press by loading a barbell or EZ-bar with the appropriate amount of weight and placing it on the floor in front of you.<br>2. Bend only at the knees and grasp the barbell with an overhand grip (palms facing down) with your hands about 8-12 inches apart.<br>3. Stand up straight with the bar with your feet around shoulder width apart and a slight bend in your knees.<br>4. Lift the bar above your head and bend at your elbows slightly to take the tension onto your triceps. Your palms are now facing upward. This is the starting position for the exercise.<br>5. Keeping your elbows fixed and pointing straight up toward the ceiling, slowly lower the bar down behind your head as far as comfortably possible.<br>6. Pause, and then slowly raise the bar back to the starting position.<br>7. Don't lock your elbows out, and then repeat the movement.<br>8. Repeat for desired reps."
                }
                if (muscle == "forearms") {
                    return document.getElementById('exerciseDescription').innerHTML = "<h5><strong>Wrist Rollers Instructions</strong></h5><br>1. Begin the exercise by grabbing a wrist roller with a light weight attached to it.<br>2. With the rope fully extended (not wrapped around the roller) stand straight up grasping the roller with an overhand grip (palms facing down). Your feet should be around shoulder width apart.<br>3. Extend both arms straight out in from of your body. This is the starting position.<br>4. Begin wrapping the rope around the roller by rotating each wrist, one at a time.<br>5. Continue until the weight reaches the bar, and then begin slowly lowering the weight by rotating each wrist, one at a time in a downward motion.<br>6. When the weight reaches the ground, you have completed one rep.<br>7. Repeat for desired reps."
                }
            }()
        }

    }
}.call(this));