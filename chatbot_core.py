# Import necessary dependencies
import numpy as np
from keras.models import Sequential
from keras.layers import Dense
from keras.models import model_from_json
from difflib import get_close_matches 
import json
import random
import nltk
import re


class ChatBot:
    def __init__(self):
        # Load json files
        with open("json_files/intents.json", "r") as f:
            self.intents = json.load(f)
        self.intents_list = self.intents["intents"]

        with open("json_files/help_lists.json", "r") as f:
            self.help_lists = json.load(f)
        self.higher_level_list = self.help_lists["higher_level_list"]
        self.body_parts_muscles_list = self.help_lists["body_parts_muscles_list"]
        
        with open("json_files/body_muscle_dict.json", "r") as f:
            self.body_muscle_dict = json.load(f)

        # BOW
        self.words = []
        self.classes = []
        self.documents = []
        self.ignore_words = [".", ",", "?"]
        self.similar_words_list = ["have", "some", "love", "cheese"]

        # Two lists
        self.key_words_list = []
        self.perfect_match_list = []

        # For matching mode
        self.matching_dict = {"matching_mode": False, "list_to_match": []}

        # Sentence class
        self.sentence_class = None

        # Info dict
        self.info_dict = {"tag": None, "info": []}

        # Load pretrained deep learning model
        # Load model
        json_file = open('model/model.json', 'r')
        loaded_model_json = json_file.read()
        self.model = model_from_json(loaded_model_json)
        # Load weights
        self.model.load_weights("weights/weights.h5")
        # Compile the model
        self.model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        self.model._make_predict_function()

        # Error threshold
        self.ERROR_THRESHOLD = 0.25

        # Fill the BOW lists
        self.fill_BOW_lists()

        self.exercise_response = False

    
    def clean_up_sentence(self, sentence):
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [word.lower() for word in sentence_words if word not in self.ignore_words]

        return sentence_words
    

    def fill_BOW_lists(self):
        for intent in self.intents["intents"]:
            for sentence in intent["patterns"]:
                ws = self.clean_up_sentence(sentence)
                self.words.extend(ws)
                self.documents.append((ws, intent["tag"]))
                if intent["tag"] not in self.classes:
                    self.classes.append(intent["tag"])
        
        self.words = sorted(list(set(self.words)))
    

    def bow(self, sentence, show_details=False):
        sentence_words = self.clean_up_sentence(sentence)
        bag = [0] * len(self.words)
        for w in sentence_words:
            if w in self.words:
                bag[self.words.index(w)] = 1
                if show_details:
                    print(f"Found in bag: {w}")
        
        return np.array(bag)
    

    def classify(self, sentence):
        X_in = self.bow(sentence)
        X_in = X_in[np.newaxis, :]
        probs = self.model.predict(X_in)[0]
        results = [[i, p] for i, p in enumerate(probs) if p > self.ERROR_THRESHOLD]
        results.sort(key=lambda x: x[1], reverse=True)
        return_list = []
        for r in results:
            return_list.append((self.classes[r[0]], r[1]))
        
        return return_list
    

    def __key_word_match(self, list_to_match, key_word):
        key_word_to_return = None
        if key_word in list_to_match:
            key_word_to_return = key_word
        if key_word == "quit":
            key_word_to_return = key_word
            self.matching_dict["matching_mode"] = False
            self.matching_dict["list_to_match"] = []

        return key_word_to_return


    def __response_for_no_match(self):
        if len(self.key_words_list) == 0:
            response = "Seems like the key word in your sentence is not in my database!\nPlease try some other key words!"
        else:
            response = "I didn't find the exact matching key word in my database, but I found some similar ones.\nIs the keyword in your question in the following list please?\n\n"
            for item in self.key_words_list:
                response = response + item + "\n"
            response = response + "\nIf the key word you are interested is in the above list, please type in it, or type in 'quit' to start typing in new questions."
            self.matching_dict["matching_mode"] = True 
            self.matching_dict["list_to_match"] = self.key_words_list

        return response


    def __response_for_one_match(self, key_word):
        if self.sentence_class == "exercise":
            if key_word in self.higher_level_list:
                if key_word == "legs":
                    response = f"OK! Show the exercise for {key_word} now!" + f"\nPlease pick a specific muscle below to train for {key_word}.\n\n"
                    list_to_match = []
                    for item in ["upper legs", "lower legs"]:
                        for it in self.body_muscle_dict[item]["muscles"]:
                            list_to_match.append(it["name"])
                            response = response + it["name"] + "\n"
                    response = response + "\n"
                    self.matching_dict["matching_mode"] = True
                    self.matching_dict["list_to_match"] = list_to_match
                else:
                    response = f"OK! Show the exercise for {key_word} now!" + f"\nPlease pick a specific muscle below to train for {key_word}.\n\n"
                    list_to_match = []
                    for key in self.body_muscle_dict.keys():
                        if key == key_word or key_word in self.body_muscle_dict[key]["syn"]:
                            for item in self.body_muscle_dict[key]["muscles"]:
                                list_to_match.append(item["name"])
                                response = response + item["name"] + "\n"
                    response = response + "\n"
                    self.matching_dict["matching_mode"] = True
                    self.matching_dict["list_to_match"] = list_to_match
            else:
                response = f"OK! Show the exercise for {key_word} now!"
                self.info_dict["tag"] = self.sentence_class
                self.info_dict["info"] = key_word
                self.matching_dict["matching_mode"] = False
                self.matching_dict["list_to_match"] = []
                self.key_words_list = []
                self.perfect_match_list = []
        
        if self.sentence_class == "identification":
            if key_word in self.higher_level_list:
                # response = f"OK! Show the location of the muscles for {key_word} on the SVG!"
                response = f"OK! Check the images to see the {key_word} muscles highlighted in red!"
            else:
                # response = f"OK! Show the location of {key_word} on the SVG!"
                response = f"OK! Check the images to see the {key_word} muscle highlighted in red!"
            self.info_dict["tag"] = self.sentence_class
            self.info_dict["info"] = key_word
            self.matching_dict["matching_mode"] = False
            self.matching_dict["list_to_match"] = []
            self.key_words_list = []
            self.perfect_match_list = []
        
        return response
    

    def __response_for_multi_match(self):
        response = "I see multiple keywords in your question, please pick one of them: \n\n"
        for w in self.perfect_match_list:
            response = response + w + "\n"
        self.matching_dict["matching_mode"] = True
        self.matching_dict["list_to_match"] = self.perfect_match_list

        return response
        
    
    def __other_responses(self):
        for item in self.intents_list:
            if item["tag"] == self.sentence_class:
                response = random.choice(item["responses"])

        return response
            
    
    def __generate_match_response(self, sentence):
        sentence = sentence.strip().lower()
        key_word_to_return = self.__key_word_match(self.matching_dict["list_to_match"], sentence)
        if key_word_to_return is None:
            response = "Sorry, there is no match for the key word you just typed in.\nPlease type in the key word again or type in 'quit' to start typing in new questions."
        elif key_word_to_return == "quit":
            response = "OK, you can start typing in new questions now."
            self.key_words_list = []
            self.perfect_match_list = []
        else:
            response = self.__response_for_one_match(key_word_to_return)
            # Reset matching_dict
            self.matching_dict["matching_mode"] = False
            self.matching_dict["list_to_match"] = []
        
        return response
    

    def __generate_match_response2(self, sentence):
        sentence = sentence.strip().lower()
        key_word_to_return = self.__key_word_match(self.matching_dict["list_to_match"], sentence)
        if key_word_to_return is None:
            response = "Sorry, there is no match for the key word you just typed in.\nPlease type in the key word again or type in 'quit' to start typing in new questions."
        elif key_word_to_return == "quit":
            response = "OK, you can start typing in new questions now."
        else:
            self.sentence_class = key_word_to_return
            response = self.__generate_inner_response()
        
        return response

 
    def __generate_match_lists(self, sentence):
        self.key_words_list = []
        sentence_words = self.clean_up_sentence(sentence)
        for w in sentence_words:
            if w not in self.similar_words_list:
                self.key_words_list.extend(get_close_matches(w, self.body_parts_muscles_list))
        self.key_words_list = list(set(self.key_words_list))
        if len(self.key_words_list) != 0:
            self.perfect_match_list = []
            for w in self.key_words_list:
                if re.search(w, sentence.strip().lower()) or (w.endswith("s") and re.search(w[:-1], sentence.strip().lower())) or (w.endswith("es") and re.search(w[:-2], sentence.strip().lower())):
                    self.perfect_match_list.append(w)
            self.perfect_match_list = list(set(self.perfect_match_list))
            # Some fine tuning, which can be modified later
            ##############################################################################################
            if "biceps brachii" in self.perfect_match_list and "biceps" in self.perfect_match_list:
                self.perfect_match_list.remove("biceps")
            if "triceps brachii" in self.perfect_match_list and "triceps" in self.perfect_match_list:
                self.perfect_match_list.remove("triceps")
            if "external obliques" in self.perfect_match_list and "obliques" in self.perfect_match_list:
                self.perfect_match_list.remove("obliques")
            if ("upper legs" in self.perfect_match_list and "legs" in self.perfect_match_list) or ("lower legs" in self.perfect_match_list and "legs" in self.perfect_match_list):
                self.perfect_match_list.remove("legs")
            if "beer belly" in self.perfect_match_list and "belly" in self.perfect_match_list:
                self.perfect_match_list.remove("belly")
            if "pectorals" in self.perfect_match_list and "pecs" in self.perfect_match_list:
                self.perfect_match_list.remove("pecs")
            if "gluteus maximus" in self.perfect_match_list and "glutes" in self.perfect_match_list:
                self.perfect_match_list.remove("glutes")    
            ##############################################################################################
            # problem with legs now
        print(self.key_words_list)
        print(self.perfect_match_list)


    def __generate_inner_response(self):
        if len(self.perfect_match_list) == 0:
            response = self.__response_for_no_match()
        elif len(self.perfect_match_list) == 1:
            response = self.__response_for_one_match(self.perfect_match_list[0])
        else:
            response = self.__response_for_multi_match()
        
        self.exercise_response = False
        
        return response
    


    def generate_chat_response(self, sentence):
        # Reset info_dict
        self.info_dict["tag"] = None
        self.info_dict["info"] = []

        if self.exercise_response == True:
            self.__generate_match_lists(sentence)
            response = self.__generate_inner_response()
        else:

            if self.matching_dict["matching_mode"] == True:
                if "exercise" in self.matching_dict["list_to_match"] and "identification" in self.matching_dict["list_to_match"]:
                    response = self.__generate_match_response2(sentence)
                else:
                    response = self.__generate_match_response(sentence)

            else:
                if not nltk.word_tokenize(sentence):
                    response = "Please type in something!"
                else:
                    classify_list = self.classify(sentence)
                    if len(classify_list) > 1 and classify_list[0][0] == "identification" and classify_list[0][1] == "noanswer":
                        self.sentence_class = "noanswer"
                    else:
                        self.sentence_class = classify_list[0][0]

                    if self.sentence_class == "exercise":
                        self.__generate_match_lists(sentence)
                        if len(self.key_words_list) == 0:
                            response = "OK! Seems like you want some exercise!\nPlease let me know which part of your body you want to exercise."
                            self.exercise_response = True
                        else:
                            response = self.__generate_inner_response()
                    
                    elif self.sentence_class == "identification":
                        self.__generate_match_lists(sentence)
                        if len(self.key_words_list) == 0:
                            "Seems like the key word in your sentence is not in my database!\nPlease try some other key words!"
                        else:
                            response = self.__generate_inner_response()
                    
                    elif self.sentence_class == "noanswer":
                        self.__generate_match_lists(sentence)
                        if len(self.key_words_list) == 0:
                            response = self.__other_responses()
                        else:
                            response = "Would you like to see the muscle location(s) or view an exercise instructional video?\nPlease type in 'exercise' or 'identification' to continue."
                            self.matching_dict["matching_mode"] = True
                            self.matching_dict["list_to_match"] = ["exercise", "identification"]
                    
                    else:
                        response = self.__other_responses()
        
        return response





                





                

            



