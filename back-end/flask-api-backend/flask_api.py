import time
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from office365.runtime.auth.authentication_context import AuthenticationContext
from office365.sharepoint.client_context import ClientContext
from office365.sharepoint.files.file import File
import os
from elasticsearch import Elasticsearch
import tensorflow as tf
import numpy as np 
import pandas as pd
import matplotlib.pyplot as plt
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk import word_tokenize
STOPWORDS = set(stopwords.words('english'))

app = Flask(__name__)
CORS(app, support_credentials=True)


df=pd.read_csv("new-bbc-text.csv")

global_intent = "business"


space = re.compile('[/(){}\[\]\|@,;]')
symbols= re.compile('[^0-9a-z #+_]')
STOPWORDS = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower() # lowercase text
    text = space.sub(' ', text) # replace REPLACE_BY_SPACE_RE symbols by space in text. substitute the matched string in REPLACE_BY_SPACE_RE with space.
    text = symbols.sub('', text) # remove symbols which are in BAD_SYMBOLS_RE from text. substitute the matched string in BAD_SYMBOLS_RE with nothing. 
    text = text.replace('x', '')
    text = ' '.join(word for word in text.split() if word not in STOPWORDS) # remove stopwors from text
    return text

df['text']=df['text'].apply(clean_text)

tokenizer = Tokenizer(num_words=50000, filters='!"#$%&()*+,-./:;<=>?@[\]^_`{|}~', lower=True)
tokenizer.fit_on_texts(df['text'].values)


model1 = tf.keras.models.load_model("bbcLSTMNew.model")


@app.route('/', methods=['GET'])
def index():  
    return("Hello world")


@app.route('/userQuery', methods = ['GET','POST'])
def userQuery():
    dirPath = request.json
    print(dirPath)

    new_complaint = [dirPath] 
    seq = tokenizer.texts_to_sequences(new_complaint)
    padded = pad_sequences(seq, maxlen=3000)
    pred = model1.predict(padded)
 
    labels = ['business','entertainment','politics','sport','tech']
    print(pred, labels[np.argmax(pred)])

    arrProbVal = {
        'business':str(pred[0][0]),
        'entertainment': str(pred[0][1]),
        'politics':str(pred[0][2]),
        'sport': str(pred[0][3]),
        'tech':str(pred[0][4]),
    }

    json_object = json.dumps(arrProbVal) 

    return (json_object)


@app.route('/crawlDir', methods = ['GET','POST'])
def crawlDir():
    dirPath = request.json
    print(dirPath['val'])
    print(dirPath['query'])

    global_intent = dirPath['val']

    res = getFilesFromElasticsearch(dirPath['val'], dirPath['query'])
    return jsonify(res['hits']['hits'])

@app.route('/bertExtSum', methods=['GET','POST'])
def bertExtSum():

    from summarizer import Summarizer
    model = Summarizer()

    get_para_summary=open('sports_test.txt', encoding="utf8", errors='ignore').read()

    from gensim.parsing.preprocessing import remove_stopwords
    filtered_sentence = remove_stopwords(get_para_summary)
    
    result = model(filtered_sentence, min_length=20)
    summary = "".join(result)
      
    return(summary)

@app.route('/sharepoint-connect', methods=['GET','POST'])
def connectToSharepoint():

    server_url = "<ADD SHARE POINT URL>"
    site_url = server_url + "/sites/<NAME>"
    username = "<EMAIL ID>"
    password = "<PASSWORD>"
    ctx_auth = AuthenticationContext(site_url)
    ctx_auth.acquire_token_for_user(username, password)   
    ctx = ClientContext(site_url, ctx_auth)
    saveFilesToElasticSearch(ctx, server_url)


def saveFilesToElasticSearch(ctx, server_url):
    list_object = ctx.web.lists.get_by_title("Documents")
    folder = list_object.rootFolder        
    ctx.load(folder)
    ctx.execute_query()

    folders = folder.folders
    ctx.load(folders)
    ctx.execute_query()

    es = Elasticsearch(
    ["https://elastic:RZpr3cb5xWqMKpnzEi2JL22R@884bbc0d58c74e63aae612cee67cf2e7.us-east-1.aws.found.io:9243"])

    # "https://elastic:RZpr3cb5xWqMKpnzEi2JL22R@884bbc0d58c74e63aae612cee67cf2e7.us-east-1.aws.found.io:9243"


    for myfolder in folders:
        if(myfolder.properties["Name"] != 'Forms'):
            print("File name: {0}".format(myfolder.properties["Name"]))
            files = myfolder.files
            #folder_path = os.path.join(download_path, myfolder.properties["Name"])
            #os.mkdir(folder_path)
            ctx.load(files)
            ctx.execute_query()
            index = 1
            for file in files:
                print("File name: {0}".format(file.properties["Name"]))
                print("Downloading file: {0} ...".format(file.properties["ServerRelativeUrl"]))
                download_file_name = file.properties["Name"]
                es.index(index=myfolder.properties["Name"].lower(), doc_type="test-type", id=index, body={"name": download_file_name, "location" : server_url+file.properties["ServerRelativeUrl"], "content":file.read().decode("utf-8") })
                index+= 1

def getFilesFromElasticsearch(intent_predicted, query):
    es = Elasticsearch(
    ["https://elastic:RZpr3cb5xWqMKpnzEi2JL22R@884bbc0d58c74e63aae612cee67cf2e7.us-east-1.aws.found.io:9243"])

    doc = {
        'size' : 10,
        'query': {
            'match' : {
                "content": query
            }
       }
    }
    res = es.search(index=intent_predicted, doc_type='test-type', body=doc)
    return res

app.run(port=5000, debug=True)