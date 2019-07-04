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
        # BOW
        self.words = []
        self.classes = []
        self.documents = []
        self.ignore_words = [".", ",", "?"]
        # For matching mode
        self.matching_dict = {"matching_mode": False, "list to match": []}
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
        # Error threshold
        self.ERROR_THRESHOLD = 0.25
        # Fill the BOW lists
        self.fill_BOW_lists()


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
            self.matching_dict["list to match"] = []
        return key_word_to_return
    

    def __response_for_no_match(self, key_words_list):
        response = "I didn't find the exact matching key word in my database, but I found some similar ones.\nIs the keyword in your question in the following list please?\n"
        for item in key_words_list:
            response = response + item + "\n"
        response = response + "\nPlease type in one exact matching word or phrase, or ask another question."
        self.matching_dict["matching_mode"] = True 
        self.matching_dict["list to match"] = key_words_list
        return response


    def __response_for_one_match(self, key_word):
        if self.sentence_class == "exercise":
            if key_word in self.higher_level_list:
                response = f"OK! Show the exercise for {key_word} now!" + f"\nPlease pick a specific muscle to train for {key_word}."
            else:
                response = f"OK! Show the exercise for {key_word} now!"
        if self.sentence_class == "identification":
            if key_word in self.higher_level_list:
                response = f"OK! Show the location of the muscles for {key_word} on the SVG!"
            else:
                response = f"OK! Show the location of {key_word} on the SVG!"

        self.info_dict["tag"] = self.sentence_class
        self.info_dict["info"] = key_word

        return response

    
    def __response_for_multi_match(self, perfect_match_list):
        response = "I see multiple keywords in your question, please pick one of them: \n\n"
        for w in perfect_match_list:
            response = response + w + "\n"
        self.matching_dict["matching_mode"] = True
        self.matching_dict["list to match"] = perfect_match_list
        return response
    

    def __other_responses(self):
        for item in self.intents_list:
            if item["tag"] == self.sentence_class:
                response = random.choice(item["responses"])
        return response


    def generate_chat_response(self, sentence, show_details=False):
        # Reset info_dict
        self.info_dict["tag"] = None
        self.info_dict["info"] = []

        if self.matching_dict["matching_mode"] == True:
            key_word_to_return = self.__key_word_match(self.matching_dict["list to match"], sentence)
            if key_word_to_return is None:
                response = "Sorry, there is no match for the key word you just typed in.\nPlease type in the key word again or type 'quit' to start typing in new questions."
            elif key_word_to_return == "quit":
                response = "OK, you can start typing in new questions now."
            else:
                response = self.__response_for_one_match(key_word_to_return)
                self.matching_dict["matching_mode"] = False
                self.matching_dict["list to match"] = []
        else:
            classify_list = self.classify(sentence)
            self.sentence_class = classify_list[0][0]
            if self.sentence_class == "exercise" or self.sentence_class == "identification":
                key_words_list = []
                sentence_words = self.clean_up_sentence(sentence)
                for w in sentence_words:
                    if w != "have":
                        key_words_list.extend(get_close_matches(w, self.body_parts_muscles_list))
                key_words_list = list(set(key_words_list))
                if show_details:
                    print(f"key words list: {key_words_list}")
                if len(key_words_list) == 0:
                    response = "Seems like the key word in your sentence is not in my database!\nPlease try some other key words!"
                else:
                    perfect_match_list = []
                    for w in key_words_list:
                        if re.search(w, sentence) or (w.endswith("s") and re.search(w[:-1], sentence)) or (w.endswith("es") and re.search(w[:-2], sentence)):
                            perfect_match_list.append(w)
                    perfect_match_list = list(set(perfect_match_list))
                    # Some fine tuning, which can be modified later
                    ##############################################################################################
                    if "biceps brachii" in perfect_match_list and "biceps" in perfect_match_list:
                        perfect_match_list.remove("biceps")
                    if "triceps brachii" in perfect_match_list and "triceps" in perfect_match_list:
                        perfect_match_list.remove("triceps")
                    if "external obliques" in perfect_match_list and "obliques" in perfect_match_list:
                        perfect_match_list.remove("obliques")
                    ##############################################################################################
                    if show_details:
                        print(f"perfect match list: {perfect_match_list}")
                    if len(perfect_match_list) == 0:
                        response = self.__response_for_no_match(key_words_list)
                    elif len(perfect_match_list) == 1:
                        response = self.__response_for_one_match(perfect_match_list[0])
                    else:
                        response = self.__response_for_multi_match(perfect_match_list)
            else:
                response = self.__other_responses()
        
        return response



