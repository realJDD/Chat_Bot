$(document).ready(function(){

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

    $(function(){
        // Get input text from input box
        function getMessageText(){
            let $message_input = $('.message_input');
            return $message_input.val();
        }

        // Send user input to back end
        function sendToBackend(text){
            let user_input = new Object();
            user_input.text = text;
            let data = JSON.stringify(user_input);

            $.ajax({
                url: "/sendjson",
                type: "POST",
                dataType: 'json',
                data: data,
                contentType:"application/json; charset=UTF-8"
            });
        }

        // Display message
        function displayMessage(text, message_side){
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
        async function getResponse(){
            // let response_object = await d3.json(`/sendjson`);
            // let response = response_object["response"];
            let response_list = await d3.json(`/sendjson`);
            let response = response_list[0]["response"];
            console.log(response);
            displayMessage(response, "left")
        }

        // Generate a welcome response
        getResponse();

        // When user clicks on "Send" button
        $('.send_message').click(function () {

            displayMessage(getMessageText(), "right");
            sendToBackend(getMessageText());
            setTimeout(function(){getResponse()}, 1000)

        });

        // When user hits "Enter"
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                displayMessage(getMessageText(), "right");
                sendToBackend(getMessageText());
                setTimeout(function(){getResponse()}, 1000)
            }
        });
    })


}.call(this));






