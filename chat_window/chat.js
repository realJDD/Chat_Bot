(function () {
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
        var getMessageText, message_side, sendMessage, responseMessage;
        message_side = 'right';

        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };

        sendMessage = function (text) {
            var $messages, message;

            if (text.trim() === '') {
                return;
            }

            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'right' ? 'left' : 'right';

            message = new Message({
                text: text,
                message_side: message_side
            });

            message.draw();

            return $messages.animate({
                scrollTop: $messages.prop('scrollHeight')
            }, 300);
        };

        responseMessage = function (text) {
            var $messages, message;

            if (text.trim() === '') {
                return;
            }

            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'right' ? 'left' : 'right';

            message = new Message({
                text: text,
                message_side: message_side
            });

            message.draw();

            return $messages.animate({
                scrollTop: $messages.prop('scrollHeight')
            }, 300);
        };

        botMessage = function(){
            return ('place holder for chatbot message')
        }

        $('.send_message').click(function (e) {
            // console.log(getMessageText());
            return [sendMessage(getMessageText()), responseMessage(botMessage())]
        });
        
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return [sendMessage(getMessageText()), responseMessage(botMessage())]
            }
        });
      
    });
}.call(this));