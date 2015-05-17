# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup as bs
from compiler.ast import flatten
import urllib, json, re

naverComicUrl = 'http://comic.naver.com'
naverComicListUrl = naverComicUrl + '/webtoon/creation.nhn?view=image'


def init_thumbnails():
	naverComicData = urllib.urlopen(naverComicListUrl).read()
	naverComicSoup = bs(naverComicData)
	thumbnailDivisions = naverComicSoup.find_all('div', 'thumb')
	thumbnails = [{'title': td.a['title'], 'href': td.a['href'], 'imgsrc': td.a.img['src'], 'id': re.search('[0-9]+', td.a['href']).group(0)} for td in thumbnailDivisions]

	for thumbnail in thumbnails:
		print 'Getting Stars from ' + thumbnail['title'].encode('utf-8')
		thumbnail['stars'] = makeStarList(thumbnail['href'])
		thumbnail['author'] = getAuthor(thumbnail['href'])

	with open('static/thumbnails.json', 'w') as fp:
		json.dump(thumbnails, fp)

def endPageNum(href):
	return int(bs(urllib.urlopen(naverComicUrl + href + '&page=1000').read()).find_all('span', 'current')[0].string)

def makeStarList(href):
	pages = [naverComicUrl + href + '&page=' + str(num) for num in xrange(1, endPageNum(href) + 1)]
	stars = [[float(star.string) for star in [x.find_all('strong')[0] for x in bs(urllib.urlopen(page).read()).find_all('div', 'rating_type')]] for page in pages][::-1]
	return flatten(stars)

def getAuthor(href):
	return bs(urllib.urlopen(naverComicUrl + href).read()).find_all('span', 'wrt_nm')[0].string


if __name__ == '__main__':
	init_thumbnails()