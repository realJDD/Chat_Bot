from chatbot_core import ChatBot

chatbot = ChatBot()

bot_response = "Hi, I am JARVIS, I am here to help you with exercise or muscle questions."

while True:
    print("\n")
    print(bot_response)
    print("\n")
    print(chatbot.info_dict)
    print("\n")

    user_input = input("User input: ")

    bot_response = chatbot.generate_chat_response(user_input)



