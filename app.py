# -*- coding: utf-8 -*-

from flask import Flask, make_response, render_template, request, redirect, Response
from crawler import init_thumbnails
import json, random

app = Flask(__name__)

with open('static/thumbnails.json', 'rb') as fp:
	thumbnails = json.load(fp)

titles = [thumbnail['title'] for thumbnail in thumbnails]
thumbnails_idn = dict((t['id'], t) for t in thumbnails)

@app.route('/')
def index():
	global thumbnails, titles
	return render_template('index.html', thumbnails=thumbnails, start=random.choice(thumbnails), titles = titles)

@app.route('/<idn>')
def index_with_idn(idn):
	global thumbnails, titles, thumbnails_idn
	if idn in thumbnails_idn.keys():
		return render_template('index.html', thumbnails=thumbnails, start=thumbnails_idn[idn], titles = titles)
	else:
		return render_template('index.html', thumbnails=thumbnails, start=random.choice(thumbnails), titles = titles)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=12345)
