# -*- coding: utf-8 -*-

from flask import Flask, make_response, render_template, request, redirect, Response
from crawler import init_thumbnails
import json, random

app = Flask(__name__)

@app.route('/')
def index():
	with open('static/thumbnails.json', 'rb') as fp:
		thumbnails = json.load(fp)
	return render_template('index.html', thumbnails=thumbnails, start=random.choice(thumbnails))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=12345)
